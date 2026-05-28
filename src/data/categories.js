export const FEATURED_CATEGORIES = [
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

export const DEFAULT_CATEGORY_NAMES = FEATURED_CATEGORIES.map((category) => category.dbCategory);

export const DEFAULT_CATEGORY_IMAGES = FEATURED_CATEGORIES.reduce((images, category) => {
  images[category.dbCategory] = category.image;
  return images;
}, {});
