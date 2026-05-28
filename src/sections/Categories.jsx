import React from "react";
import { motion } from "framer-motion";
import CategoryCard from "../components/CategoryCard";
import { useApp } from "../context/AppContext";

const FEATURED_CATEGORIES = [
  {
    displayName: "DRESSES",
    dbCategory: "Dress",
    image: "https://images.unsplash.com/photo-1618932260643-eee4a2f6c9d6?auto=format&fit=crop&w=600&q=80"
  },
  {
    displayName: "TOPS & BLOUSES",
    dbCategory: "Top & Blouse",
    image: "https://images.unsplash.com/photo-1564227901-6b1d20bebe9d?auto=format&fit=crop&w=600&q=80"
  },
  {
    displayName: "T-SHIRTS",
    dbCategory: "T-Shirt",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80"
  },
  {
    displayName: "DENIM",
    dbCategory: "Denim",
    image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=600&q=80"
  },
  {
    displayName: "CO-ORDS",
    dbCategory: "Co-ords",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80"
  },
  {
    displayName: "BOTTOMS",
    dbCategory: "Bottom Wear",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80"
  },
  {
    displayName: "LOUNGEWEAR",
    dbCategory: "Night Suit",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80"
  },
  {
    displayName: "LINGERIE",
    dbCategory: "Lingerie",
    image: "https://images.unsplash.com/photo-1569591159212-b02ea8a9f239?auto=format&fit=crop&w=600&q=80"
  },
  {
    displayName: "SUITS",
    dbCategory: "Suit",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80"
  },
  {
    displayName: "SPORTS WEAR",
    dbCategory: "Sports Wear",
    image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=600&q=80"
  },
  {
    displayName: "FOOTWEAR",
    dbCategory: "Footwear",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80"
  },
  {
    displayName: "BAGS",
    dbCategory: "Bags",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80"
  },
  {
    displayName: "BEAUTY",
    dbCategory: "Cosmetics",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80"
  },
  {
    displayName: "ACCESSORIES",
    dbCategory: "Accessories",
    image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=600&q=80"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

export default function Categories({ navigate }) {
  const { products } = useApp();

  // Get dynamic count of items in each category
  const categoriesWithCounts = FEATURED_CATEGORIES.map((cat) => {
    const count = products.filter(
      (p) => p.category.toLowerCase() === cat.dbCategory.toLowerCase()
    ).length;
    return {
      ...cat,
      itemsCount: `${count} ${count === 1 ? "Item" : "Items"}`
    };
  });

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#FFF5F8] via-white to-[#FFF9FA] pt-6 pb-10 border-t border-neutral-100/60">
      {/* Soft Luxury Decorative Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-rose-200/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-16 relative z-10">
        <div className="text-center mb-8 md:mb-10">
          <span className="text-[10px] font-bold tracking-[0.35em] text-[#FF4D6D] uppercase font-display block mb-1.5">
            Curated Departments
          </span>
          <h2 className="text-2xl md:text-3.5xl font-extrabold tracking-tight text-[#111111] font-display">
            Hot Categories
          </h2>
          <div className="w-12 h-[2px] bg-[#FF4D6D] mx-auto mt-3.5 rounded-full opacity-80" />
        </div>

        {/* Categories Flex Wrapper (centered, balanced, no trailing whitespace) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-x-2.5 sm:gap-x-4 gap-y-8 sm:gap-y-10 max-w-7xl mx-auto w-full px-1"
        >
          {categoriesWithCounts.map((cat) => (
            <CategoryCard key={cat.displayName} category={cat} navigate={navigate} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
