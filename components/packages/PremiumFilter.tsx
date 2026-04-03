"use client";

import * as React from "react";
import { useState, useMemo, useCallback, useEffect, useRef, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown, MapPin, Calendar, DollarSign, X } from "lucide-react";
import { cn } from "@/lib/utils";

// FilterBadge Component
const filterBadgeVariants = cva(
  "inline-flex items-center bg-background text-xs text-muted-foreground border",
  {
    variants: {
      variant: {
        default: "rounded-md gap-x-2.5 py-1 pl-2.5 pr-1",
        pill: "rounded-full gap-x-2.5 py-1 pl-2.5 pr-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface FilterBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof filterBadgeVariants> {
  label?: string;
  value?: string;
  children?: React.ReactNode;
  onRemove?: () => void;
}

function FilterBadge({
  className,
  variant,
  label,
  value,
  onRemove,
  ...props
}: FilterBadgeProps) {
  return (
    <span className={cn(filterBadgeVariants({ variant }), className)} {...props}>
      {label}
      <span className="h-4 w-px bg-border" />
      <span className="font-medium text-foreground">{value}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className={cn(
            "-ml-1.5 flex size-5 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground",
            variant === "pill" ? "rounded-full" : "rounded"
          )}
          aria-label="Remove"
        >
          <X className="size-3 shrink-0" aria-hidden={true} />
        </button>
      )}
    </span>
  );
}

// Select Component
const sizes = [
  {
    xsmall: "h-6 text-xs pl-1.5 pr-[22px]",
    small: "h-8 text-sm pl-3 pr-9",
    medium: "h-10 text-sm pl-3 pr-9",
    large: "h-12 text-base pl-3 pr-9 rounded-lg",
  },
  {
    xsmall: "h-6 text-xs px-[22px]",
    small: "h-8 text-sm px-9",
    medium: "h-10 text-sm px-9",
    large: "h-12 text-base px-9 rounded-lg",
  },
];

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options?: Option[];
  label?: string;
  value?: string;
  placeholder?: string;
  size?: keyof typeof sizes[0];
  prefix?: React.ReactNode;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

function Select({
  options,
  label,
  value,
  placeholder,
  size = "medium",
  prefix,
  disabled = false,
  onChange,
}: SelectProps) {
  return (
    <div>
      {label && (
        <label
          htmlFor="select"
          className="cursor-text block font-sans text-[13px] text-muted-foreground capitalize mb-2"
        >
          {label}
        </label>
      )}
      <div
        className={cn(
          "relative flex items-center",
          disabled
            ? "text-muted-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <select
          id="select"
          disabled={disabled}
          value={value}
          onChange={onChange}
          className={cn(
            "font-sans appearance-none w-full border rounded-[5px] duration-200 outline-none",
            sizes[prefix ? 1 : 0][size],
            disabled
              ? "cursor-not-allowed bg-muted text-muted-foreground"
              : "text-foreground bg-background cursor-pointer",
            "border-border focus:ring-[3px] focus:ring-ring focus:border-ring"
          )}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options &&
            options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>
        {prefix && (
          <span
            className={cn(
              "inline-flex absolute pointer-events-none duration-150",
              size === "xsmall" ? "left-[5px] w-3 h-3" : "left-3 w-4 h-4 [&>svg]:w-4 [&>svg]:h-4"
            )}
          >
            {prefix}
          </span>
        )}
        <span
          className={cn(
            "inline-flex absolute pointer-events-none duration-150",
            size === "xsmall" ? "right-[5px] w-3 h-3" : "right-3 w-4 h-4"
          )}
        >
          <ChevronDown className="w-full h-full" />
        </span>
      </div>
    </div>
  );
}

// Range Slider Component
const valueToPercent = (value: number, min: number, max: number) => {
  return ((value - min) / (max - min)) * 100;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

interface PriceRangeSliderProps {
  className?: string;
  data: number[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
}

const PriceRangeSlider = forwardRef<HTMLDivElement, PriceRangeSliderProps>(
  (
    {
      className,
      data,
      min = 0,
      max = 500000,
      step = 5000,
      defaultValue = [0, 500000],
      onValueChange,
      ...props
    },
    ref
  ) => {
    const [localValues, setLocalValues] = useState<[number, number]>(defaultValue);
    const [isMinThumbDragging, setIsMinThumbDragging] = useState(false);
    const [isMaxThumbDragging, setIsMaxThumbDragging] = useState(false);

    const sliderRef = useRef<HTMLDivElement>(null);
    const minThumbRef = useRef<HTMLButtonElement>(null);
    const maxThumbRef = useRef<HTMLButtonElement>(null);

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

    // Sync with default values when they change from outside
    useEffect(() => {
      setLocalValues(defaultValue);
    }, [defaultValue]);

    useEffect(() => {
      const handleMouseMove = (event: MouseEvent | TouchEvent) => {
        if (!sliderRef.current) return;

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

      const handleMouseUp = () => {
        setIsMinThumbDragging(false);
        setIsMaxThumbDragging(false);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("touchmove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchend", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("touchmove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchend", handleMouseUp);
      };
    }, [isMinThumbDragging, isMaxThumbDragging, min, max, step, minVal, maxVal, handleValueChange]);

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
      <div className={cn("w-full", className)} {...props} ref={ref}>
        <div className="relative w-full h-20" ref={sliderRef}>
          <div className="absolute inset-0 flex items-end gap-px">
            {data.map((value, index) => {
              const barPercent = (index / (data.length - 1)) * 100;
              const isInRange = barPercent >= minPercent && barPercent <= maxPercent;
              return (
                <div
                  key={index}
                  className={cn(
                    "w-full rounded-t-sm transition-colors duration-300",
                    isInRange ? "bg-primary" : "bg-muted"
                  )}
                  style={{ height: `${value * 100}%` }}
                />
              );
            })}
          </div>

          <div className="relative h-full">
            <button
              ref={minThumbRef}
              role="slider"
              aria-valuemin={min}
              aria-valuemax={maxVal - step}
              aria-valuenow={minVal}
              aria-label="Minimum price"
              onMouseDown={() => setIsMinThumbDragging(true)}
              onTouchStart={() => setIsMinThumbDragging(true)}
              onKeyDown={(e) => handleKeyDown(e, "min")}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-background rounded-full border-2 border-primary shadow-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              style={{ left: `${minPercent}%` }}
            />
            <button
              ref={maxThumbRef}
              role="slider"
              aria-valuemin={minVal + step}
              aria-valuemax={max}
              aria-valuenow={maxVal}
              aria-label="Maximum price"
              onMouseDown={() => setIsMaxThumbDragging(true)}
              onTouchStart={() => setIsMaxThumbDragging(true)}
              onKeyDown={(e) => handleKeyDown(e, "max")}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-background rounded-full border-2 border-primary shadow-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              style={{ left: `${maxPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 items-center gap-4 mt-4">
          <div className="bg-card p-3 rounded-lg text-center border border-border">
            <p className="text-xs text-muted-foreground">Minimum</p>
            <p className="text-lg font-semibold text-card-foreground">{formatCurrency(minVal)}</p>
          </div>
          <div className="bg-card p-3 rounded-lg text-center border border-border">
            <p className="text-xs text-muted-foreground">Maximum</p>
            <p className="text-lg font-semibold text-card-foreground">{formatCurrency(maxVal)}</p>
          </div>
        </div>
      </div>
    );
  }
);

PriceRangeSlider.displayName = "PriceRangeSlider";

// Main Component
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
}

export function PremiumFilter({ 
  filters, 
  setFilters,
  categories,
  durations,
  maxPrice = 200000 
}: PremiumFilterProps) {
  
  const categoryOptions: Option[] = categories.map(cat => ({
    value: cat,
    label: cat
  }));

  const durationOptions: Option[] = durations.map(dur => ({
    value: dur.value,
    label: dur.label
  }));

  // Generating static histogram data similar to design requirement
  const generateHistogramData = (length: number): number[] => {
    // A bell curve-like distribution for realistic appearance
    const data = Array.from({ length }, (_, i) => {
      const x = i / length;
      // standard normal curve approach
      const curve = Math.exp(-Math.pow(x - 0.4, 2) / 0.1) * 0.8 + Math.random() * 0.2;
      return curve;
    });
    return data;
  };

  const histogramData = useMemo(() => generateHistogramData(60), []);

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
      value: durationOptions.find((o) => o.value === filters.duration)?.label || "",
      key: "duration" as keyof PremiumFilterState,
    },
    (filters.priceRange[0] !== 0 || filters.priceRange[1] !== maxPrice) && {
      label: "Price",
      value: `${formatCurrency(filters.priceRange[0])} - ${formatCurrency(filters.priceRange[1])}`,
      key: "priceRange" as keyof PremiumFilterState,
    },
  ].filter(Boolean) as { label: string; value: string; key: keyof PremiumFilterState; }[];

  return (
    <div className="w-full relative -mt-[40px] md:-mt-[60px] z-30">
      <div className="bg-white/95 backdrop-blur-2xl rounded-[24px] md:rounded-[32px] shadow-[0_20px_40px_-15px_rgba(34,30,42,0.1)] border border-[rgba(255,255,255,0.5)] p-[24px] md:p-[32px] max-w-[1000px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Category"
            placeholder="Select travel category"
            options={categoryOptions}
            value={filters.category}
            prefix={<MapPin />}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          />

          <Select
            label="Duration"
            placeholder="Select trip duration"
            options={durationOptions}
            value={filters.duration}
            prefix={<Calendar />}
            onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
          />
        </div>

        <div className="pt-8">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign size={16} className="text-muted-foreground" />
            <label className="text-[13px] text-muted-foreground font-medium">Price Range</label>
          </div>
          <PriceRangeSlider
            data={histogramData}
            min={0}
            max={maxPrice}
            step={5000}
            defaultValue={filters.priceRange}
            onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
          />
        </div>
        
        {activeFilters.length > 0 && (
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground mb-3 font-display">Active Filters</h3>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter: { key: keyof PremiumFilterState; label: string; value: string }) => (
                <FilterBadge
                  key={filter.key}
                  label={filter.label}
                  value={filter.value}
                  variant="pill"
                  onRemove={() => handleRemoveFilter(filter.key)}
                />
              ))}
              
              <button
                onClick={() => setFilters({ category: 'All', duration: 'Any', priceRange: [0, maxPrice] })}
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 ml-2"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
