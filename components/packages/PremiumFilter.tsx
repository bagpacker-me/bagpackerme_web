"use client";

import * as React from "react";
import { useState, useCallback, useEffect, useRef, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown, MapPin, Calendar, X } from "lucide-react";
import { cn } from "@/lib/utils";

// FilterBadge Component
const filterBadgeVariants = cva(
  "inline-flex items-center text-[11px] font-medium transition-colors cursor-default",
  {
    variants: {
      variant: {
        default: "rounded-md gap-x-1.5 py-1 pl-2.5 pr-1 bg-white border border-medium shadow-sm text-void/60",
        pill: "rounded-full gap-x-1.5 py-1 pl-3 pr-1.5 bg-white border border-medium shadow-sm text-void/60",
      },
    },
    defaultVariants: {
      variant: "pill",
    },
  }
);

interface FilterBadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof filterBadgeVariants> {
  label?: string;
  value?: string;
  onRemove?: () => void;
}

function FilterBadge({ className, variant, label, value, onRemove, ...props }: FilterBadgeProps) {
  return (
    <span className={cn(filterBadgeVariants({ variant }), className)} {...props}>
      <span className="opacity-70">{label}:</span>
      <span className="text-teal font-semibold ml-1">{value}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          // The dot stays 16px; the `after` pseudo-element carries a 40px
          // target so the badge can still be dismissed with a thumb.
          className="relative ml-1.5 flex size-4 items-center justify-center rounded-full bg-void/5 text-void/40 hover:bg-void/10 hover:text-void transition-colors after:absolute after:-inset-3 after:content-['']"
          aria-label={`Remove ${label ?? ''} filter`.trim()}
        >
          <X className="size-2.5 shrink-0" aria-hidden={true} />
        </button>
      )}
    </span>
  );
}

const valueToPercent = (value: number, min: number, max: number) => {
  return ((value - min) / (max - min)) * 100;
};

type FilterCurrency = "INR" | "USD";

const formatCurrency = (value: number, currency: FilterCurrency) => {
  return new Intl.NumberFormat(currency === "USD" ? "en-US" : "en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

interface PriceRangeSliderProps {
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  currency?: FilterCurrency;
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
}

const PriceRangeSlider = forwardRef<HTMLDivElement, PriceRangeSliderProps>(
  ({ className, min = 0, max = 200000, step = 5000, currency = "INR", defaultValue = [0, 200000], onValueChange, ...props }, ref) => {
    const [localValues, setLocalValues] = useState<[number, number]>(defaultValue);
    const [isMinThumbDragging, setIsMinThumbDragging] = useState(false);
    const [isMaxThumbDragging, setIsMaxThumbDragging] = useState(false);

    const sliderRef = useRef<HTMLDivElement>(null);

    const [minVal, maxVal] = localValues;
    const minPercent = valueToPercent(minVal, min, max);
    const maxPercent = valueToPercent(maxVal, min, max);

    const handleValueChange = useCallback(
      (newValues: [number, number]) => {
        setLocalValues(newValues);
        if (onValueChange) {
          onValueChange(newValues);
        }
      },
      [onValueChange]
    );

    useEffect(() => {
      setLocalValues(defaultValue);
    }, [defaultValue]);

    const isDragging = isMinThumbDragging || isMaxThumbDragging;

    useEffect(() => {
      // Bind only while a thumb is actually held. The previous version kept four
      // document-level listeners attached for the life of the page and re-bound
      // all of them on every value change.
      if (!isDragging) return;

      const handleMove = (event: MouseEvent | TouchEvent) => {
        if (!sliderRef.current) return;

        // A touchmove that reaches the document while a thumb is held is the
        // drag, not a scroll. Without preventDefault the browser scrolled the
        // page underneath the finger and the thumb was effectively immovable on
        // a phone — which is why this listener must be registered non-passive.
        if ("touches" in event && event.cancelable) event.preventDefault();

        const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
        const rect = sliderRef.current.getBoundingClientRect();
        const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        const newValue = Math.round((min + (percent / 100) * (max - min)) / step) * step;

        if (isMinThumbDragging) {
          handleValueChange([Math.min(newValue, maxVal - step), maxVal]);
        }
        if (isMaxThumbDragging) {
          handleValueChange([minVal, Math.max(newValue, minVal + step)]);
        }
      };

      const handleEnd = () => {
        setIsMinThumbDragging(false);
        setIsMaxThumbDragging(false);
      };

      document.addEventListener("mousemove", handleMove);
      document.addEventListener("touchmove", handleMove, { passive: false });
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchend", handleEnd);
      document.addEventListener("touchcancel", handleEnd);

      return () => {
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("touchmove", handleMove);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchend", handleEnd);
        document.removeEventListener("touchcancel", handleEnd);
      };
    }, [isDragging, isMinThumbDragging, isMaxThumbDragging, min, max, step, minVal, maxVal, handleValueChange]);

    // Pressing anywhere on the track jumps the nearer thumb there and starts
    // dragging it. Grabbing a 16px dot was the only way to change the price on
    // a phone, and the fixed WhatsApp button overlaps the right of the viewport,
    // so at some scroll offsets the max thumb could not be touched at all.
    const handleTrackPointerDown = useCallback(
      (event: React.MouseEvent | React.TouchEvent) => {
        if (!sliderRef.current) return;

        const clientX =
          "touches" in event ? event.touches[0].clientX : (event as React.MouseEvent).clientX;
        const rect = sliderRef.current.getBoundingClientRect();
        const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        const newValue = Math.round((min + (percent / 100) * (max - min)) / step) * step;

        // Nearer thumb wins; a tie hands it to the max thumb, which is the one
        // people reach for when narrowing a budget.
        const grabMin = Math.abs(newValue - minVal) < Math.abs(newValue - maxVal);

        if (grabMin) {
          setIsMinThumbDragging(true);
          handleValueChange([Math.min(newValue, maxVal - step), maxVal]);
        } else {
          setIsMaxThumbDragging(true);
          handleValueChange([minVal, Math.max(newValue, minVal + step)]);
        }
      },
      [min, max, step, minVal, maxVal, handleValueChange]
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, thumb: "min" | "max") => {
      let newMinValue = minVal;
      let newMaxValue = maxVal;

      if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        if (thumb === "min") newMinValue = Math.max(min, minVal - step);
        else newMaxValue = Math.max(minVal + step, maxVal - step);
      } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        if (thumb === "min") newMinValue = Math.min(maxVal - step, minVal + step);
        else newMaxValue = Math.min(max, maxVal + step);
      } else if (e.key === "Home") {
        e.preventDefault();
        if (thumb === "min") newMinValue = min;
        else newMaxValue = minVal + step;
      } else if (e.key === "End") {
        e.preventDefault();
        if (thumb === "min") newMinValue = maxVal - step;
        else newMaxValue = max;
      }

      handleValueChange([newMinValue, newMaxValue]);
    };

    return (
      <div className={cn("w-full relative flex flex-col justify-center", className)} {...props} ref={ref}>
        {/* Stacked on mobile, where the two figures otherwise read as a pair of
            unexplained numbers floating under the duration select. */}
        <span className="mb-1 block px-1 font-display text-[10px] font-bold uppercase tracking-[0.16em] text-void/40 md:hidden">
          Budget
        </span>
        <div className="flex justify-between items-center text-[11px] md:text-xs font-semibold text-teal/80 mb-1.5 px-1 font-body">
          <span>{formatCurrency(minVal, currency)}</span>
          <span>{formatCurrency(maxVal, currency)}{maxVal === max ? '+' : ''}</span>
        </div>
        {/* `before:` gives the 4px track a 32px-tall grab zone without changing
            how it looks — a hairline is not something a finger can aim at. */}
        <div
          ref={sliderRef}
          onMouseDown={handleTrackPointerDown}
          onTouchStart={handleTrackPointerDown}
          className="relative w-full h-[4px] bg-void/10 rounded-full cursor-pointer touch-none before:absolute before:-inset-y-[14px] before:inset-x-0 before:content-['']"
        >
          <div 
            className="absolute top-0 bottom-0 bg-teal rounded-full" 
            style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }} 
          />
          <button
            role="slider"
            aria-valuemin={min}
            aria-valuemax={maxVal - step}
            aria-valuenow={minVal}
            aria-label="Minimum price"
            onMouseDown={(e) => { e.stopPropagation(); setIsMinThumbDragging(true); }}
            onTouchStart={(e) => { e.stopPropagation(); setIsMinThumbDragging(true); }}
            onKeyDown={(e) => handleKeyDown(e, "min")}
            // `after:` expands the hit area to 44×44 without growing the dot —
            // a 16px target is roughly a third of what a fingertip needs.
            // `touch-action: none` stops the browser claiming the drag as a
            // page scroll the moment the finger moves.
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-md border-[1.5px] border-teal outline-none hover:scale-110 transition-transform cursor-grab active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-cyan z-10 touch-none after:absolute after:-inset-[14px] after:content-['']"
            style={{ left: `${minPercent}%` }}
          />
          <button
            role="slider"
            aria-valuemin={minVal + step}
            aria-valuemax={max}
            aria-valuenow={maxVal}
            aria-label="Maximum price"
            onMouseDown={(e) => { e.stopPropagation(); setIsMaxThumbDragging(true); }}
            onTouchStart={(e) => { e.stopPropagation(); setIsMaxThumbDragging(true); }}
            onKeyDown={(e) => handleKeyDown(e, "max")}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-md border-[1.5px] border-teal outline-none hover:scale-110 transition-transform cursor-grab active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-cyan z-10 touch-none after:absolute after:-inset-[14px] after:content-['']"
            style={{ left: `${maxPercent}%` }}
          />
        </div>
      </div>
    );
  }
);
PriceRangeSlider.displayName = "PriceRangeSlider";

export interface PremiumFilterState {
  category: string;
  duration: string;
  priceRange: [number, number];
}

interface PremiumFilterProps {
  filters: PremiumFilterState;
  setFilters: (filters: PremiumFilterState) => void;
  categories: string[];
  durations: { label: string; value: string }[];
  maxPrice?: number;
  priceStep?: number;
  currency?: FilterCurrency;
}

export function PremiumFilter({ 
  filters, 
  setFilters,
  categories,
  durations,
  maxPrice = 200000,
  priceStep = 5000,
  currency = "INR",
}: PremiumFilterProps) {
  
  const handleRemoveFilter = (filterType: keyof PremiumFilterState) => {
    if (filterType === "priceRange") {
      setFilters({ ...filters, priceRange: [0, maxPrice] });
    } else {
      setFilters({ ...filters, [filterType]: filterType === 'category' ? 'All' : 'Any' });
    }
  };

  const activeFilters = [
    filters.category !== 'All' && {
      label: "Category",
      value: filters.category,
      key: "category" as keyof PremiumFilterState,
    },
    filters.duration !== 'Any' && {
      label: "Duration",
      value: durations.find((o) => o.value === filters.duration)?.label || filters.duration,
      key: "duration" as keyof PremiumFilterState,
    },
    (filters.priceRange[0] !== 0 || filters.priceRange[1] !== maxPrice) && {
      label: "Price",
      value: `${formatCurrency(filters.priceRange[0], currency)} - ${formatCurrency(filters.priceRange[1], currency)}`,
      key: "priceRange" as keyof PremiumFilterState,
    },
  ].filter(Boolean) as { label: string; value: string; key: keyof PremiumFilterState; }[];

  return (
    <div className="w-full relative z-30 flex flex-col items-center">
      {/* Pill Container */}
      <div className="bg-white/95 backdrop-blur-xl shadow-card-teal rounded-3xl md:rounded-full p-2 w-full max-w-[900px] mx-auto border border-white/80 flex flex-col md:flex-row items-center gap-2 md:gap-4 transition-all hover:bg-white border-subtle mt-[-40px] md:mt-[-36px]">
        
        {/* Category Select */}
        <div className="relative flex-1 w-full bg-void/[0.02] hover:bg-void/[0.04] rounded-2xl md:rounded-full transition-colors group">
          <MapPin className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-teal/40 group-hover:text-teal transition-colors pointer-events-none" />
          <select 
             className="w-full h-12 md:h-14 bg-transparent appearance-none pl-12 md:pl-14 pr-10 text-[14px] font-medium text-void outline-none cursor-pointer font-body"
             value={filters.category}
             onChange={e => setFilters({...filters, category: e.target.value})}
          >
            <option value="All">All Categories</option>
            {categories.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <ChevronDown className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-void/30 group-hover:text-teal/70 transition-colors pointer-events-none" />
        </div>

        <div className="hidden md:block w-px h-8 bg-gradient-to-b from-transparent via-void/10 to-transparent" />

        {/* Duration Select */}
        <div className="relative flex-1 w-full bg-void/[0.02] hover:bg-void/[0.04] rounded-2xl md:rounded-full transition-colors group">
          <Calendar className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-teal/40 group-hover:text-teal transition-colors pointer-events-none" />
          <select 
             className="w-full h-12 md:h-14 bg-transparent appearance-none pl-12 md:pl-14 pr-10 text-[14px] font-medium text-void outline-none cursor-pointer font-body"
             value={filters.duration}
             onChange={e => setFilters({...filters, duration: e.target.value})}
          >
            {durations.map(dur => <option key={dur.value} value={dur.value}>{dur.label}</option>)}
          </select>
          <ChevronDown className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-void/30 group-hover:text-teal/70 transition-colors pointer-events-none" />
        </div>

        <div className="hidden md:block w-px h-8 bg-gradient-to-b from-transparent via-void/10 to-transparent" />

        {/* Price Range Slider */}
        {/* Auto height on mobile: the stacked "Budget" label pushed the content
            past a fixed 48px box and clipped the track. */}
        <div className="relative flex-[1.2] w-full px-4 md:px-6 py-3 md:py-0 md:h-14 flex items-center justify-center group bg-void/[0.01] md:bg-transparent rounded-2xl md:rounded-none">
          <PriceRangeSlider 
            min={0}
            max={maxPrice}
            step={priceStep}
            currency={currency}
            defaultValue={filters.priceRange}
            onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
          />
        </div>
      </div>
      
      {/* Active Filters Badges */}
      <div className={cn("flex flex-wrap items-center justify-center gap-2 max-w-[900px] mx-auto px-4 transition-all duration-300", activeFilters.length > 0 ? "mt-4 opacity-100 h-auto" : "mt-0 opacity-0 h-0 overflow-hidden")}>
        {activeFilters.map(filter => (
          <FilterBadge
            key={filter.key}
            label={filter.label}
            value={filter.value}
            onRemove={() => handleRemoveFilter(filter.key)}
          />
        ))}
        {activeFilters.length > 0 && (
          <button
            onClick={() => setFilters({ category: 'All', duration: 'Any', priceRange: [0, maxPrice] })}
            className="text-[12px] font-medium text-void/45 hover:text-teal ml-2 transition-colors underline-offset-4 hover:underline font-body"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
