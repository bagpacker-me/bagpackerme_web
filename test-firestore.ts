import { getPublishedBlogs } from './lib/firestore';
import { db } from './lib/firebase';
getPublishedBlogs().then(res => {
  console.log("Blogs count:", res.docs.length);
  process.exit(0);
}).catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
