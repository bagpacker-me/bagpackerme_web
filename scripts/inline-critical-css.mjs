import { access, readFile, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';
import Critters from 'critters';

const buildDirectory = resolve('.next');
const homeCandidates = [
  resolve(buildDirectory, 'server', 'app', 'index.html'),
  resolve(buildDirectory, 'server', 'app', 'page.html'),
];

async function findHomeDocument() {
  for (const candidate of homeCandidates) {
    try {
      await access(candidate, constants.R_OK | constants.W_OK);
      return candidate;
    } catch {
      // Next has used both names across App Router releases.
    }
  }

  throw new Error(`Could not find the prerendered home document. Checked: ${homeCandidates.join(', ')}`);
}

const homeDocument = await findHomeDocument();
const html = await readFile(homeDocument, 'utf8');

if (!html.includes('/_next/static/css/')) {
  throw new Error(`The home document has no Next CSS links to optimize: ${homeDocument}`);
}

const critters = new Critters({
  path: buildDirectory,
  publicPath: '/_next/',
  preload: 'media',
  fonts: false,
  logLevel: 'silent',
});
const optimizedHtml = (await critters.process(html)).replace(
  /<noscript><link ([^>]*?) media="print" onload="this\.media='all'"><\/noscript>/g,
  '<noscript><link $1></noscript>',
);

if (!optimizedHtml.includes('<style')) {
  throw new Error('Critical CSS extraction produced no inline styles.');
}

await writeFile(homeDocument, optimizedHtml);
console.log(`Inlined home-page critical CSS in ${homeDocument}`);
