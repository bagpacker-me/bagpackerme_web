type IdleDeadline = {
  didTimeout: boolean;
  timeRemaining: () => number;
};

type IdleWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (
      callback: (deadline: IdleDeadline) => void,
      options?: { timeout?: number }
    ) => number;
    cancelIdleCallback?: (handle: number) => void;
  };

export function scheduleIdleTask(callback: () => void, timeout = 2500) {
  if (typeof window === 'undefined') return () => {};

  const idleWindow = window as IdleWindow;

  if (typeof idleWindow.requestIdleCallback === 'function') {
    const handle = idleWindow.requestIdleCallback(() => callback(), { timeout });
    return () => idleWindow.cancelIdleCallback?.(handle);
  }

  const handle = window.setTimeout(callback, Math.min(timeout, 1500));
  return () => window.clearTimeout(handle);
}

/**
 * Run non-essential work only after the document has fully loaded and a real
 * delay has passed. `requestIdleCallback`'s timeout is a deadline, not a
 * minimum wait, so it is not suitable for third-party telemetry that must stay
 * out of the loading critical path.
 */
export function scheduleAfterPageLoad(callback: () => void, delay = 0) {
  if (typeof window === 'undefined') return () => {};

  let cancelled = false;
  let timeoutHandle: number | undefined;

  const run = () => {
    timeoutHandle = window.setTimeout(() => {
      if (!cancelled) callback();
    }, delay);
  };

  if (document.readyState === 'complete') {
    run();
  } else {
    window.addEventListener('load', run, { once: true });
  }

  return () => {
    cancelled = true;
    window.removeEventListener('load', run);
    if (timeoutHandle !== undefined) window.clearTimeout(timeoutHandle);
  };
}
