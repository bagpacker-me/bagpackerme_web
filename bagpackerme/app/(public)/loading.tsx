export default function PublicLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1a2e1e]">
      {/* Logo mark */}
      <div className="relative flex items-center justify-center mb-6">
        {/* Outer pulse ring */}
        <div className="absolute w-20 h-20 rounded-full border-2 border-[#C1EA00]/30 animate-ping" />
        {/* Inner circle */}
        <div className="w-16 h-16 rounded-full bg-[#C1EA00]/20 border border-[#C1EA00]/40 flex items-center justify-center">
          {/* BP Monogram */}
          <span className="text-[#C1EA00] font-bold text-xl tracking-tight" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            BP
          </span>
        </div>
      </div>
      {/* Brand name */}
      <p className="text-white/60 text-sm font-medium tracking-widest uppercase animate-pulse" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        BagPackerMe
      </p>
    </div>
  );
}
