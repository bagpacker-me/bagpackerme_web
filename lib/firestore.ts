import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, getDoc, limit, setDoc, increment, runTransaction, writeBatch, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { Package, BlogPost, Enquiry, Customer, Booking, GalleryImage, Testimonial, Affiliate, AffiliateClick, AffiliateEvent, AffiliatePublic, AffiliateRegistrationIndex, PackageMarket } from '@/types';
import { buildAffiliatePublicData, normalizeAffiliateCode, normalizeAffiliateSessionId } from './affiliate';
import { STATIC_GLOBAL_PACKAGES } from './static-global-packages';
import {
  restDocumentToObject,
  firestoreRestConfig,
  type FirestoreRestDocument,
  type FirestoreRunQueryResult,
} from './firestore-rest';

// Packages
const packagesCol = collection(db, 'packages');
export const getPackages = async () => getDocs(packagesCol);
export const getPublishedPackages = async () => getDocs(query(packagesCol, where('status', '==', 'published')));
export const getFeaturedPackages = async (count: number) => getDocs(query(packagesCol, where('status', '==', 'published'), limit(count)));
export const getPackage = async (id: string) => getDoc(doc(db, 'packages', id));
export const normalizePackageMarket = (pkg: Pick<Package, 'market'>): PackageMarket =>
  pkg.market === 'global' ? 'global' : 'india';

const packageFromRestDocument = (document: FirestoreRestDocument) => {
  const data = restDocumentToObject(document) as Omit<Package, 'id'>;

  return {
    id: document.name.split('/').pop() ?? data.slug,
    ...data,
    market: data.market === 'global' ? 'global' : 'india',
  } as Package;
};

const getPublishedPackagesFromRest = async () => {
  if (typeof window !== 'undefined') return null;

  const config = firestoreRestConfig();
  if (!config) return null;
  const { projectId, apiKey } = config;

  try {
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId: 'packages' }],
            where: {
              fieldFilter: {
                field: { fieldPath: 'status' },
                op: 'EQUAL',
                value: { stringValue: 'published' },
              },
            },
          },
        }),
      }
    );

    if (!response.ok) return null;

    const results = (await response.json()) as FirestoreRunQueryResult[];
    return results
      .map((result) => result.document)
      .filter((document): document is FirestoreRestDocument => Boolean(document))
      .map(packageFromRestDocument);
  } catch {
    return null;
  }
};

const sortPackagesByCreatedAt = (packages: Package[]) =>
  [...packages].sort((a, b) => {
    const aDate = a.createdAt || '';
    const bDate = b.createdAt || '';
    return bDate.localeCompare(aDate);
  });

const packageFromDoc = (document: { id: string; data: () => unknown }) => {
  const data = document.data() as Omit<Package, 'id'>;
  return { id: document.id, ...data, market: data.market === 'global' ? 'global' : 'india' } as Package;
};

const mergeWithStaticGlobalPackages = (firestorePackages: Package[]) => {
  const bySlug = new Map<string, Package>();
  STATIC_GLOBAL_PACKAGES.forEach((pkg) => bySlug.set(pkg.slug, pkg));
  firestorePackages.forEach((pkg) => bySlug.set(pkg.slug, pkg));
  return sortPackagesByCreatedAt(Array.from(bySlug.values()));
};

export const getPublishedPackagesForMarket = async (market: PackageMarket) => {
  const restPackages = await getPublishedPackagesFromRest();
  const publishedPackages = restPackages ?? (await getPublishedPackages()).docs.map(packageFromDoc);
  const firestorePackages = publishedPackages.filter((pkg) => normalizePackageMarket(pkg) === market);

  return market === 'global'
    ? mergeWithStaticGlobalPackages(firestorePackages)
    : sortPackagesByCreatedAt(firestorePackages);
};

export const getFeaturedPackagesForMarket = async (market: PackageMarket, count: number) =>
  (await getPublishedPackagesForMarket(market)).slice(0, count);

export const getPackageBySlugForMarket = async (slug: string, market: PackageMarket) => {
  const packages = await getPublishedPackagesForMarket(market);
  return packages.find((pkg) => pkg.slug === slug) ?? null;
};

export const getPackageBySlugAnyMarket = async (slug: string) => {
  const globalPackage = await getPackageBySlugForMarket(slug, 'global');
  if (globalPackage) return globalPackage;

  return getPackageBySlugForMarket(slug, 'india');
};

export const getPackageBySlug = async (slug: string) => {
  const q = query(packagesCol, where('slug', '==', slug), where('status', '==', 'published'));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  // Sort in JS to get the newest one if there are duplicates with the same slug
  const docs = snapshot.docs.map(packageFromDoc);
  docs.sort((a, b) => {
    const aDate = a.createdAt || '';
    const bDate = b.createdAt || '';
    return bDate.localeCompare(aDate);
  });
  return docs[0];
};
export const getRelatedPackages = async (category: string, excludeSlug: string, count: number = 3) => {
  const q = query(packagesCol, where('category', '==', category), where('status', '==', 'published'), limit(count + 1));
  const snapshot = await getDocs(q);
  const related = snapshot.docs
    .map(packageFromDoc)
    .filter(pkg => pkg.slug !== excludeSlug)
    .slice(0, count);
  return related;
};
export const getRelatedPackagesForMarket = async (
  market: PackageMarket,
  category: string,
  excludeSlug: string,
  count: number = 3
) => {
  const packages = await getPublishedPackagesForMarket(market);
  return packages
    .filter((pkg) => pkg.category === category && pkg.slug !== excludeSlug)
    .slice(0, count);
};
export const createPackage = async (data: Omit<Package, 'id'>) => addDoc(packagesCol, data);
export const updatePackage = async (id: string, data: Partial<Package>) => updateDoc(doc(db, 'packages', id), data);
export const deletePackage = async (id: string) => deleteDoc(doc(db, 'packages', id));

// Blogs
const blogsCol = collection(db, 'blogs');
export const getBlogs = async () => getDocs(query(blogsCol, orderBy('createdAt', 'desc')));
export const getPublishedBlogs = async () => {
  const snap = await getDocs(query(blogsCol, where('status', '==', 'published')));
  // Sort in JS — avoids needing a composite index on (status, createdAt)
  const docsCopy = [...snap.docs];
  return {
    docs: docsCopy.sort((a, b) => {
      const aData = a.data();
      const bData = b.data();
      const aDate = (aData['createdAt'] ?? aData['publishDate'] ?? '') as string;
      const bDate = (bData['createdAt'] ?? bData['publishDate'] ?? '') as string;
      return bDate.localeCompare(aDate);
    }),
  };
};
export const getRecentPublishedBlogs = async (limitCount: number) => {
  const snap = await getDocs(query(blogsCol, where('status', '==', 'published')));
  const sorted = [...snap.docs].sort((a, b) => {
    const aData = a.data();
    const bData = b.data();
    const aDate = (aData['createdAt'] ?? aData['publishDate'] ?? '') as string;
    const bDate = (bData['createdAt'] ?? bData['publishDate'] ?? '') as string;
    return bDate.localeCompare(aDate);
  });
  return { docs: sorted.slice(0, limitCount) };
};
export const getBlog = async (id: string) => getDoc(doc(db, 'blogs', id));
export const getBlogBySlug = async (slug: string) => {
  const q = query(blogsCol, where('slug', '==', slug), where('status', '==', 'published'));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
  docs.sort((a, b) => {
    const aDate = a.createdAt || a.publishDate || '';
    const bDate = b.createdAt || b.publishDate || '';
    return bDate.localeCompare(aDate);
  });
  return docs[0];
};
export const getRelatedBlogs = async (category: string, excludeSlug: string, count: number = 3) => {
  const q = query(blogsCol, where('category', '==', category), where('status', '==', 'published'), limit(count + 1));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as BlogPost))
    .filter(blog => blog.slug !== excludeSlug)
    .slice(0, count);
};
export const createBlog = async (data: Omit<BlogPost, 'id'>) => addDoc(blogsCol, data);
export const updateBlog = async (id: string, data: Partial<BlogPost>) => updateDoc(doc(db, 'blogs', id), data);
export const deleteBlog = async (id: string) => deleteDoc(doc(db, 'blogs', id));

// Enquiries
const enquiriesCol = collection(db, 'enquiries');
export const getEnquiries = async () => getDocs(query(enquiriesCol, orderBy('createdAt', 'desc')));
export const getEnquiry = async (id: string) => getDoc(doc(db, 'enquiries', id));
export const createEnquiry = async (data: Omit<Enquiry, 'id'>) => addDoc(enquiriesCol, data);
export const updateEnquiry = async (id: string, data: Partial<Enquiry>) => updateDoc(doc(db, 'enquiries', id), data);
export const deleteEnquiry = async (id: string) => deleteDoc(doc(db, 'enquiries', id));
export const listenNewEnquiriesCount = (callback: (count: number) => void) => {
  const q = query(enquiriesCol, where('status', '==', 'new'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.size);
  }, (error) => {
    console.error('Error listening to new enquiries count:', error);
  });
};


// Subscribers
const subscribersCol = collection(db, 'subscribers');
const normalizeSubscriberEmail = (email: string) => email.trim().toLowerCase();
export const getSubscribers = async () => getDocs(query(subscribersCol, orderBy('createdAt', 'desc')));
export const createSubscriber = async (data: { email: string; createdAt: string }) =>
  addDoc(subscribersCol, {
    ...data,
    email: normalizeSubscriberEmail(data.email),
  });
export const subscribeToNewsletter = async (email: string) => {
  const normalizedEmail = normalizeSubscriberEmail(email);
  if (!normalizedEmail) {
    throw new Error('Email is required');
  }

  return createSubscriber({
    email: normalizedEmail,
    createdAt: new Date().toISOString(),
  });
};
export const deleteSubscriber = async (id: string) => deleteDoc(doc(db, 'subscribers', id));

// Customers
const customersCol = collection(db, 'customers');
export const getCustomers = async () => getDocs(query(customersCol, orderBy('createdAt', 'desc')));
export const getCustomer = async (id: string) => getDoc(doc(db, 'customers', id));
export const createCustomer = async (data: Omit<Customer, 'id'>) => addDoc(customersCol, data);
export const updateCustomer = async (id: string, data: Partial<Customer>) => updateDoc(doc(db, 'customers', id), data);
export const deleteCustomer = async (id: string) => deleteDoc(doc(db, 'customers', id));

// Bookings
const bookingsCol = collection(db, 'bookings');
export const getBookings = async () => getDocs(query(bookingsCol, orderBy('createdAt', 'desc')));
export const getBooking = async (id: string) => getDoc(doc(db, 'bookings', id));
export const createBooking = async (data: Omit<Booking, 'id'>) => addDoc(bookingsCol, data);
export const updateBooking = async (id: string, data: Partial<Booking>) => {
  const bookingRef = doc(db, 'bookings', id);
  const bookingSnap = await getDoc(bookingRef);

  if (!bookingSnap.exists()) {
    throw new Error('Booking not found');
  }

  const currentBooking = { id: bookingSnap.id, ...bookingSnap.data() } as Booking;
  const nextStatus = data.status ?? currentBooking.status;
  const shouldAttributeAffiliate =
    !!currentBooking.affiliateCode &&
    !currentBooking.affiliateBookingAttributedAt &&
    (nextStatus === 'confirmed' || nextStatus === 'completed');
  const attributedAt = shouldAttributeAffiliate ? new Date().toISOString() : currentBooking.affiliateBookingAttributedAt;

  await updateDoc(bookingRef, {
    ...data,
    ...(shouldAttributeAffiliate ? { affiliateBookingAttributedAt: attributedAt } : {}),
  });

  if (!shouldAttributeAffiliate) {
    return;
  }

  const affiliateCode = normalizeAffiliateCode(currentBooking.affiliateCode);
  if (!affiliateCode) {
    return;
  }

  const affiliate = await getAffiliateByCode(affiliateCode);
  if (affiliate) {
    await incrementAffiliateBookings(affiliate.id);
  }

  if (currentBooking.affiliateSessionId) {
    const attributed = await markAffiliatePublicEventConversion(
      affiliateCode,
      currentBooking.affiliateSessionId,
      'booking'
    );

    if (!attributed) {
      await incrementAffiliatePublicMetric(affiliateCode, 'totalBookings');
    }
  } else {
    await incrementAffiliatePublicMetric(affiliateCode, 'totalBookings');
  }
};
export const deleteBooking = async (id: string) => deleteDoc(doc(db, 'bookings', id));

// Gallery
const galleryCol = collection(db, 'gallery');
export const getGalleryImages = async () => getDocs(query(galleryCol, orderBy('createdAt', 'desc')));
export const addGalleryImage = async (data: Omit<GalleryImage, 'id'>) => addDoc(galleryCol, data);
export const deleteGalleryImage = async (id: string) => deleteDoc(doc(db, 'gallery', id));

// Testimonials
const testimonialsCol = collection(db, 'testimonials');
const testimonialFromDoc = (document: { id: string; data: () => unknown }) =>
  ({ id: document.id, ...(document.data() as Omit<Testimonial, 'id'>) } as Testimonial);
const sortTestimonialsByCreatedAt = (items: Testimonial[]) =>
  [...items].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
export const getTestimonials = async () =>
  getDocs(query(testimonialsCol, orderBy('createdAt', 'desc')));
export const getPublishedTestimonials = async () => {
  // Sort in JS — avoids a composite index on (status, createdAt), matching the
  // getPublishedBlogs approach above.
  const snap = await getDocs(query(testimonialsCol, where('status', '==', 'published')));
  return sortTestimonialsByCreatedAt(snap.docs.map(testimonialFromDoc));
};
export const getPublishedTestimonialsForMarket = async (market: PackageMarket) => {
  const published = await getPublishedTestimonials();
  // A testimonial with no market is shown on both homepages.
  return published.filter((t) => !t.market || t.market === market);
};
export const createTestimonial = async (data: Omit<Testimonial, 'id'>) =>
  addDoc(testimonialsCol, data);
export const updateTestimonial = async (id: string, data: Partial<Testimonial>) =>
  updateDoc(doc(db, 'testimonials', id), data);
export const deleteTestimonial = async (id: string) => deleteDoc(doc(db, 'testimonials', id));

// Settings
export const getSiteSettings = async () => {
  const docSnap = await getDoc(doc(db, 'settings', 'site'));
  return docSnap.exists() ? (docSnap.data() as import('@/types').SiteSettings) : null;
};
export const updateSiteSettings = async (data: Partial<import('@/types').SiteSettings>) => {
  return setDoc(doc(db, 'settings', 'site'), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
};

// ──────────────────────────────────────────────────────────────────────────────
// Affiliates
// ──────────────────────────────────────────────────────────────────────────────
const affiliatesCol = collection(db, 'affiliates');
const affiliatePublicCol = collection(db, 'affiliate_public');
const affiliatePublicDoc = (code: string) => doc(db, 'affiliate_public', normalizeAffiliateCode(code));
const affiliatePublicEventsCol = (code: string) =>
  collection(db, 'affiliate_public', normalizeAffiliateCode(code), 'events');
const affiliatePublicEventDoc = (code: string, sessionId: string) =>
  doc(db, 'affiliate_public', normalizeAffiliateCode(code), 'events', normalizeAffiliateSessionId(sessionId));
const affiliateRegistrationIndexDoc = (emailHash: string) =>
  doc(db, 'affiliate_registration_index', emailHash);

export const getAffiliates = async () =>
  getDocs(query(affiliatesCol, orderBy('createdAt', 'desc')));

export const getAffiliate = async (id: string) =>
  getDoc(doc(db, 'affiliates', id));

export const getAffiliateByCode = async (code: string) => {
  const q = query(affiliatesCol, where('code', '==', code.toUpperCase()));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Affiliate;
};

export const getAffiliateByEmail = async (email: string) => {
  const q = query(affiliatesCol, where('email', '==', email.toLowerCase()));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Affiliate;
};

export const createAffiliate = async (data: Omit<Affiliate, 'id'>) =>
  addDoc(affiliatesCol, data);

export const createAffiliateWithPublicRecords = async (
  data: Omit<Affiliate, 'id'> & { emailHash: string }
) => {
  const privateRef = doc(affiliatesCol);
  const publicRef = affiliatePublicDoc(data.code);
  const indexRef = affiliateRegistrationIndexDoc(data.emailHash);
  const batch = writeBatch(db);

  batch.set(privateRef, data);
  batch.set(publicRef, buildAffiliatePublicData(data));
  batch.set(indexRef, {
    emailHash: data.emailHash,
    affiliateId: privateRef.id,
    affiliateCode: normalizeAffiliateCode(data.code),
    createdAt: data.createdAt,
  } as AffiliateRegistrationIndex);

  await batch.commit();

  return privateRef;
};

export const syncAffiliatePublicFromAffiliate = async (
  affiliate: Pick<Affiliate, 'name' | 'code' | 'status' | 'createdAt'> &
    Partial<Pick<Affiliate, 'updatedAt' | 'totalClicks' | 'totalLeads' | 'totalBookings'>>
) => {
  const affiliatePublic = buildAffiliatePublicData(affiliate);
  await setDoc(affiliatePublicDoc(affiliatePublic.code), affiliatePublic, { merge: true });
  return affiliatePublic;
};

export const updateAffiliate = async (id: string, data: Partial<Affiliate>) => {
  const affiliateSnap = await getAffiliate(id);
  if (!affiliateSnap.exists()) {
    throw new Error('Affiliate not found');
  }

  const now = new Date().toISOString();
  const currentAffiliate = { id: affiliateSnap.id, ...affiliateSnap.data() } as Affiliate;
  const publicSnap = await getAffiliatePublic(currentAffiliate.code);
  const publicAffiliate = publicSnap.exists() ? (publicSnap.data() as AffiliatePublic) : null;
  const nextAffiliate = {
    ...currentAffiliate,
    ...data,
    totalClicks: publicAffiliate?.totalClicks ?? currentAffiliate.totalClicks,
    totalLeads: publicAffiliate?.totalLeads ?? currentAffiliate.totalLeads,
    totalBookings: publicAffiliate?.totalBookings ?? currentAffiliate.totalBookings,
    updatedAt: now,
  };

  await updateDoc(doc(db, 'affiliates', id), { ...data, updatedAt: now });
  await syncAffiliatePublicFromAffiliate(nextAffiliate);
};

export const deleteAffiliate = async (id: string) => {
  const affiliateSnap = await getAffiliate(id);
  if (!affiliateSnap.exists()) {
    return;
  }

  const affiliate = { id: affiliateSnap.id, ...affiliateSnap.data() } as Affiliate;
  const eventsSnap = await getDocs(affiliatePublicEventsCol(affiliate.code));
  const batch = writeBatch(db);

  batch.delete(doc(db, 'affiliates', id));
  batch.delete(affiliatePublicDoc(affiliate.code));

  if (affiliate.emailHash) {
    batch.delete(affiliateRegistrationIndexDoc(affiliate.emailHash));
  }

  eventsSnap.docs.forEach((eventDoc) => batch.delete(eventDoc.ref));
  await batch.commit();
};

/** Atomically increment click counter on the affiliate document */
export const incrementAffiliateClicks = async (id: string) =>
  updateDoc(doc(db, 'affiliates', id), { totalClicks: increment(1), updatedAt: new Date().toISOString() });

/** Atomically increment lead counter on the affiliate document */
export const incrementAffiliateLeads = async (id: string) =>
  updateDoc(doc(db, 'affiliates', id), { totalLeads: increment(1), updatedAt: new Date().toISOString() });

/** Atomically increment booking counter on the affiliate document */
export const incrementAffiliateBookings = async (id: string) =>
  updateDoc(doc(db, 'affiliates', id), { totalBookings: increment(1), updatedAt: new Date().toISOString() });

export const getAffiliatePublicList = async () =>
  getDocs(query(affiliatePublicCol, orderBy('createdAt', 'desc')));

export const getAffiliatePublic = async (code: string) =>
  getDoc(affiliatePublicDoc(code));

export const getAffiliateRegistrationIndex = async (emailHash: string) =>
  getDoc(affiliateRegistrationIndexDoc(emailHash));

export const incrementAffiliatePublicMetric = async (
  affiliateCode: string,
  metric: 'totalClicks' | 'totalLeads' | 'totalBookings'
) =>
  updateDoc(affiliatePublicDoc(affiliateCode), {
    [metric]: increment(1),
    updatedAt: new Date().toISOString(),
  });

export const getAffiliatePublicEvent = async (affiliateCode: string, sessionId: string) =>
  getDoc(affiliatePublicEventDoc(affiliateCode, sessionId));

export const getAffiliatePublicEvents = async (affiliateCode: string, limitCount: number = 20) =>
  getDocs(query(affiliatePublicEventsCol(affiliateCode), orderBy('createdAt', 'desc'), limit(limitCount)));

export const trackAffiliatePublicClick = async (data: {
  affiliateCode: string;
  pageUrl: string;
  packageSlug?: string;
  referrer?: string;
  sessionId: string;
}) => {
  const affiliateCode = normalizeAffiliateCode(data.affiliateCode);
  const sessionId = normalizeAffiliateSessionId(data.sessionId);

  if (!affiliateCode || !sessionId) {
    return { tracked: false as const, reason: 'missing' };
  }

  const now = new Date().toISOString();

  return runTransaction(db, async (transaction) => {
    const publicRef = affiliatePublicDoc(affiliateCode);
    const publicSnap = await transaction.get(publicRef);

    if (!publicSnap.exists()) {
      return { tracked: false as const, reason: 'missing' };
    }

    const affiliatePublic = publicSnap.data() as AffiliatePublic;
    if (affiliatePublic.status !== 'active') {
      return { tracked: false as const, reason: 'inactive' };
    }

    const eventRef = affiliatePublicEventDoc(affiliateCode, sessionId);
    const eventSnap = await transaction.get(eventRef);

    if (eventSnap.exists()) {
      return { tracked: false as const, reason: 'duplicate' };
    }

    transaction.set(eventRef, {
      affiliateCode,
      pageUrl: data.pageUrl || '',
      packageSlug: data.packageSlug || '',
      referrer: data.referrer || '',
      sessionId,
      convertedToEnquiry: false,
      convertedToBooking: false,
      createdAt: now,
      updatedAt: now,
    } as Omit<AffiliateEvent, 'id'>);
    transaction.update(publicRef, {
      totalClicks: (affiliatePublic.totalClicks ?? 0) + 1,
      updatedAt: now,
    });

    return { tracked: true as const };
  });
};

export const markAffiliatePublicEventConversion = async (
  affiliateCode: string,
  sessionId: string,
  conversion: 'enquiry' | 'booking'
) => {
  const normalizedCode = normalizeAffiliateCode(affiliateCode);
  const normalizedSessionId = normalizeAffiliateSessionId(sessionId);

  if (!normalizedCode || !normalizedSessionId) {
    return false;
  }

  const eventField = conversion === 'booking' ? 'convertedToBooking' : 'convertedToEnquiry';
  const metricField = conversion === 'booking' ? 'totalBookings' : 'totalLeads';
  const now = new Date().toISOString();

  return runTransaction(db, async (transaction) => {
    const publicRef = affiliatePublicDoc(normalizedCode);
    const publicSnap = await transaction.get(publicRef);

    if (!publicSnap.exists()) {
      return false;
    }

    const affiliatePublic = publicSnap.data() as AffiliatePublic;
    const eventRef = affiliatePublicEventDoc(normalizedCode, normalizedSessionId);
    const eventSnap = await transaction.get(eventRef);
    const eventData = eventSnap.exists() ? (eventSnap.data() as AffiliateEvent) : null;

    if (eventData?.[eventField]) {
      return false;
    }

    if (eventData) {
      transaction.update(eventRef, {
        [eventField]: true,
        updatedAt: now,
      });
    } else {
      transaction.set(eventRef, {
        affiliateCode: normalizedCode,
        pageUrl: '',
        packageSlug: '',
        referrer: '',
        sessionId: normalizedSessionId,
        convertedToEnquiry: conversion === 'enquiry',
        convertedToBooking: conversion === 'booking',
        createdAt: now,
        updatedAt: now,
      } as Omit<AffiliateEvent, 'id'>);
    }

    transaction.update(publicRef, {
      [metricField]: ((affiliatePublic[metricField] as number | undefined) ?? 0) + 1,
      updatedAt: now,
    });

    return true;
  });
};

// ──────────────────────────────────────────────────────────────────────────────
// Affiliate Clicks
// ──────────────────────────────────────────────────────────────────────────────
const affiliateClicksCol = collection(db, 'affiliate_clicks');

export const logAffiliateClick = async (data: Omit<AffiliateClick, 'id'>) =>
  addDoc(affiliateClicksCol, data);

export const getAffiliateClicks = async () =>
  getDocs(query(affiliateClicksCol, orderBy('createdAt', 'desc')));

export const getClicksByAffiliate = async (affiliateCode: string) =>
  getDocs(query(affiliateClicksCol, where('affiliateCode', '==', affiliateCode), orderBy('createdAt', 'desc')));

export const getAffiliateClicksBySession = async (sessionId: string, affiliateCode: string) => {
  const q = query(
    affiliateClicksCol,
    where('sessionId', '==', sessionId),
    where('affiliateCode', '==', affiliateCode)
  );
  const snap = await getDocs(q);
  return snap.docs.length > 0;
};
