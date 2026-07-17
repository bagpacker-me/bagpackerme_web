/**
 * Security rules tests. Run with: npm run test:rules
 * (Requires the Firebase CLI and a JDK — the Firestore emulator is a Java process.)
 *
 * firestore.rules is the real security boundary for this app: the public site
 * talks to Firestore directly from the browser, so a mistake here is a data
 * leak, and a mistake in the other direction silently breaks the admin panel.
 * Both directions are asserted below.
 */
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'node:fs';
import { doc, setDoc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';

const ADMIN = 'bagpackerme.world@gmail.com';
const NOW = new Date().toISOString();

const testEnv = await initializeTestEnvironment({
  projectId: 'bagpackerme-webb',
  firestore: {
    rules: readFileSync(new URL('./firestore.rules', import.meta.url), 'utf8'),
    host: '127.0.0.1',
    port: 8080,
  },
});

const anon = testEnv.unauthenticatedContext().firestore();
const admin = testEnv.authenticatedContext('admin-uid', { email: ADMIN }).firestore();
const rando = testEnv.authenticatedContext('rando-uid', { email: 'attacker@evil.com' }).firestore();

let pass = 0;
let fail = 0;
async function check(name, promise) {
  try {
    await promise;
    console.log(`  PASS  ${name}`);
    pass++;
  } catch (e) {
    console.log(`  FAIL  ${name}\n        ${e.message.split('\n')[0]}`);
    fail++;
  }
}

const publicDoc = (code) => ({
  code,
  name: 'Attacker',
  status: 'active',
  totalClicks: 999999,
  totalLeads: 999,
  totalBookings: 999,
  createdAt: NOW,
  updatedAt: NOW,
});

// Each of these was possible before the Admin SDK migration: the API routes
// used the client SDK, so the rules had to allow anonymous writes.
console.log('\n--- Anonymous writes (must be denied) ---');
await check(
  'cannot self-approve as an active affiliate',
  assertFails(setDoc(doc(anon, 'affiliate_public/BP-EVIL01'), publicDoc('BP-EVIL01')))
);
await check(
  'cannot set arbitrary affiliate counters',
  assertFails(setDoc(doc(anon, 'affiliate_public/BP-EVIL02'), publicDoc('BP-EVIL02')))
);
await check(
  'cannot block a victim email via the registration index',
  assertFails(
    setDoc(doc(anon, 'affiliate_registration_index/victimhash'), {
      emailHash: 'victimhash',
      affiliateId: 'x',
      affiliateCode: 'BP-X',
      createdAt: NOW,
    })
  )
);
await check(
  'cannot inject into the private affiliates collection',
  assertFails(setDoc(doc(anon, 'affiliates/evil'), { name: 'E', email: 'e@e.com', code: 'BP-E' }))
);
await check(
  'cannot forge affiliate conversion events',
  assertFails(
    setDoc(doc(anon, 'affiliate_public/BP-X/events/sess1'), {
      affiliateCode: 'BP-X',
      pageUrl: '',
      sessionId: 'sess1',
      convertedToEnquiry: true,
      convertedToBooking: true,
      createdAt: NOW,
      updatedAt: NOW,
    })
  )
);
await check(
  'cannot create enquiries directly, bypassing route validation',
  assertFails(setDoc(doc(anon, 'enquiries/evil'), { junk: 'x'.repeat(100) }))
);
await check(
  'a signed-in non-admin cannot write affiliate_public',
  assertFails(setDoc(doc(rando, 'affiliate_public/BP-EVIL03'), publicDoc('BP-EVIL03')))
);
await check('cannot read customers', assertFails(getDoc(doc(anon, 'customers/c1'))));
await check('cannot read bookings', assertFails(getDoc(doc(anon, 'bookings/b1'))));

console.log('\n--- Public site (must keep working) ---');
await check(
  'newsletter signup with a valid shape',
  assertSucceeds(setDoc(doc(anon, 'subscribers/s1'), { email: 'a@b.com', createdAt: NOW }))
);
await check(
  'newsletter signup rejects extra fields',
  assertFails(setDoc(doc(anon, 'subscribers/s2'), { email: 'a@b.com', createdAt: NOW, evil: 'x' }))
);
await check(
  'newsletter signup rejects a malformed email',
  assertFails(setDoc(doc(anon, 'subscribers/s3'), { email: 'notanemail', createdAt: NOW }))
);
await check(
  'affiliate dashboard can read affiliate_public',
  assertSucceeds(getDoc(doc(anon, 'affiliate_public/BP-ANY')))
);
await check(
  'registration can check the duplicate-email index',
  assertSucceeds(getDoc(doc(anon, 'affiliate_registration_index/somehash')))
);
await check('site settings are readable', assertSucceeds(getDoc(doc(anon, 'settings/site'))));

console.log('\n--- Admin panel (runs client-side, must keep working) ---');
await check(
  'syncs affiliate_public on status change',
  assertSucceeds(setDoc(doc(admin, 'affiliate_public/BP-GOOD1'), publicDoc('BP-GOOD1')))
);
await check(
  'updates affiliate_public',
  assertSucceeds(updateDoc(doc(admin, 'affiliate_public/BP-GOOD1'), { status: 'paused' }))
);
// deleteAffiliate() batches these three deletes; a batch fails atomically, so
// each one must be permitted or affiliate deletion breaks entirely.
await check(
  'deleteAffiliate: removes the registration index entry',
  assertSucceeds(deleteDoc(doc(admin, 'affiliate_registration_index/somehash')))
);
await check(
  'deleteAffiliate: removes affiliate_public events',
  assertSucceeds(deleteDoc(doc(admin, 'affiliate_public/BP-GOOD1/events/s1')))
);
await testEnv.withSecurityRulesDisabled(async (ctx) => {
  await setDoc(doc(ctx.firestore(), 'affiliates/a1'), { name: 'A', status: 'pending', code: 'BP-A' });
});
await check(
  'updates an existing affiliate',
  assertSucceeds(updateDoc(doc(admin, 'affiliates/a1'), { status: 'active' }))
);
await check(
  'anonymous cannot update that same affiliate',
  assertFails(updateDoc(doc(anon, 'affiliates/a1'), { status: 'active' }))
);
await check('deleteAffiliate: removes the affiliate', assertSucceeds(deleteDoc(doc(admin, 'affiliates/a1'))));
await check('reads customers', assertSucceeds(getDoc(doc(admin, 'customers/c1'))));
await check(
  'writes packages',
  assertSucceeds(setDoc(doc(admin, 'packages/p1'), { title: 'T', status: 'published' }))
);
await check('writes gallery', assertSucceeds(setDoc(doc(admin, 'gallery/g1'), { url: 'u' })));
await check('reads enquiries', assertSucceeds(getDoc(doc(admin, 'enquiries/e1'))));

// Testimonials: public reads published, admin writes (mirrors packages/blogs).
await check(
  'admin writes a testimonial',
  assertSucceeds(setDoc(doc(admin, 'testimonials/t1'), { authorName: 'A', quote: 'Q', rating: 5, status: 'published' }))
);
await testEnv.withSecurityRulesDisabled(async (ctx) => {
  await setDoc(doc(ctx.firestore(), 'testimonials/pub'), { authorName: 'A', quote: 'Q', rating: 5, status: 'published' });
  await setDoc(doc(ctx.firestore(), 'testimonials/dft'), { authorName: 'A', quote: 'Q', rating: 5, status: 'draft' });
});
await check('public reads a published testimonial', assertSucceeds(getDoc(doc(anon, 'testimonials/pub'))));
await check('public cannot read a draft testimonial', assertFails(getDoc(doc(anon, 'testimonials/dft'))));
await check(
  'public cannot write a testimonial',
  assertFails(setDoc(doc(anon, 'testimonials/hack'), { authorName: 'X', quote: 'Q', rating: 5, status: 'published' }))
);

// Job openings: public reads published, admin writes (mirrors packages/blogs).
console.log('\n--- Careers ---');
await check(
  'admin writes a job opening',
  assertSucceeds(setDoc(doc(admin, 'job_openings/j1'), { title: 'Trip Designer', slug: 'trip-designer', status: 'published' }))
);
await testEnv.withSecurityRulesDisabled(async (ctx) => {
  await setDoc(doc(ctx.firestore(), 'job_openings/pub'), { title: 'T', slug: 't', status: 'published' });
  await setDoc(doc(ctx.firestore(), 'job_openings/dft'), { title: 'T', slug: 't2', status: 'draft' });
  await setDoc(doc(ctx.firestore(), 'job_openings/cls'), { title: 'T', slug: 't3', status: 'closed' });
  await setDoc(doc(ctx.firestore(), 'job_applications/a1'), {
    jobId: 'pub',
    fullName: 'Candidate',
    email: 'candidate@example.com',
    phone: '+910000000000',
    cvPath: 'applications/pub/uuid/resume.pdf',
    status: 'new',
  });
});
await check('public reads a published opening', assertSucceeds(getDoc(doc(anon, 'job_openings/pub'))));
await check('public cannot read a draft opening', assertFails(getDoc(doc(anon, 'job_openings/dft'))));
await check('public cannot read a closed opening', assertFails(getDoc(doc(anon, 'job_openings/cls'))));
await check(
  'public cannot write an opening',
  assertFails(setDoc(doc(anon, 'job_openings/hack'), { title: 'X', slug: 'x', status: 'published' }))
);

// Applications hold candidate PII and a pointer to a private CV. Nothing outside
// the Admin SDK may touch them — the apply route owns creation so its zod and
// magic-byte checks cannot be sidestepped.
await check(
  'public cannot read an application (candidate PII)',
  assertFails(getDoc(doc(anon, 'job_applications/a1')))
);
await check(
  'a signed-in non-admin cannot read an application',
  assertFails(getDoc(doc(rando, 'job_applications/a1')))
);
await check(
  'public cannot create an application, bypassing route validation',
  assertFails(setDoc(doc(anon, 'job_applications/evil'), { fullName: 'Bot', status: 'new' }))
);
await check(
  'public cannot self-shortlist by updating an application',
  assertFails(updateDoc(doc(anon, 'job_applications/a1'), { status: 'shortlisted' }))
);
await check('admin reads an application', assertSucceeds(getDoc(doc(admin, 'job_applications/a1'))));
await check(
  'admin moves an application through the pipeline',
  assertSucceeds(updateDoc(doc(admin, 'job_applications/a1'), { status: 'shortlisted' }))
);
await check(
  'admin deletes an application',
  assertSucceeds(deleteDoc(doc(admin, 'job_applications/a1')))
);

console.log(`\n===== ${pass} passed, ${fail} failed =====`);
await testEnv.cleanup();
process.exit(fail > 0 ? 1 : 0);
