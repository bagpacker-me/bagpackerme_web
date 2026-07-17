/**
 * CV validation tests. Run with: npm run test:cv
 *
 * lib/careers-cv.ts is the security boundary for candidate uploads: it is the
 * only thing standing between a hostile file and our Storage bucket, and it is
 * the reason the apply route can trust the content type it stores. The client's
 * declared Content-Type, filename, and extension are all attacker-chosen, so
 * every assertion below is about ignoring what the client claims.
 *
 * The --conditions=react-server flag is what lets `server-only` resolve outside
 * of Next; without it this module refuses to import.
 */
import { validateCvBuffer, sanitizeCvFilename, buildCvPath } from './lib/careers-cv.ts';

let pass = 0, fail = 0;
const check = (name, cond) => {
  if (cond) { console.log(`  PASS  ${name}`); pass++; }
  else { console.log(`  FAIL  ${name}`); fail++; }
};

console.log('\n--- Magic-byte detection ---');

const pdf = Buffer.concat([Buffer.from('%PDF-1.7\n'), Buffer.alloc(100)]);
check('real PDF is accepted as application/pdf',
  validateCvBuffer(pdf).ok && validateCvBuffer(pdf).contentType === 'application/pdf');

// A .docx is a zip whose early entries name word/ parts.
const docx = Buffer.concat([
  Buffer.from([0x50, 0x4b, 0x03, 0x04]),
  Buffer.from('....[Content_Types].xml....word/document.xml....'),
  Buffer.alloc(100),
]);
const docxResult = validateCvBuffer(docx);
check('real DOCX is accepted as the OOXML content type',
  docxResult.ok && docxResult.ext === 'docx' &&
  docxResult.contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

console.log('\n--- Hostile uploads (must be rejected) ---');

// The whole point of magic bytes: a JPEG renamed cv.pdf.
const jpeg = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(100)]);
check('a JPEG renamed cv.pdf is rejected', !validateCvBuffer(jpeg).ok);

// A plain zip shares magic bytes with docx — this is the discriminator.
const plainZip = Buffer.concat([
  Buffer.from([0x50, 0x4b, 0x03, 0x04]),
  Buffer.from('....evil.exe....payload....'),
  Buffer.alloc(100),
]);
check('a plain zip renamed .docx is rejected', !validateCvBuffer(plainZip).ok);

check('an empty file is rejected', !validateCvBuffer(Buffer.alloc(0)).ok);
check('random bytes are rejected', !validateCvBuffer(Buffer.from('hello world, not a document')).ok);

// A zip whose word/ marker sits beyond the scan window must not sneak through.
const lateMarker = Buffer.concat([
  Buffer.from([0x50, 0x4b, 0x03, 0x04]),
  Buffer.alloc(8000, 0x41),
  Buffer.from('word/document.xml'),
]);
check('a zip hiding word/ beyond the scan window is rejected', !validateCvBuffer(lateMarker).ok);

console.log('\n--- Filename sanitization ---');

check('strips traversal segments',
  sanitizeCvFilename('../../packages/hero.pdf', 'pdf') === 'hero.pdf');
check('strips backslash traversal',
  sanitizeCvFilename('..\\..\\windows\\system32\\evil.pdf', 'pdf') === 'evil.pdf');
check('forces the DETECTED extension, not the claimed one',
  sanitizeCvFilename('resume.exe', 'pdf') === 'resume.pdf');
check('collapses unsafe characters',
  /^[A-Za-z0-9._-]+$/.test(sanitizeCvFilename('my résumé (final)!!.pdf', 'pdf')));
check('an all-unsafe name still yields a usable filename',
  sanitizeCvFilename('***.pdf', 'pdf') === 'resume.pdf');
check('truncates an absurdly long name',
  sanitizeCvFilename('a'.repeat(500) + '.pdf', 'pdf').length <= 85);
check('a bare dotfile does not become an extension-only name',
  sanitizeCvFilename('.htaccess', 'pdf').endsWith('.pdf'));

console.log('\n--- Storage paths ---');

const p1 = buildCvPath('job123', 'pdf');
const p2 = buildCvPath('job123', 'pdf');
check('path is scoped under applications/', p1.startsWith('applications/job123/'));
check('path ends with the detected extension', p1.endsWith('/resume.pdf'));
check('two uploads to one job never collide', p1 !== p2);
check('a traversal jobId cannot escape the prefix',
  !buildCvPath('../../gallery', 'pdf').includes('../') &&
  buildCvPath('../../gallery', 'pdf').startsWith('applications/'));

console.log(`\n===== ${pass} passed, ${fail} failed =====`);
process.exit(fail > 0 ? 1 : 0);
