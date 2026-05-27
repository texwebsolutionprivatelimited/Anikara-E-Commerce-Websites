import React from "react";

export default function SkeletonLoader({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-6 sm:gap-y-8 w-full">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex flex-col w-full font-sans">
          {/* Image skeleton */}
          <div className="relative aspect-[4/5] w-full rounded-sm skeleton-bg animate-skeleton bg-neutral-200" />

          {/* Info skeleton */}
          <div className="pt-4 space-y-2.5">
            {/* Category */}
            <div className="h-2.5 w-16 rounded-sm skeleton-bg animate-skeleton bg-neutral-200" />
            {/* Title */}
            <div className="h-3.5 w-full rounded-sm skeleton-bg animate-skeleton bg-neutral-200" />
            {/* Rating */}
            <div className="flex items-center gap-1">
              <div className="h-3 w-8 rounded-sm skeleton-bg animate-skeleton bg-neutral-200" />
              <div className="h-3 w-6 rounded-sm skeleton-bg animate-skeleton bg-neutral-200" />
            </div>
            {/* Price */}
            <div className="h-4 w-20 rounded-sm skeleton-bg animate-skeleton bg-neutral-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
