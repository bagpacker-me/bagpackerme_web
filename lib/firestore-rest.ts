// Decoder for Firestore's REST value format. Used by the server-side data
// fetches that deliberately bypass the client SDK (which stalls Node builds and
// leaks handles) — see getPublishedPackagesFromRest in lib/firestore.ts and
// getSiteSettingsServer in lib/site-settings-server.ts. The rules allow public
// reads of published packages and the settings doc, so a plain keyed fetch works.

export type FirestoreRestValue = {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  timestampValue?: string;
  nullValue?: null;
  arrayValue?: { values?: FirestoreRestValue[] };
  mapValue?: { fields?: Record<string, FirestoreRestValue> };
};

export type FirestoreRestDocument = {
  name: string;
  fields?: Record<string, FirestoreRestValue>;
};

export type FirestoreRunQueryResult = {
  document?: FirestoreRestDocument;
};

export const firestoreValueToJs = (value: FirestoreRestValue): unknown => {
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('timestampValue' in value) return value.timestampValue;
  if ('nullValue' in value) return null;
  if (value.arrayValue) return (value.arrayValue.values ?? []).map(firestoreValueToJs);
  if (value.mapValue) {
    return Object.fromEntries(
      Object.entries(value.mapValue.fields ?? {}).map(([key, nestedValue]) => [
        key,
        firestoreValueToJs(nestedValue),
      ])
    );
  }
  return undefined;
};

export const restDocumentToObject = (document: FirestoreRestDocument): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(document.fields ?? {}).map(([key, value]) => [key, firestoreValueToJs(value)])
  );

/** Public Firestore project id + API key, or null if not configured. */
export const firestoreRestConfig = (): { projectId: string; apiKey: string } | null => {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!projectId || !apiKey) return null;
  return { projectId, apiKey };
};
