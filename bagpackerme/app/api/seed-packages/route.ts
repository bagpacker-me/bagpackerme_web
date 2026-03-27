import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import slugify from 'slugify';

const packages = [
  {
    title: "The Culinary Trail",
    category: "Culinary",
    duration: "12 days",
    destinations: ["Mumbai", "Kolkata", "Lucknow", "Delhi"],
    tagline: "A spice-scented journey through India's greatest kitchens",
    priceInr: 85000,
    heroImageUrl: "https://images.unsplash.com/photo-1589301760014-d929f39ce9b0?w=1600&auto=format&fit=crop&q=80",
  },
  {
    title: "The Spiritual Circuit",
    category: "Spiritual",
    duration: "14 days",
    destinations: ["Varanasi", "Rishikesh", "Tirupati", "Pushkar"],
    tagline: "Sacred India — rivers, rituals, and revelation",
    priceInr: 75000,
    heroImageUrl: "https://images.unsplash.com/photo-1561359313-0639aad3a644?w=1600&auto=format&fit=crop&q=80",
  },
  {
    title: "The Adventure Route",
    category: "Adventure",
    duration: "10 days",
    destinations: ["Manali", "Spiti", "Ladakh"],
    tagline: "High altitude India — trek, raft, and ride",
    priceInr: 90000,
    heroImageUrl: "https://images.unsplash.com/photo-1506197061617-7f5c0b093236?w=1600&auto=format&fit=crop&q=80",
  },
  {
    title: "The Heritage Walk",
    category: "Heritage",
    duration: "10 days",
    destinations: ["Jaipur", "Jodhpur", "Udaipur"],
    tagline: "Forts, palaces, and royal India",
    priceInr: 80000,
    heroImageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1600&auto=format&fit=crop&q=80",
  },
  {
    title: "The Hippy Trail",
    category: "Hippy Trail",
    duration: "16 days",
    destinations: ["Goa", "Hampi", "Pondicherry", "Varkala"],
    tagline: "Bohemian India — beaches, temples, and letting go",
    priceInr: 70000,
    heroImageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&auto=format&fit=crop&q=80",
  },
  {
    title: "The Adrenaline Trail",
    category: "Corporate Retreat",
    duration: "2 days",
    destinations: ["Karjat"],
    tagline: "Ziplining, forest obstacles, riverside challenges",
    priceInr: 7500,
    heroImageUrl: "https://images.unsplash.com/photo-1533568024501-fe2ae4bab1bb?w=1600&auto=format&fit=crop&q=80",
  },
  {
    title: "The Slow Down Stay",
    category: "Corporate Retreat",
    duration: "2 days",
    destinations: ["Lonavala", "Nashik"],
    tagline: "Yoga, journaling, and sound healing by the lake",
    priceInr: 7500,
    heroImageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1600&auto=format&fit=crop&q=80",
  },
  {
    title: "Create & Collaborate",
    category: "Corporate Retreat",
    duration: "2 days",
    destinations: ["Lonavala", "Atvan"],
    tagline: "Art, music, skits, and imagination",
    priceInr: 7500,
    heroImageUrl: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=1600&auto=format&fit=crop&q=80",
  },
  {
    title: "Realign & Reflect (Leadership Edition)",
    category: "Corporate Retreat",
    duration: "2 days",
    destinations: ["Igatpuri", "Lonavala"],
    tagline: "Alignment, strengths-mapping, and purpose circles",
    priceInr: 7500,
    heroImageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&auto=format&fit=crop&q=80",
  },
  {
    title: "Into the Wild",
    category: "Corporate Retreat",
    duration: "2 days",
    destinations: ["Tala", "Forest Camp"],
    tagline: "Eco-retreats, bamboo rafts, wild cooking",
    priceInr: 7500,
    heroImageUrl: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1600&auto=format&fit=crop&q=80",
  },
  {
    title: "Play & Pause",
    category: "Corporate Retreat",
    duration: "2 days",
    destinations: ["Pawna", "SaffronStays"],
    tagline: "Board games, lakeside coffees, and karaoke",
    priceInr: 7500,
    heroImageUrl: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=1600&auto=format&fit=crop&q=80",
  },
  {
    title: "Half-Day Express",
    category: "Corporate Retreat",
    duration: "Half Day",
    destinations: ["Mumbai outskirts"],
    tagline: "Quick reset — one activity, lunch, done",
    priceInr: 4000,
    heroImageUrl: "https://images.unsplash.com/photo-1530103862676-de889e4b4812?w=1600&auto=format&fit=crop&q=80",
  }
];

export async function GET() {
  try {
    const packagesCol = collection(db, 'packages');
    let count = 0;
    for (const pkg of packages) {
      const docData = {
        ...pkg,
        slug: slugify(pkg.title, { lower: true, strict: true }),
        galleryUrls: [pkg.heroImageUrl],
        groupSize: pkg.category === 'Corporate Retreat' ? '20-50 pax' : '10-15 pax',
        overviewHtml: `<p>${pkg.tagline}</p>`,
        itinerary: [
          {
            day: 1,
            location: pkg.destinations[0],
            description: "Arrival and welcome.",
          }
        ],
        inclusions: {
          accommodation: true,
          meals: true,
          transfers: true,
          guides: true,
          flights: false,
          activities: true,
        },
        exclusions: ["Personal expenses", "Travel insurance"],
        status: 'published',
        createdAt: new Date().toISOString(),
      };
      
      await addDoc(packagesCol, docData);
      count++;
    }
    return NextResponse.json({ success: true, seeded: count });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
