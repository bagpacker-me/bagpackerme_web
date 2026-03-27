import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="min-h-screen relative flex flex-col items-center justify-center px-6 text-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a2e1e 0%, #285056 100%)',
      }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#C1EA00] blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-white blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* 404 number */}
        <p className="text-[10rem] font-black text-white/5 leading-none select-none" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          404
        </p>

        {/* Logo */}
        <div className="w-16 h-16 rounded-full bg-[#C1EA00]/20 border border-[#C1EA00]/40 flex items-center justify-center mb-6 mx-auto -mt-8">
          <span className="text-[#C1EA00] font-bold text-xl" style={{ fontFamily: 'DM Sans, sans-serif' }}>BP</span>
        </div>

        {/* Label */}
        <p className="text-[#C1EA00] text-sm font-semibold tracking-widest uppercase mb-3">Page Not Found</p>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          Lost on the Trail?
        </h1>

        {/* Subtitle */}
        <p className="text-white/60 text-base max-w-md mx-auto mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="px-8 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
            style={{ background: '#C1EA00', color: '#1a2e1e' }}
          >
            Back to Home
          </Link>
          <Link
            href="/packages"
            className="px-8 py-3 rounded-xl text-sm font-bold border border-white/20 text-white hover:bg-white/10 transition-colors"
          >
            Explore Trips →
          </Link>
        </div>
      </div>
    </div>
  );
}
