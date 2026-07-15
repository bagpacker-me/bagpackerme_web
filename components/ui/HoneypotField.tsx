import type { RefObject } from 'react';
import { HONEYPOT_FIELD } from '@/lib/honeypot';

// Positioned off-screen rather than `display: none` — the latter is trivially
// detected and skipped by bots that bother to check computed styles.
// aria-hidden + tabIndex=-1 keep it out of the screen-reader tree and tab order,
// so it costs real users nothing.
export function HoneypotField({ inputRef }: { inputRef: RefObject<HTMLInputElement> }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
      <input
        ref={inputRef}
        type="text"
        name={HONEYPOT_FIELD}
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}
