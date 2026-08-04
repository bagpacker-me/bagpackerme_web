// Single source for the homepage FAQ — read by both the UI (FAQSection) and the
// FAQPage JSON-LD, so the two can never drift. Pure data, no directive, safe to
// import from server or client.
//
// Answers are written to be self-contained: each one can be lifted out of the
// page and still make sense, opens with the direct answer in the first sentence,
// and names concrete numbers rather than gesturing at them. That is what makes a
// passage quotable by an AI answer engine, and it is also just a better answer.
//
// Every commercial figure below is copied from the Terms of Service page
// (app/(public)/terms/page.tsx). If the deposit band, payment deadline, or
// cancellation tiers change there, change them here in the same commit —
// contradicting your own terms is a trust failure, not a formatting nit.
export interface FaqItem {
  question: string;
  answer: string;
}

export const HOME_FAQS: readonly FaqItem[] = [
  {
    question: 'What services does BagPackerMe offer?',
    answer:
      'BagPackerMe plans private, fully customised trips end to end. That covers itinerary design, hotel selection and booking, transport between and within destinations, curated activities and experiences, and real-time concierge support while you travel. We are a planning and coordination service rather than a fixed-departure tour operator, so every element is chosen for your specific trip instead of pulled from a set package.',
  },
  {
    question: 'Is this a group tour or a private experience?',
    answer:
      'Every BagPackerMe trip is private. You travel only with the people you booked with — no strangers joining your group, no fixed departure dates, and no shared coach itinerary. Pace, route, hotel standard, and daily start times are all set around your party, whether that is a solo traveller, a couple, a family, or a small group.',
  },
  {
    question: 'How much is the deposit and when is the balance due?',
    answer:
      'A non-refundable deposit of typically 25–30% of the package price confirms your booking. The remaining balance is due no later than 30 days before departure. If you book within 30 days of departure, the full amount is payable at the time of booking. A booking is only confirmed once we have received the deposit and sent you written confirmation.',
  },
  {
    question: 'What is the cancellation policy?',
    answer:
      'Cancellation charges depend on how far out you cancel, and cancellations must be sent to us in writing. More than 45 days before departure you lose the deposit only. Between 30 and 44 days you are charged 50% of the total package cost, between 15 and 29 days 75%, and inside 15 days 100% with no refund. We strongly recommend comprehensive travel insurance covering cancellation, medical expenses, and personal liability.',
  },
  {
    question: 'What kind of support will I get during the trip?',
    answer:
      'You get real-time human support on WhatsApp or by phone for the whole trip. That covers the things that actually go wrong on the road: a delayed flight that breaks the next connection, a hotel that cannot honour a booking, weather that closes an activity, or a driver who has not arrived. We reach the supplier and rework the day rather than handing you a call centre number.',
  },
  {
    question: 'Can the itinerary be changed after it has been created?',
    answer:
      'Yes. The itinerary is a draft until you are happy with it, and we revise it as many times as needed before you confirm. After confirmation we can still adjust it, though changes to booked hotels, flights, and permits are subject to each supplier’s own change rules and any fare difference. Day-to-day pacing and activity swaps are usually straightforward even mid-trip.',
  },
  {
    question: 'Why use BagPackerMe instead of booking everything myself?',
    answer:
      'Self-booking works well for a single city. It gets expensive in time and mistakes across a multi-country route, where the hard part is sequencing: which order the cities go in, how long each leg actually takes, which internal flights or trains to hold before they sell out, and which day of the week a site is closed. We have run these routes before, so you get a plan that already accounts for that, plus one point of contact when something changes.',
  },
  {
    question: 'What destinations do you cover?',
    answer:
      'Our current catalogue spans Europe, Asia, and East Africa. In Europe that includes Switzerland, Italy, Spain, Portugal, France, Greece, Croatia, Montenegro, Germany, the United Kingdom, the Nordic and Baltic capitals, and Central European routes through Prague, Vienna, and Budapest. In Asia we run Japan, Vietnam, and Thailand, alongside a dedicated India programme. In Africa we run Kenya safari itineraries through Amboseli, Naivasha, and the Masai Mara.',
  },
  {
    question: 'How long are your trips?',
    answer:
      'Published itineraries run from 3 to 11 nights, and most sit in the 5 to 9 night range. Short trips tend to be single-country or single-region — three nights in Pattaya, four in London, three in Athens. Longer routes cover multiple countries, such as a nine-night Scandinavian itinerary across five countries or an eleven-night Switzerland, Paris, and Italy combination. Any published length can be extended or shortened.',
  },
  {
    question: 'Do you help with hotel bookings?',
    answer:
      'Yes. We recommend and book hotels as part of the itinerary, chosen for location first — being able to walk to what you came to see usually matters more than an extra star rating. We give you options at different price points with the trade-offs explained, rather than a single take-it-or-leave-it recommendation.',
  },
  {
    question: 'Can you arrange transport within the destination?',
    answer:
      'Yes. We handle internal flights, train bookings, private drivers, and airport transfers, and we advise which mode actually makes sense for each leg. On some routes a train beats a flight once transfer and check-in time is counted; on others a private driver is worth it because the schedule does not fit. Rail passes and seat reservations that need booking well in advance are flagged early.',
  },
  {
    question: 'Do you plan trips for couples, families, and groups?',
    answer:
      'Yes — solo travellers, couples, families with children, and small private groups. The trip type changes the plan substantially: family itineraries carry shorter travel days and more flexible mornings, honeymoon routes weight hotels and dining more heavily, and group trips need transport and room configurations locked earlier. Tell us the group makeup when you enquire and the first draft will already reflect it.',
  },
  {
    question: 'Will I get a day-by-day itinerary?',
    answer:
      'Yes. You receive a written day-by-day plan covering where you are each night, what is scheduled each day, how you get between places, and what is booked versus left open. Confirmation numbers, transfer timings, and contact details for local suppliers are included, so the document works as your reference on the road rather than just a sales preview.',
  },
  {
    question: 'Do you offer last-minute planning?',
    answer:
      'Sometimes, depending on availability. The constraint is rarely our capacity — it is that hotels, internal flights, park permits, and popular experiences sell out, and inside 30 days the full trip cost is payable at booking. For peak-season travel, safari, and Japan in cherry blossom or autumn colour season, plan several months ahead. For shorter city trips in shoulder season, a few weeks is often workable.',
  },
  {
    question: 'What happens if something goes wrong during the trip?',
    answer:
      'Contact us on WhatsApp or by phone and we work the problem in real time. In practice that means rebooking a missed connection, finding an alternative hotel if one falls through, rescheduling an activity around weather, or chasing a driver who has not shown. If we have to cancel a trip ourselves for reasons outside anyone’s control, you are offered either a full refund of everything paid or an alternative trip of equivalent value.',
  },
  {
    question: 'How do I start planning a trip?',
    answer:
      'Send us the destination or rough idea, your approximate dates, how many people are travelling, and a sense of budget — on WhatsApp at +91 99209 92026, by email at bagpackerme.world@gmail.com, or through the contact form. We come back with questions, then a draft itinerary and costing. There is no charge for the draft, and nothing is booked until you approve it and pay the deposit.',
  },
];
