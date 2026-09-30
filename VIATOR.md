# Things To Do — the Viator integration

The flow, end to end:

```
bagpackerme.com
  └─ /destinations                  choose a destination
      └─ /destinations/<slug>       THINGS TO DO — curated experience cards
          └─ /experiences/<code>    full detail + CHECK AVAILABILITY
              └─ ADD TO MY TRIP
                  └─ /my-trip       the fork
                      ├─ BOOK ACTIVITY  → Viator checkout  → commission
                      └─ BUILD MY TRIP  → BagpackerMe lead → full itinerary
```

## Where each piece lives

The **Viator API key never touches this repo or Vercel.** It lives in one n8n
credential. The site only ever talks to n8n, which is also why a Viator outage
degrades live availability without blanking a destination page — catalogue reads
come from a Data Table, not from Viator.

| Concern | Owner |
| --- | --- |
| Viator key, curation rules, commission log | n8n |
| Destination names, blurbs, country grouping | `lib/experience-destinations.ts` |
| Page rendering, trip cookie, rate limiting | this repo |

## n8n workflows

All six are on `n8n.srv1996833.hstgr.cloud`, in the personal project, with
`[lib] Error Handler` attached and timezone `Asia/Kolkata`.

| Workflow | Trigger | What it does |
| --- | --- | --- |
| Viator Destination Sync | Sun 02:00 | Refreshes the destination taxonomy, narrowed to the `WANTED` list. Preserves a manual `enabled` flag. |
| Viator Catalogue Sync | Daily 03:00 | One product search per enabled destination, then the curation floor. Top 40 each. |
| Experience Catalogue API | webhook | `GET bpm/experiences`, `GET bpm/experience` |
| Experience Availability API | webhook | `POST bpm/availability-check` — the only live Viator call |
| Trip Builder API | webhook | `POST bpm/trip-add`, `GET bpm/trip`, `POST bpm/trip-remove` |
| Trip Checkout — Book or Enquire | webhook | `POST bpm/trip-book`, `POST bpm/trip-enquiry` |

Every webhook uses **headerAuth** with the existing `BPM Webhook Secret`
credential, so the site authenticates with the same `X-Automation-Secret` header
and the same `N8N_WEBHOOK_BASE_URL` / `N8N_WEBHOOK_SECRET` pair the lead intake
webhooks already use. **No new environment variables.**

## Data Tables

| Table | Holds |
| --- | --- |
| `viator_destinations` | Taxonomy + the `enabled` switch that decides what syncs |
| `viator_experiences` | The curated catalogue, plus cached detail JSON |
| `trip_items` | Anonymous trip baskets |
| `viator_bookings` | Every Book Activity click, for commission reconciliation |

## The curation floor

In **Curate Experiences** (`Viator Catalogue Sync`). This is the editorial
standard, not a performance tweak:

- rating ≥ 4.0
- ≥ 15 reviews
- a real cover image
- a real price

Ranked by `rating × 10 + log10(reviews) × 8 + flag bonuses`, top 40 per
destination. A product that stops clearing the bar stops being refreshed, and
the read API drops anything whose `syncedAt` is older than 7 days — so the
catalogue self-heals with no deletion pass.

## Two deliberate design calls

**Availability is never cached.** A cached price on a booking screen is a wrong
price. `POST bpm/availability-check` hits Viator on every request.

**A Viator outage is not "sold out."** The availability response distinguishes
them (`unavailableReason: "LOOKUP_FAILED"`), and the panel says so, because only
one of those is something a traveller can act on.

## Setup still required

1. **Create the `Viator Partner API` credential in n8n.** Type
   *Custom Auth (templated)*, template:
   ```json
   { "headers": { "exp-api-key": "YOUR_KEY" } }
   ```
   Attach it to the five HTTP Request nodes that reference it (Fetch Viator
   Destinations, Search Viator Products, Fetch Product Detail, Fetch Availability
   Schedule, Check Viator Availability). The SDK cannot create credentials, so
   these shipped unattached.
2. **Set `VIATOR_PARTNER_ID`** in the `Build Affiliate Deep Link` Code node of
   *Trip Checkout*. It is blank on purpose: until it is set, booking links still
   work for the traveller but earn nothing, and those clicks are logged as
   `untracked` rather than passing as normal ones.
3. **Run `Viator Destination Sync` manually once**, then `Viator Catalogue Sync`.
   The catalogue sync reads the destinations table, so order matters.
4. **Activate the six workflows.**

## Adding a destination

Two steps, deliberately:

1. Add the Viator destination name (lowercase) to `WANTED` in
   *Viator Destination Sync* → *Match BagpackerMe Destinations*.
2. Add it to `EXPERIENCE_DESTINATIONS` in `lib/experience-destinations.ts` with
   the slug the sync will generate (name lowercased, non-alphanumerics collapsed
   to hyphens).

Step 1 without step 2 syncs inventory nobody can reach. Step 2 without step 1
renders an empty grid that routes to the planning enquiry instead.
