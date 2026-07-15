import type { JsonLdDocument } from '@/lib/structured-data';

// React does NOT escape inside dangerouslySetInnerHTML, so a Firestore string
// containing "</script>" would break out of the tag — a stored-XSS vector.
// This mirrors Next's own htmlEscapeJsonString: escaping "<" kills "</script>"
// and "<!--", "&" closes the entity-decode path, and U+2028/U+2029 are valid in
// JSON strings but are line terminators in JS.
const LS = String.fromCharCode(0x2028); // U+2028 LINE SEPARATOR
const PS = String.fromCharCode(0x2029); // U+2029 PARAGRAPH SEPARATOR
const ESCAPE_LOOKUP: Record<string, string> = {
  '&': '\\u0026',
  '>': '\\u003e',
  '<': '\\u003c',
  [LS]: '\\u2028',
  [PS]: '\\u2029',
};
const ESCAPE_REGEX = new RegExp(`[&><${LS}${PS}]`, 'g');

export function JsonLd({ data }: { data: JsonLdDocument }) {
  const json = JSON.stringify(data).replace(ESCAPE_REGEX, (match) => ESCAPE_LOOKUP[match]);
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
