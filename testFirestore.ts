import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, limit } from 'firebase/firestore';

const app = initializeApp({
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
});

const db = getFirestore(app);
const packagesCol = collection(db, 'packages');

getDocs(query(packagesCol, where('status', '==', 'published'), limit(6))).then(snap => {
  console.log('Docs count:', snap.docs.length);
  process.exit(0);
}).catch(e => {
  console.error('Error in getFeaturedPackages:', e);
  process.exit(1);
});
