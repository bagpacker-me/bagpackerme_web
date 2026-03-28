export default function PublicLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center grain-overlay" style={{ background: 'var(--color-surface-dark)' }}>
      {/* Logo mark */}
      <div className="relative flex items-center justify-center mb-6">
        {/* Outer pulse ring */}
        <div className="absolute w-20 h-20 rounded-full border-2 border-[var(--color-accent)] animate-ping opacity-30" />
        {/* Inner circle */}
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(193, 234, 0, 0.2)', border: '1px solid rgba(193, 234, 0, 0.4)' }}>
          {/* BP Monogram */}
          <span className="font-bold text-xl tracking-tight" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-display)' }}>
            BP
          </span>
        </div>
      </div>
      {/* Brand name */}
      <p className="text-sm font-medium tracking-widest uppercase animate-pulse" style={{ color: 'var(--color-text-inverse-dim)', fontFamily: 'var(--font-display)' }}>
        BagPackerMe
      </p>
    </div>
  );
}
