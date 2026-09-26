'use client';

import { useEffect } from 'react';

type BlogEvent = {
  name: string;
  params: Record<string, string>;
};

type AnalyticsWindow = Window & {
  __bagpackermeAnalyticsQueue?: BlogEvent[];
  __bagpackermeTrack?: (name: string, params: Record<string, string>) => void;
};

function track(name: string, params: Record<string, string>) {
  const analyticsWindow = window as AnalyticsWindow;
  if (typeof analyticsWindow.__bagpackermeTrack === 'function') {
    analyticsWindow.__bagpackermeTrack(name, params);
    return;
  }

  // Google Analytics is deliberately deferred for page performance. Preserve
  // meaningful editorial events until the existing deferred tag is ready.
  analyticsWindow.__bagpackermeAnalyticsQueue ||= [];
  analyticsWindow.__bagpackermeAnalyticsQueue.push({ name, params });
}

/**
 * Small, delegated analytics layer for editorial content. It records only
 * product interactions requested for the Journal—no form fields, personal
 * data, scroll fingerprints or behavioural profiling.
 */
export default function BlogArticleAnalytics({ slug, title }: { slug: string; title: string }) {
  useEffect(() => {
    track('blog_article_view', { article_slug: slug, article_title: title });
  }, [slug, title]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const source = event.target.closest<HTMLElement>('[data-blog-event]');
      const name = source?.dataset.blogEvent;
      if (!source || !name) return;

      track(name, {
        article_slug: source.dataset.blogSlug || slug,
        article_title: title,
        ...(source.dataset.relatedSlug ? { related_article_slug: source.dataset.relatedSlug } : {}),
      });
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [slug, title]);

  return null;
}
