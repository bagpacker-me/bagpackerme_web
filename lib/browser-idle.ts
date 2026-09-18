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

/**
 * Schedule work only after a visitor has made a meaningful page interaction.
 *
 * This is intentionally limited to actions that signal a user is actively
 * using the page. It keeps optional telemetry and UI code out of the initial
 * render path without treating passive browser work as engagement.
 */
export function scheduleOnFirstInteraction(callback: () => void) {
  if (typeof window === 'undefined') return () => {};

  let handled = false;
  const events = ['pointerdown', 'touchstart', 'keydown'] as const;

  const handleInteraction = () => {
    if (handled) return;
    handled = true;
    removeListeners();
    callback();
  };

  const removeListeners = () => {
    events.forEach((eventName) => {
      window.removeEventListener(eventName, handleInteraction);
    });
  };

  events.forEach((eventName) => {
    window.addEventListener(eventName, handleInteraction, { passive: true });
  });

  return removeListeners;
}
