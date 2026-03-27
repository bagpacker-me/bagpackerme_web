const fs = require('fs');
const path = require('path');

const dirs = [
  'app/(public)/packages/[slug]',
  'app/(public)/blog/[slug]',
  'app/(public)/about',
  'app/(public)/contact',
  'app/(admin)/admin/login',
  'app/(admin)/admin/dashboard',
  'app/(admin)/admin/packages/new',
  'app/(admin)/admin/packages/[id]',
  'app/(admin)/admin/blog/new',
  'app/(admin)/admin/blog/[id]',
  'app/(admin)/admin/enquiries',
  'app/api/subscribe',
  'components/ui',
  'components/layout',
  'components/home',
  'components/packages',
  'components/blog',
  'components/admin',
  'lib',
  'hooks',
  'types',
  'public/fonts',
  'styles'
];

const files = [
  'app/(public)/layout.tsx',
  'app/(public)/page.tsx',
  'app/(public)/packages/page.tsx',
  'app/(public)/packages/[slug]/page.tsx',
  'app/(public)/blog/page.tsx',
  'app/(public)/blog/[slug]/page.tsx',
  'app/(public)/about/page.tsx',
  'app/(public)/contact/page.tsx',
  'app/(admin)/layout.tsx',
  'app/(admin)/admin/login/page.tsx',
  'app/(admin)/admin/dashboard/page.tsx',
  'app/(admin)/admin/packages/page.tsx',
  'app/(admin)/admin/packages/new/page.tsx',
  'app/(admin)/admin/packages/[id]/page.tsx',
  'app/(admin)/admin/blog/page.tsx',
  'app/(admin)/admin/blog/new/page.tsx',
  'app/(admin)/admin/blog/[id]/page.tsx',
  'app/(admin)/admin/enquiries/page.tsx',
  'app/api/subscribe/route.ts',
  'styles/globals.css'
];

const cwd = process.cwd();

dirs.forEach(dir => {
  fs.mkdirSync(path.join(cwd, dir), { recursive: true });
});

files.forEach(file => {
  const filepath = path.join(cwd, file);
  if (!fs.existsSync(filepath)) {
    if (file.endsWith('page.tsx') || file.endsWith('layout.tsx')) {
      fs.writeFileSync(filepath, 'export default function Component() { return null; }\n');
    } else if (file.endsWith('route.ts')) {
      fs.writeFileSync(filepath, 'import { NextResponse } from "next/server";\nexport async function GET() { return NextResponse.json({ status: "ok" }); }\n');
    } else if (file.endsWith('.css')) {
      fs.writeFileSync(filepath, '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n');
    } else {
      fs.writeFileSync(filepath, '');
    }
  }
});

console.log('Scaffolding complete.');
