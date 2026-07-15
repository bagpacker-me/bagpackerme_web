// Single source for the homepage FAQ — read by both the UI (FAQSection) and the
// FAQPage JSON-LD, so the two can never drift. Pure data, no directive, safe to
// import from server or client.
export interface FaqItem {
  question: string;
  answer: string;
}

export const HOME_FAQS: readonly FaqItem[] = [
  {
    question: 'What services does Bagpackerme offer?',
    answer: 'We provide fully customized travel planning, including itinerary design, hotel recommendations, transportation, and on-trip concierge support.',
  },
  {
    question: 'Is this a group tour or a private experience?',
    answer: 'All our trips are completely private and tailored to your preferences, pace, and travel style.',
  },
  {
    question: 'When do I need to make a payment?',
    answer: 'A partial payment is required to begin detailed planning, with the remaining balance depending on the scope of services and support during your trip.',
  },
  {
    question: 'What kind of support will I get during the trip?',
    answer: 'You’ll have real-time support via WhatsApp or phone for any changes, delays, or assistance needed while traveling.',
  },
  {
    question: 'Can the itinerary be changed after it’s created?',
    answer: 'Yes, we offer flexible planning and can adjust your itinerary based on your preferences or unexpected changes.',
  },
  {
    question: 'Why should I choose Bagpackerme over booking everything myself?',
    answer: 'We save you time, reduce stress, and provide expert guidance, trusted recommendations, and seamless coordination for a smoother travel experience.',
  },
  {
    question: 'How personalized is the itinerary?',
    answer: 'Every itinerary is built from scratch based on your interests, travel style, pace, and priorities.',
  },
  {
    question: 'Do you help with hotel bookings?',
    answer: 'Yes, we recommend and assist in booking carefully selected, well-located, and reliable hotels.',
  },
  {
    question: 'Can you arrange transportation within the destination?',
    answer: 'Absolutely. We help with routes, private drivers, train bookings, and the most efficient ways to get around.',
  },
  {
    question: 'What destinations do you specialize in?',
    answer: 'We focus on curated, experience-driven travel across select destinations, with deep local insight and planning expertise.',
  },
  {
    question: 'Do you offer last-minute planning?',
    answer: 'We can accommodate last-minute requests depending on availability, but we recommend planning in advance for the best experience.',
  },
  {
    question: 'Will I get a day-by-day itinerary?',
    answer: "Yes, you'll receive a detailed, easy-to-follow day-by-day plan covering all key aspects of your trip.",
  },
  {
    question: 'Can you plan trips for couples, families, or groups?',
    answer: 'Yes, we customize trips for solo travelers, couples, families, and small groups.',
  },
  {
    question: 'What if something goes wrong during the trip?',
    answer: "We're available to support you in real time and help resolve any issues, changes, or unexpected situations.",
  },
  {
    question: 'Do you include activities and experiences in the plan?',
    answer: 'Yes, we recommend and curate experiences that match your interests—from cultural to adventure to relaxation.',
  },
  {
    question: 'How do I get started?',
    answer: "Simply reach out to us with your travel idea, and we'll guide you through the next steps to start planning your journey.",
  },
];
