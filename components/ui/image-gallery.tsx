import Image from "next/image";
import type { PackageMarket } from "@/types";

const INDIA_GALLERY_IMAGES = [
  {
    src: "/web_photos/gallery_1.webp",
    alt: "A traditional houseboat gliding through Kerala backwaters beneath coconut palms",
    title: "Kerala Backwaters",
    tagline: "Drift through quiet canals framed by swaying palms.",
  },
  {
    src: "/web_photos/gallery_2.webp",
    alt: "The Golden Temple in Amritsar reflected in the sacred pool",
    title: "Golden Temple",
    tagline: "Find stillness where gold, water, and prayer meet.",
  },
  {
    src: "/web_photos/gallery_3.webp",
    alt: "Boats resting along the Varanasi ghats at sunset",
    title: "Varanasi Ghats",
    tagline: "Follow the river into a city that never loses its soul.",
  },
  {
    src: "/web_photos/gallery_4.webp",
    alt: "The Taj Mahal glowing above its reflection at dusk",
    title: "Taj Mahal",
    tagline: "Stand before India's timeless ode to love and symmetry.",
  },
  {
    src: "/web_photos/gallery_5.webp",
    alt: "Pangong Lake beneath dramatic mountain peaks in Ladakh",
    title: "Ladakh Highlands",
    tagline: "Chase thin-air horizons and impossible shades of blue.",
  },
  {
    src: "/web_photos/gallery_6.webp",
    alt: "Fishing boats floating off the palm-lined shore of Lakshadweep",
    title: "Lakshadweep",
    tagline: "Slip into slow coastal mornings and crystal-clear water.",
  },
];

const GLOBAL_GALLERY_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&q=80&w=1200",
    alt: "Pattaya coastline with boats on blue water",
    title: "Pattaya",
    tagline: "Ease into Thailand with island water and coastal evenings.",
  },
  {
    src: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1200",
    alt: "Vietnam river landscape with boats and mountains",
    title: "Vietnam",
    tagline: "Move from lantern towns to old quarters and limestone bays.",
  },
  {
    src: "https://images.unsplash.com/photo-1557750255-c76072a7aad1?auto=format&fit=crop&q=80&w=1200",
    alt: "Halong Bay limestone islands in misty water",
    title: "Halong Bay",
    tagline: "Sleep on the water among limestone towers and morning light.",
  },
  {
    src: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200",
    alt: "Safari vehicle watching wildlife in Kenya",
    title: "Masai Mara",
    tagline: "Spend real time with the plains instead of rushing through them.",
  },
  {
    src: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=1200",
    alt: "Elephants walking across an African savannah",
    title: "Amboseli",
    tagline: "Watch elephant herds move beneath Kilimanjaro skies.",
  },
  {
    src: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=1200",
    alt: "Tropical garden path in Thailand",
    title: "Nong Nooch",
    tagline: "Fold a botanical garden day into a compact Thailand escape.",
  },
];

export default function ImageGallery({ market = "global" }: { market?: PackageMarket }) {
  const images = market === "india" ? INDIA_GALLERY_IMAGES : GLOBAL_GALLERY_IMAGES;
  const title = market === "india" ? "Glimpses of Incredible India" : "Glimpses of the world";
  const description =
    market === "india"
      ? "From sacred ghats and marble icons to high-altitude lakes and palm-fringed channels, discover the diverse rhythms of the subcontinent."
      : "From Thailand's coast to Vietnam's old towns and Kenya's open plains, build a journey with texture and pace.";

  return (
    <section className="w-full py-28 bg-white overflow-hidden">
      {/* Heading - Left Aligned to Break Center Monotony */}
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl mb-12">
        <div className="max-w-xl">
          <div className="accent-line-cyan" />
          <h2 className="text-4xl md:text-5xl font-bold font-display text-void tracking-tight">
            {title}
          </h2>
          <p className="text-base text-void/65 mt-4 font-body leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Accordion Gallery */}
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <div className="image-gallery-grid flex h-auto w-full flex-col items-stretch gap-4 md:h-[480px] md:flex-row">
          {images.map((img) => (
            <div
                key={img.title}
                className="image-gallery-card group relative h-[240px] origin-center overflow-hidden rounded-2xl border border-medium/10 shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-[flex-grow,box-shadow] duration-500 ease-out motion-reduce:transition-none md:h-auto md:basis-0 md:grow"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={800}
                  height={1200}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={60}
                  className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                />
                
                {/* Overlay gradient */}
                <div className="image-gallery-overlay pointer-events-none absolute inset-0 bg-gradient-to-t from-void/90 via-void/40 to-transparent opacity-100 transition-opacity duration-300 motion-reduce:transition-none" />
                
                <div className="image-gallery-caption pointer-events-none absolute bottom-6 left-6 right-6 z-10 translate-y-0 opacity-100 transition-all duration-500 motion-reduce:transition-none">
                  <p className="text-[10px] font-display font-bold uppercase tracking-[0.22em] text-lime mb-1">
                    {img.title}
                  </p>
                  <div className="image-gallery-tagline mt-2 max-h-[60px] overflow-hidden opacity-100 transition-all duration-500 ease-out motion-reduce:transition-none">
                    <p className="text-white/80 text-sm font-body leading-relaxed">
                      {img.tagline}
                    </p>
                  </div>
                </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
