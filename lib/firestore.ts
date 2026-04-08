import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, getDoc, limit, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Package, BlogPost, Enquiry, Customer, Booking, GalleryImage } from '@/types';

// Packages
const packagesCol = collection(db, 'packages');
export const getPackages = async () => getDocs(packagesCol);
export const getPublishedPackages = async () => getDocs(query(packagesCol, where('status', '==', 'published')));
export const getFeaturedPackages = async (count: number) => getDocs(query(packagesCol, where('status', '==', 'published'), limit(count)));
export const getPackage = async (id: string) => getDoc(doc(db, 'packages', id));
export const getPackageBySlug = async (slug: string) => {
  const q = query(packagesCol, where('slug', '==', slug), where('status', '==', 'published'));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  // Sort in JS to get the newest one if there are duplicates with the same slug
  const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));
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
    .map(doc => ({ id: doc.id, ...doc.data() } as Package))
    .filter(pkg => pkg.slug !== excludeSlug)
    .slice(0, count);
  return related;
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
export const updateBooking = async (id: string, data: Partial<Booking>) => updateDoc(doc(db, 'bookings', id), data);
export const deleteBooking = async (id: string) => deleteDoc(doc(db, 'bookings', id));

// Gallery
const galleryCol = collection(db, 'gallery');
export const getGalleryImages = async () => getDocs(query(galleryCol, orderBy('createdAt', 'desc')));
export const addGalleryImage = async (data: Omit<GalleryImage, 'id'>) => addDoc(galleryCol, data);
export const deleteGalleryImage = async (id: string) => deleteDoc(doc(db, 'gallery', id));

// Settings
export const getSiteSettings = async () => {
  const docSnap = await getDoc(doc(db, 'settings', 'site'));
  return docSnap.exists() ? (docSnap.data() as import('@/types').SiteSettings) : null;
};
export const updateSiteSettings = async (data: Partial<import('@/types').SiteSettings>) => {
  return setDoc(doc(db, 'settings', 'site'), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
};
