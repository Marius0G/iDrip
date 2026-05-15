import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Shirt, ArrowRight } from "lucide-react";
import type { Outfit } from "@/types/outfit";
import { cn } from "@/lib/utils";

interface RecentOutfitCarouselProps {
  outfits: Outfit[];
}

export function RecentOutfitCarousel({ outfits }: RecentOutfitCarouselProps) {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const visibleOutfits = outfits.slice(0, 5);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    // Collapse the root rect to a 1px vertical line at horizontal center.
    // Only the card overlapping that line is considered active — no
    // per-frame layout reads, observer fires only on crossings.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = itemRefs.current.indexOf(entry.target as HTMLButtonElement);
          if (i !== -1) setActiveIndex(i);
        }
      },
      { root, rootMargin: "0px -50% 0px -50%", threshold: 0 }
    );

    for (const el of itemRefs.current) {
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [visibleOutfits.length]);

  if (outfits.length === 0) return null;

  const scrollTo = (i: number) => {
    itemRefs.current[i]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <section>
      <div className="flex items-end justify-between mb-4 gap-4">
        <div>
          <p className="kit-overline">Recent</p>
          <h3 className="kit-display text-2xl md:text-3xl mt-1.5">Outfits</h3>
        </div>
        <button
          onClick={() => navigate("/generator")}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-[filter,transform] bg-[hsl(var(--sidebar-accent))] text-black hover:brightness-95 active:scale-[0.97]"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div
        className="relative -mx-4"
        style={
          {
            "--card-w": "min(26rem, calc(100vw - 3rem))",
          } as React.CSSProperties
        }
      >
        <span className="carousel-edge-left" aria-hidden />
        <span className="carousel-edge-right" aria-hidden />
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory scroll-smooth"
          style={{
            paddingInline: "max(1rem, calc((100% - var(--card-w)) / 2))",
          }}
        >
          {visibleOutfits.map((outfit, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={outfit.id}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                onClick={() => {
                  if (isActive) navigate("/generator");
                  else scrollTo(i);
                }}
                className={cn(
                  "kit-card p-6 flex-shrink-0 snap-center text-left transition-[opacity,box-shadow] duration-500 ease-out",
                  isActive ? "opacity-100" : "opacity-40"
                )}
                style={{
                  width: "var(--card-w)",
                }}
              >
                <div className="grid grid-cols-2 gap-3 h-72 mb-6">
                  {[0, 1, 2, 3].map((j) => {
                    const item = outfit.items[j];
                    return (
                      <div
                        key={j}
                        className="kit-thumb flex items-center justify-center"
                      >
                        {item ? (
                          <img
                            src={item.clothingItem.imageUrl}
                            alt={item.clothingItem.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Shirt className="w-8 h-8 kit-muted opacity-40" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-display text-xl font-semibold truncate kit-strong">
                      {outfit.name}
                    </h4>
                    <p className="text-sm kit-muted mt-1 truncate">
                      {outfit.items.length} items · {outfit.occasion}
                    </p>
                  </div>
                  <span className="kit-icon-pill flex-shrink-0">
                    <Heart className="w-[18px] h-[18px]" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center gap-1.5 mt-2">
        {visibleOutfits.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Go to outfit ${i + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === activeIndex
                ? "w-6 bg-[hsl(var(--sidebar-accent))]"
                : "w-1.5 bg-[hsl(var(--sidebar-border))]"
            )}
          />
        ))}
      </div>
    </section>
  );
}
