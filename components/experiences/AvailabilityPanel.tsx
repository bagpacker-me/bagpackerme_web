'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { AvailabilityOption, AvailabilityResult, ExperienceDetail } from '@/types/experiences';

function formatInr(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(value || 0));
}

/**
 * CHECK AVAILABILITY → ADD TO MY TRIP, the two steps the flow puts between an
 * experience page and the fork.
 *
 * The date list comes from the cached schedule, so it is a hint. Nothing here
 * claims a price until the live check has come back, because the price a
 * traveller sees on this panel is the one they will be charged at Viator.
 */
export function AvailabilityPanel({ experience }: { experience: ExperienceDetail }) {
  const [travelDate, setTravelDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<AvailabilityResult | null>(null);
  const [selected, setSelected] = useState<AvailabilityOption | null>(null);

  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');

  // A date the schedule never offers is worth flagging before we spend a live
  // Viator call on it — but it is never blocked, because the schedule is a hint.
  const dateLooksClosed =
    travelDate.length > 0 &&
    experience.availableDates.length > 0 &&
    !experience.availableDates.includes(travelDate);

  async function handleCheck() {
    setError('');
    setResult(null);
    setSelected(null);
    setAdded(false);

    if (!travelDate) {
      setError('Pick a date first.');
      return;
    }

    setChecking(true);

    try {
      const response = await fetch('/api/experiences/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productCode: experience.productCode,
          travelDate,
          adults,
          children,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? 'We could not check availability just now.');
        return;
      }

      setResult(data as AvailabilityResult);
      const first = (data.options ?? []).find((option: AvailabilityOption) => option.available);
      if (first) setSelected(first);
    } catch {
      setError('We could not reach the availability service. Please try again.');
    } finally {
      setChecking(false);
    }
  }

  async function handleAdd() {
    if (!selected || !result) return;

    setError('');
    setAdding(true);

    try {
      const response = await fetch('/api/trip/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productCode: experience.productCode,
          title: experience.title,
          destinationSlug: experience.destinationSlug,
          travelDate: result.travelDate,
          adults: result.adults,
          children: result.children,
          productOptionCode: selected.productOptionCode,
          startTime: selected.startTimes[0] ?? '',
          priceInr: selected.priceInr,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? 'We could not add that to your trip.');
        return;
      }

      setAdded(true);
    } catch {
      setError('We could not add that to your trip. Please try again.');
    } finally {
      setAdding(false);
    }
  }

  return (
    <aside className="rounded-xl border border-border bg-card p-5 lg:sticky lg:top-24">
      <p className="text-sm text-muted-foreground">
        From{' '}
        <span className="text-xl font-semibold text-foreground">
          {formatInr(experience.fromPriceInr)}
        </span>
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="travelDate" className="block text-sm font-medium">
            Date
          </label>
          <input
            id="travelDate"
            type="date"
            value={travelDate}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(event) => {
              setTravelDate(event.target.value);
              setResult(null);
              setAdded(false);
            }}
            className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />

          {dateLooksClosed ? (
            <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400">
              This experience does not usually run that day. Check anyway — schedules change.
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="adults" className="block text-sm font-medium">
              Adults
            </label>
            <input
              id="adults"
              type="number"
              min={1}
              max={20}
              value={adults}
              onChange={(event) => {
                setAdults(Math.max(1, Number(event.target.value) || 1));
                setResult(null);
                setAdded(false);
              }}
              className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="children" className="block text-sm font-medium">
              Children
            </label>
            <input
              id="children"
              type="number"
              min={0}
              max={20}
              value={children}
              onChange={(event) => {
                setChildren(Math.max(0, Number(event.target.value) || 0));
                setResult(null);
                setAdded(false);
              }}
              className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        <Button type="button" onClick={handleCheck} disabled={checking} className="w-full">
          {checking ? 'Checking…' : 'Check availability'}
        </Button>
      </div>

      {error ? (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {result && !result.available ? (
        <p className="mt-4 rounded-md bg-muted p-3 text-sm text-muted-foreground">
          {/* A failed lookup and a sold-out date are different problems, and the
              traveller can only act on one of them. */}
          {result.unavailableReason === 'LOOKUP_FAILED'
            ? (result.message ?? 'We could not reach Viator for live availability. Please try again in a moment.')
            : 'Nothing available on that date. Try another one — or add it to a trip and we will find an alternative.'}
        </p>
      ) : null}

      {result?.available ? (
        <div className="mt-5 space-y-3">
          <p className="text-sm font-medium">Available options</p>

          {result.options.map((option) => (
            <label
              key={option.productOptionCode}
              className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 text-sm transition-colors ${
                selected?.productOptionCode === option.productOptionCode
                  ? 'border-primary bg-accent'
                  : 'border-border hover:bg-accent/50'
              }`}
            >
              <input
                type="radio"
                name="availabilityOption"
                className="mt-1"
                checked={selected?.productOptionCode === option.productOptionCode}
                onChange={() => setSelected(option)}
              />
              <span className="flex-1">
                <span className="block font-medium">{formatInr(option.priceInr)}</span>
                {option.startTimes.length > 0 ? (
                  <span className="block text-muted-foreground">
                    Departs {option.startTimes.slice(0, 4).join(', ')}
                  </span>
                ) : null}
              </span>
            </label>
          ))}

          {added ? (
            <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3">
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                Added to your trip.
              </p>
              <Link
                href="/my-trip"
                className="mt-2 inline-block text-sm font-medium underline underline-offset-4"
              >
                View my trip and choose how to book
              </Link>
            </div>
          ) : (
            <Button
              type="button"
              variant="secondary"
              onClick={handleAdd}
              disabled={adding || !selected}
              className="w-full"
            >
              {adding ? 'Adding…' : 'Add to my trip'}
            </Button>
          )}

          <p className="text-xs text-muted-foreground">
            Adding costs nothing and books nothing. You choose between an instant booking and a
            full-trip quote on the next screen.
          </p>
        </div>
      ) : null}
    </aside>
  );
}
