import React, { useState } from "react";
import CategoryCard from "../components/CategoryCard";

const FEATURED_CATEGORIES = [
  {
    name: "Dress",
    itemsCount: "24 Items",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Denim",
    itemsCount: "14 Items",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Night Suit",
    itemsCount: "12 Items",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Ethnic Wear",
    itemsCount: "18 Items",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Co-ords",
    itemsCount: "10 Items",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Lounge Suit",
    itemsCount: "16 Items",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "T-Shirt",
    itemsCount: "15 Items",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Top & Blouse",
    itemsCount: "20 Items",
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Bottom Wear",
    itemsCount: "22 Items",
    image: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Suit",
    itemsCount: "8 Items",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80"
  }
];

export default function Categories({ navigate }) {
  const [visibleCount, setVisibleCount] = useState(8);

  return (
    <section className="max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-16 pt-4 pb-4 md:pt-6 md:pb-6 border-t border-neutral-100">
      <div className="text-center mb-6 md:mb-8">
        <span className="text-[10px] font-bold tracking-[0.2em] text-[#FF4D6D] uppercase font-display">
          Curated Departments
        </span>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111111] mt-1 font-display">
          Shop by Category
        </h2>
      </div>

      {/* Categories Grid (2 Columns on mobile, 3 on tablet, 4 on desktop) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {FEATURED_CATEGORIES.slice(0, visibleCount).map((cat) => (
          <CategoryCard key={cat.name} category={cat} navigate={navigate} />
        ))}
      </div>

      {/* Load More Button */}
      {visibleCount < FEATURED_CATEGORIES.length && (
        <div className="text-center mt-4 md:mt-6">
          <button
            onClick={() => setVisibleCount((prev) => Math.min(prev + 4, FEATURED_CATEGORIES.length))}
            className="px-8 py-3.5 border border-[#111111] hover:bg-[#111111] hover:text-white text-[#111111] text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer focus:outline-none"
          >
            Load More Categories
          </button>
        </div>
      )}
    </section>
  );
}
