import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
});
const db = getFirestore(app);
getDocs(collection(db, 'packages')).then(snap => {
  console.log('Docs count:', snap.docs.length);
  process.exit(0);
}).catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
