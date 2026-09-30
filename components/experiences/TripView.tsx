'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { HoneypotField } from '@/components/ui/HoneypotField';
import { HONEYPOT_FIELD } from '@/lib/honeypot';
import type { TripItem, TripSummary } from '@/types/experiences';

function formatInr(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(value || 0));
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * The fork, rendered. Both routes are offered on equal footing rather than
 * nudging toward one: an instant booking earns commission today, a full-trip
 * enquiry is worth considerably more if it converts, and which one suits the
 * traveller is genuinely their call.
 */
export function TripView({ trip }: { trip: TripSummary }) {
  const router = useRouter();

  const [busyItemId, setBusyItemId] = useState('');
  const [error, setError] = useState('');

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<{ itemCount: number } | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const liveItems = trip.items.filter((item) => item.status !== 'removed');

  async function handleBook(item: TripItem) {
    setError('');
    setBusyItemId(item.itemId);

    try {
      const response = await fetch('/api/trip/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.itemId }),
      });

      const data = await response.json();

      if (!response.ok || !data.redirectUrl) {
        setError(data.error ?? 'We could not open that booking. Please try again.');
        return;
      }

      // Top-level navigation, not a fetch hop: the traveller needs to see the
      // Viator domain they are about to pay on.
      window.location.href = data.redirectUrl;
    } catch {
      setError('We could not open that booking. Please try again.');
    } finally {
      setBusyItemId('');
    }
  }

  async function handleRemove(item: TripItem) {
    setError('');
    setBusyItemId(item.itemId);

    try {
      const response = await fetch('/api/trip/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.itemId }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error ?? 'We could not update your trip.');
        return;
      }

      router.refresh();
    } catch {
      setError('We could not update your trip. Please try again.');
    } finally {
      setBusyItemId('');
    }
  }

  async function handleEnquiry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSending(true);

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch('/api/trip/enquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          phone: form.get('phone'),
          notes: form.get('notes'),
          [HONEYPOT_FIELD]: honeypotRef.current?.value ?? '',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? 'We could not send your itinerary. Please try again.');
        return;
      }

      setSent({ itemCount: data.itemCount ?? liveItems.length });
    } catch {
      setError('We could not send your itinerary. Please try again.');
    } finally {
      setSending(false);
    }
  }

  if (liveItems.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-muted/40 p-8 text-center">
        <h2 className="font-semibold">Your trip is empty</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Pick a destination, find something you like, and add it here. Nothing is booked until you
          say so.
        </p>
        <Link
          href="/destinations"
          className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Browse destinations
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {error ? (
        <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <section>
        <ul className="divide-y divide-border rounded-xl border border-border">
          {liveItems.map((item) => (
            <li key={item.itemId} className="flex flex-wrap items-start gap-4 p-5">
              <div className="min-w-[14rem] flex-1">
                <Link
                  href={`/experiences/${encodeURIComponent(item.productCode)}`}
                  className="font-medium hover:underline"
                >
                  {item.title}
                </Link>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDate(item.travelDate)} · {item.travellers}{' '}
                  {item.travellers === 1 ? 'traveller' : 'travellers'}
                  {item.startTime ? ` · ${item.startTime}` : ''}
                </p>
                {item.status === 'booking' ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    You were sent to Viator for this one.
                  </p>
                ) : null}
              </div>

              <div className="flex items-center gap-3">
                <span className="font-medium">{formatInr(item.priceInr)}</span>

                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleBook(item)}
                  disabled={busyItemId === item.itemId}
                >
                  {busyItemId === item.itemId ? 'Opening…' : 'Book now'}
                </Button>

                <button
                  type="button"
                  onClick={() => handleRemove(item)}
                  disabled={busyItemId === item.itemId}
                  className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-right text-sm text-muted-foreground">
          Indicative total{' '}
          <span className="text-base font-semibold text-foreground">{formatInr(trip.totalInr)}</span>
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border p-6">
          <h2 className="font-semibold">Book an activity now</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Use <strong>Book now</strong> on any line above. You pay Viator directly, get instant
            confirmation, and keep their cancellation terms. Good when the dates are settled and you
            only want the activity.
          </p>
        </div>

        <div className="rounded-xl border border-primary/40 bg-accent/40 p-6">
          <h2 className="font-semibold">Or let us build the whole trip</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Send us this itinerary and we will quote it as one trip — these experiences plus stays,
            transfers and the gaps in between. Usually better value than booking each piece
            separately, and a real person plans it.
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-border p-6">
        {sent ? (
          <div className="text-center">
            <h2 className="font-semibold">Your itinerary is with our team</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              We have {sent.itemCount} {sent.itemCount === 1 ? 'experience' : 'experiences'} and
              your dates. You will hear from a real person within one working day. Nothing is booked
              or charged.
            </p>
          </div>
        ) : (
          <>
            <h2 className="font-semibold">Build my trip</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tell us where to send the quote.
            </p>

            <form onSubmit={handleEnquiry} className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  maxLength={120}
                  className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  maxLength={254}
                  className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium">
                  Phone <span className="text-muted-foreground">(optional)</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  maxLength={40}
                  className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium">
                  Anything else we should know?{' '}
                  <span className="text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  maxLength={2000}
                  className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <HoneypotField inputRef={honeypotRef} />

              <div className="sm:col-span-2">
                <Button type="submit" disabled={sending} className="w-full sm:w-auto">
                  {sending ? 'Sending…' : 'Send my itinerary'}
                </Button>
              </div>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
