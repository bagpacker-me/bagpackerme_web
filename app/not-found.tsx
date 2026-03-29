import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="min-h-screen relative flex flex-col items-center justify-center px-6 text-center overflow-hidden grain-overlay"
      style={{
        background: 'var(--color-surface-dark)',
      }}
    >
      <div className="relative z-10 font-body">
        {/* 404 number */}
        <p className="text-[10rem] font-bold text-white/5 leading-none select-none font-display">
          404
        </p>

        {/* Logo label eyebrow */}
        <div className="flex justify-center mb-6 -mt-8">
          <span className="section-label">PAGE NOT FOUND</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display" style={{ letterSpacing: 'var(--tracking-tight)' }}>
          Lost on the Trail?
        </h1>

        {/* Subtitle */}
        <p className="text-white/60 text-base max-w-md mx-auto mb-10 leading-relaxed font-body">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="btn-primary"
          >
            Back to Home
          </Link>
          <Link
            href="/packages"
            className="btn-ghost"
          >
            Explore Trips →
          </Link>
        </div>
      </div>
    </div>
  );
}
