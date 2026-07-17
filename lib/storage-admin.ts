import 'server-only';
import { adminAccessToken, adminStorageBucketName } from '@/lib/firebase-admin';

// Server-side Cloud Storage access over the JSON API. See adminAccessToken() in
// lib/firebase-admin.ts for why this is REST rather than a client library.
//
// Every object touched here lives under applications/, which storage.rules deny
// to everyone — these calls carry an OAuth token and so bypass the rules
// entirely. That is the whole design: the rules are the wall, and this module is
// the only door.

const UPLOAD_BASE = 'https://storage.googleapis.com/upload/storage/v1/b';
const OBJECT_BASE = 'https://storage.googleapis.com/storage/v1/b';

const REQUEST_TIMEOUT_MS = 15_000;

/** Object paths are a single path segment in the URL, so slashes must escape. */
const encodeObjectPath = (path: string) => encodeURIComponent(path);

async function errorDetail(response: Response): Promise<string> {
  const body = await response.text().catch(() => '');
  return `${response.status} ${body.slice(0, 200)}`;
}

/**
 * Uploads an object. Throws on failure — callers must not report success to a
 * candidate whose CV did not land.
 */
export async function uploadPrivateObject(options: {
  path: string;
  body: Buffer;
  contentType: string;
}): Promise<void> {
  const { path, body, contentType } = options;
  const token = await adminAccessToken();
  const bucket = adminStorageBucketName();

  const url = `${UPLOAD_BASE}/${encodeURIComponent(bucket)}/o?uploadType=media&name=${encodeObjectPath(path)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': contentType,
      // Belt and braces alongside storage.rules: even if a CV path somehow
      // became reachable, it must never sit in a shared cache.
      'Cache-Control': 'private, max-age=0, no-store',
    },
    body: new Uint8Array(body),
    cache: 'no-store',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Storage upload failed: ${await errorDetail(response)}`);
  }
}

/**
 * Opens an object for reading. Returns null if it does not exist, so a deleted
 * or mis-pathed CV surfaces as a 404 rather than a 500.
 */
export async function openPrivateObjectStream(
  path: string
): Promise<ReadableStream<Uint8Array> | null> {
  const token = await adminAccessToken();
  const bucket = adminStorageBucketName();

  const url = `${OBJECT_BASE}/${encodeURIComponent(bucket)}/o/${encodeObjectPath(path)}?alt=media`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (response.status === 404) return null;

  if (!response.ok) {
    throw new Error(`Storage read failed: ${await errorDetail(response)}`);
  }

  return response.body;
}

/**
 * Deletes an object. A missing object counts as success — the caller's goal is
 * that the bytes are gone, and a 404 means they already are.
 */
export async function deletePrivateObject(path: string): Promise<void> {
  const token = await adminAccessToken();
  const bucket = adminStorageBucketName();

  const url = `${OBJECT_BASE}/${encodeURIComponent(bucket)}/o/${encodeObjectPath(path)}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok && response.status !== 404) {
    throw new Error(`Storage delete failed: ${await errorDetail(response)}`);
  }
}
