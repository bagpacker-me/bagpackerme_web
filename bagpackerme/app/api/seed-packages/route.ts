import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import slugify from 'slugify';

export const dynamic = 'force-dynamic';

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
        groupSize: '10-15 pax',
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
