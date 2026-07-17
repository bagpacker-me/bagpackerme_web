import 'server-only';
import { randomUUID } from 'node:crypto';

// Everything here treats the uploaded file as hostile input. The browser's
// declared Content-Type and filename are both attacker-chosen — a `curl -F`
// ignores the accept="" attribute and the client-side size check entirely.

export type CvKind = 'pdf' | 'docx';

export interface CvValidationSuccess {
  ok: true;
  kind: CvKind;
  ext: 'pdf' | 'docx';
  contentType: string;
}

export interface CvValidationFailure {
  ok: false;
  reason: string;
}

export type CvValidationResult = CvValidationSuccess | CvValidationFailure;

const PDF_MAGIC = Buffer.from('%PDF-', 'latin1');
const ZIP_MAGIC = Buffer.from([0x50, 0x4b, 0x03, 0x04]); // "PK\x03\x04"

// A .docx IS a zip, so the magic bytes alone cannot tell a resume from a zip
// bomb someone renamed. The Open Packaging Convention puts the content types
// part first, and every Word document carries a `word/` entry — scanning the
// local file headers near the start for that literal is a cheap discriminator
// that avoids pulling in a zip library to inspect untrusted archives.
const DOCX_MARKERS = ['word/document.xml', 'word/'].map((marker) => Buffer.from(marker, 'latin1'));
const DOCX_SCAN_BYTES = 4096;

/**
 * Identifies an uploaded CV from its bytes.
 *
 * Never trust `File.type` or the extension: both are supplied by the client.
 * The kind returned here is what gets stored and what the download route later
 * serves as Content-Type.
 */
export function validateCvBuffer(buffer: Buffer): CvValidationResult {
  if (buffer.length === 0) {
    return { ok: false, reason: 'The file is empty.' };
  }

  if (buffer.subarray(0, PDF_MAGIC.length).equals(PDF_MAGIC)) {
    return { ok: true, kind: 'pdf', ext: 'pdf', contentType: 'application/pdf' };
  }

  if (buffer.subarray(0, ZIP_MAGIC.length).equals(ZIP_MAGIC)) {
    const head = buffer.subarray(0, DOCX_SCAN_BYTES);
    const looksLikeWord = DOCX_MARKERS.some((marker) => head.includes(marker));

    if (!looksLikeWord) {
      return { ok: false, reason: 'That looks like a zip archive rather than a Word document.' };
    }

    return {
      ok: true,
      kind: 'docx',
      ext: 'docx',
      contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
  }

  return { ok: false, reason: 'Only PDF and DOCX files are accepted.' };
}

/**
 * A display filename for the download's Content-Disposition. Never used to
 * build a storage path — see buildCvPath.
 */
export function sanitizeCvFilename(clientName: string, ext: 'pdf' | 'docx'): string {
  // basename semantics by hand: strip everything up to the last separator so
  // "../../packages/hero.pdf" cannot survive as a path.
  const base = clientName.split(/[\\/]/).pop() ?? '';

  const stem = base
    .replace(/\.[^.]*$/, '')
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')
    .slice(0, 80);

  // Always the extension we detected, not the one claimed.
  return `${stem || 'resume'}.${ext}`;
}

/**
 * Storage path for a CV. The client filename never appears here: the path is
 * built entirely from a validated job id, a server-generated UUID, and the
 * detected extension, so traversal and collisions are both impossible by
 * construction.
 */
export function buildCvPath(jobId: string, ext: 'pdf' | 'docx'): string {
  return `applications/${encodeURIComponent(jobId)}/${randomUUID()}/resume.${ext}`;
}
