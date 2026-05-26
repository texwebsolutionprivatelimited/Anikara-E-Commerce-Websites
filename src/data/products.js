const mockProducts = [
  // NIGHT SUIT
  {
    id: "ns1",
    category: "Night Suit",
    badge: "Best Seller",
    name: "Luxe Silk Satin Pajama Set",
    price: 2499,
    oldPrice: 3299,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80",
    altImage: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    ratingCount: 142,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Emerald Green", hex: "#0F5132" },
      { name: "Champagne Blush", hex: "#E8C5C8" },
      { name: "Midnight Navy", hex: "#1D2A44" }
    ],
    description: "Indulge in nightly luxury with our signature silk satin pajama set. Crafted from premium, breathable silk-alternative fabric, it delivers a liquid-like drape, smooth feel against the skin, and a classic piping detail. Features a notch-collar button-down shirt and elasticized comfortable trousers.",
    details: [
      "95% Polyester Satin, 5% Spandex",
      "Contrast piping details",
      "Elastic waistband with drawstring adjustment",
      "Front chest pocket"
    ],
    reviews: [
      { user: "Sneha M.", rating: 5, date: "2026-05-10", comment: "Absolutely luxurious! Feels exactly like pure silk but is way easier to wash." },
      { user: "Pooja K.", rating: 4, date: "2026-04-28", comment: "So comfortable and soft. The champagne blush color is gorgeous." }
    ]
  },
  {
    id: "ns2",
    category: "Night Suit",
    badge: "New",
    name: "Organic Cotton Sleep Shirt",
    price: 1899,
    oldPrice: 2199,
    image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=600&q=80",
    altImage: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80",
    rating: 4.5,
    ratingCount: 38,
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Ivory Cream", hex: "#FDFBF7" },
      { name: "Pastel Lilac", hex: "#D6C7E2" }
    ],
    description: "An ultra-soft, breathable sleep shirt made from 100% organic long-staple cotton. Featuring an oversized fit, curved hemline, and dropped shoulders, it’s the perfect combination of effortless loungewear and comfortable sleep apparel.",
    details: [
      "100% Organic Certified Cotton",
      "Oversized button-down silhouette",
      "Mid-thigh length with curved hem",
      "Hypoallergenic and breathable fabric"
    ],
    reviews: [
      { user: "Ria S.", rating: 5, date: "2026-05-18", comment: "Extremely breathable, perfect for summer nights. Love the loose fit!" }
    ]
  },

  // LOUNGE SUIT
  {
    id: "ls1",
    category: "Lounge Suit",
    badge: "Trending",
    name: "Premium Ribbed Knit Lounge Set",
    price: 3799,
    oldPrice: 4999,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80",
    altImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    ratingCount: 88,
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Oatmeal Heather", hex: "#EAE6DF" },
      { name: "Charcoal Melange", hex: "#4A4A4A" }
    ],
    description: "Elevate your off-duty styling. This rib-knit set features a cozy relaxed-fit mock neck sweater and matching wide-leg pants. Constructed from a premium viscose-nylon blend knit, it feels substantial, cozy, and holds its shape beautifully.",
    details: [
      "50% Viscose, 30% Polyester, 20% Nylon",
      "Medium weight premium stretch rib-knit",
      "Sweater with relaxed drop shoulders",
      "Wide-leg trousers with thick comfortable elastic waistband"
    ],
    reviews: [
      { user: "Anjali D.", rating: 5, date: "2026-05-15", comment: "The material is heavy and premium. Looks very chic for airport looks too!" }
    ]
  },
  {
    id: "ls2",
    category: "Lounge Suit",
    badge: "",
    name: "Cozy Fleece Cropped Jogger Set",
    price: 2999,
    oldPrice: 3499,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
    altImage: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80",
    rating: 4.6,
    ratingCount: 54,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Sage Green", hex: "#A3B19B" },
      { name: "Warm Taupe", hex: "#B3A595" }
    ],
    description: "Relax in style. Made with ultra-soft brushed cotton-fleece, this lounge set combines a contemporary cropped crewneck sweatshirt with matching high-waisted slim joggers. Perfect for cozy days at home or quick errands.",
    details: [
      "80% Cotton, 20% Polyester Fleece",
      "Brushed interior for maximum softness",
      "High-rise joggers with side pockets",
      "Cropped crewneck with ribbed cuffs"
    ],
    reviews: [
      { user: "Karan J.", rating: 4, date: "2026-05-02", comment: "Super soft interior. The fit is really flattering." }
    ]
  },

  // DRESS
  {
    id: "dr1",
    category: "Dress",
    badge: "50% OFF",
    name: "Ribbed Knit Halter Maxi Dress",
    price: 3999,
    oldPrice: 7999,
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80",
    altImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    ratingCount: 110,
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Onyx Black", hex: "#111111" },
      { name: "Chalk White", hex: "#F3F3F3" }
    ],
    description: "A stunning, minimalist column dress featuring a high halter neckline and elegant deep side slit. Hugs the silhouette in all the right places with a premium ribbed knit material that provides contouring compression and breathability.",
    details: [
      "Ribbed viscose blend with high elasticity",
      "Halter neck tie closure",
      "Mid-thigh side slit on left leg",
      "Double lined upper bodice"
    ],
    reviews: [
      { user: "Alisha G.", rating: 5, date: "2026-05-22", comment: "Pure class. The black fits beautifully and doesn't stretch out. Got so many compliments!" }
    ]
  },
  {
    id: "dr2",
    category: "Dress",
    badge: "Hot",
    name: "Floral Chiffon Tiered Dress",
    price: 4599,
    oldPrice: 5299,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80",
    altImage: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80",
    rating: 4.4,
    ratingCount: 46,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Sage Floral", hex: "#CCD5AE" },
      { name: "Blush Floral", hex: "#FAEDCD" }
    ],
    description: "Flowy, romantic, and dreamy. Made from lightweight chiffon fabric, this wrap-style midi dress boasts delicate tiered ruffles, a plunging V-neckline, and an adjustable waist belt. Fully lined body with sheer long statement sleeves.",
    details: [
      "100% Polyester Georgette Chiffon",
      "Full internal lining",
      "Mock wrap silhouette with elastic waist and tie",
      "Tiered flowy skirt bottom"
    ],
    reviews: [
      { user: "Nisha V.", rating: 4, date: "2026-04-12", comment: "Beautiful print and very feminine. The sleeves are gorgeous." }
    ]
  },

  // T-SHIRT
  {
    id: "ts1",
    category: "T-Shirt",
    badge: "Best Value",
    name: "Oversized Heavyweight Cotton Tee",
    price: 1299,
    oldPrice: 1999,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
    altImage: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    ratingCount: 205,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Vintage White", hex: "#F4F3EF" },
      { name: "Acid Black", hex: "#2E2D2F" },
      { name: "Olive Drab", hex: "#5C604D" }
    ],
    description: "Crafted from 240 GSM premium cotton, this oversized t-shirt has a structured drape, dropped shoulders, and a thick ribbed mock-neck collar. The quintessential streetwear staple designed to resist shrinking and maintain its boxy fit.",
    details: [
      "100% Carded Organic Cotton",
      "Heavyweight 240 GSM fabric structure",
      "Thick rib collar band",
      "Unisex boxy streetwear cut"
    ],
    reviews: [
      { user: "Kabir R.", rating: 5, date: "2026-05-24", comment: "Best t-shirt I own. The collar is thick and structured, doesn't loose shape after washing." }
    ]
  },

  // TOP & BLOUSE
  {
    id: "tb1",
    category: "Top & Blouse",
    badge: "",
    name: "Classic Silk Halter Blouse",
    price: 2899,
    oldPrice: 3499,
    image: "https://images.unsplash.com/photo-1548624149-f7b31668831a?auto=format&fit=crop&w=600&q=80",
    altImage: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80",
    rating: 4.6,
    ratingCount: 72,
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Champagne Gold", hex: "#DFD1B6" },
      { name: "Crimson Red", hex: "#9E1C23" }
    ],
    description: "An elegant halter neck blouse in silk satin. Featuring a pleated neckline and a delicate trailing tie closure at the back, this top adds effortless sophistication to tailored pants or denim.",
    details: [
      "Satin weave with glossy finish",
      "Halter neck tie closure",
      "Relaxed hemline designed to be tucked in",
      "Dry clean recommended"
    ],
    reviews: [
      { user: "Meera A.", rating: 5, date: "2026-05-09", comment: "Stunning top. Feels premium and looks gorgeous with a high waist skirt." }
    ]
  },
  {
    id: "tb2",
    category: "Top & Blouse",
    badge: "Sale",
    name: "Breezy French Linen Shirt",
    price: 2299,
    oldPrice: 2999,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80",
    altImage: "https://images.unsplash.com/photo-1548624149-f7b31668831a?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    ratingCount: 114,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Natural Flax", hex: "#D6CDBC" },
      { name: "Pure White", hex: "#FFFFFF" }
    ],
    description: "Woven from authentic French flax, this relaxed linen shirt is pre-washed for ultimate softness. Light, airy, and textured, it features a classic pointed collar, double-button cuffs, and a curved hem.",
    details: [
      "100% French Flax Linen",
      "Pre-washed for soft, crinkly texture",
      "Mother of pearl look button details",
      "Regular fit, long sleeve button down"
    ],
    reviews: [
      { user: "Aditi S.", rating: 5, date: "2026-05-20", comment: "Perfect summer shirt. Extremely light and matches everything." }
    ]
  },

  // BOTTOM WEAR
  {
    id: "bw1",
    category: "Bottom Wear",
    badge: "Hot Buy",
    name: "Tailored High-Waist Pleated Pants",
    price: 3299,
    oldPrice: 4299,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80",
    altImage: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    ratingCount: 153,
    sizes: ["26", "28", "30", "32"],
    colors: [
      { name: "Classic Beige", hex: "#E3D5C0" },
      { name: "Onyx Black", hex: "#111111" }
    ],
    description: "The ultimate work-to-weekend trousers. Features a flattering high rise, deep front double pleats, belt loops, and an ultra-chic wide leg drape. Tailored with a premium stretch-blend twill fabric that holds its crease.",
    details: [
      "Polyester, Rayon, Spandex blend twill",
      "Double pleated front detail",
      "Zip fly with hidden bar hook closure",
      "Functional slant pockets and rear welt pockets"
    ],
    reviews: [
      { user: "Divya N.", rating: 5, date: "2026-05-14", comment: "Perfect fit! Makes my legs look miles long. The material is thick and expensive." }
    ]
  },

  // LINGERIE
  {
    id: "ln1",
    category: "Lingerie",
    badge: "Trending",
    name: "Scallop Lace Bralette & Panty Set",
    price: 1799,
    oldPrice: 2499,
    image: "https://images.unsplash.com/photo-1569591159212-b02ea8a9f239?auto=format&fit=crop&w=600&q=80",
    altImage: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    ratingCount: 65,
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Midnight Black", hex: "#1C1C1C" },
      { name: "Burgundy Red", hex: "#6E1A24" }
    ],
    description: "Designed with delicate, ultra-soft French scallop lace, this set includes a soft-cup triangle bralette with adjustable elastic straps and a matching low-rise lace bikini panty. Unpadded and wire-free for natural comfort.",
    details: [
      "Nylon, Polyamide, and Elastane lace",
      "Unlined, unpadded wireless mesh cups",
      "Hook-and-eye back closure",
      "Comfort elastic underband"
    ],
    reviews: [
      { user: "Sonia G.", rating: 5, date: "2026-04-20", comment: "Very comfortable, non-itchy lace. Fits beautifully." }
    ]
  },

  // CO-ORDS
  {
    id: "co1",
    category: "Co-ords",
    badge: "Summer Edit",
    name: "Linen Crop Top & Shorts Co-ord",
    price: 3199,
    oldPrice: 3999,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80",
    altImage: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    ratingCount: 92,
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Terracotta Clay", hex: "#C87A53" },
      { name: "Sage Green", hex: "#A8B49E" }
    ],
    description: "The effortless summer uniform. A two-piece coordinating set featuring a crop top with adjustable tie straps and high-waisted shorts with side pockets and paperbag elasticized detailing.",
    details: [
      "100% Linen",
      "Square neck crop top with back elastic smocking",
      "High-rise shorts with 3-inch inseam",
      "Breathable and sweat-wicking flax fabric"
    ],
    reviews: [
      { user: "Ritu P.", rating: 5, date: "2026-05-19", comment: "Absolutely love the color! Extremely cute and comfortable for beach trips." }
    ]
  },

  // SUIT
  {
    id: "su1",
    category: "Suit",
    badge: "Luxury",
    name: "Double-Breasted Blazer Suit Set",
    price: 7999,
    oldPrice: 9999,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80",
    altImage: "https://images.unsplash.com/photo-1548624149-f7b31668831a?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    ratingCount: 42,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Desert Taupe", hex: "#B8AC9A" },
      { name: "Classic Jet Black", hex: "#111111" }
    ],
    description: "Command the room. Crafted from heavy structured crepe, this matching blazer and trouser suit set features an oversized double-breasted jacket with sharp peak lapels and corresponding pleated straight-leg trousers.",
    details: [
      "Polyester satin-back crepe fabric",
      "Fully lined blazer jacket with functional flap pockets",
      "Trousers with zip-fly closure and front pleats",
      "Padded structured shoulders for tailored aesthetic"
    ],
    reviews: [
      { user: "Tanya B.", rating: 5, date: "2026-05-08", comment: "The quality is absolutely phenomenal. Feels custom made. Highly recommend!" }
    ]
  },

  // DENIM
  {
    id: "dn1",
    category: "Denim",
    badge: "Classic",
    name: "High-Rise Straight Leg Jeans",
    price: 3499,
    oldPrice: 4499,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80",
    altImage: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    ratingCount: 178,
    sizes: ["26", "28", "30", "32"],
    colors: [
      { name: "Vintage Light Indigo", hex: "#A8C3D8" },
      { name: "Mid-Wash Blue", hex: "#6384B4" }
    ],
    description: "The dream fit jeans. Modeled after vintage finds, these jeans have a sky-high waist and straight, structured legs. Fabricated with 100% organic cotton rigid denim that softens to your body with every single wear.",
    details: [
      "100% Organic Cotton Rigid Denim",
      "High-rise waist fits snugly through hips",
      "Five-pocket layout and classic button fly",
      "Copper rivet hardware accents"
    ],
    reviews: [
      { user: "Rohan D.", rating: 5, date: "2026-05-21", comment: "Finally, actual 100% cotton denim. The fit is perfect through the waist." }
    ]
  },

  // ETHNIC WEAR
  {
    id: "ew1",
    category: "Ethnic Wear",
    badge: "Festive Edit",
    name: "Chanderi Silk Printed Kurta Set",
    price: 5499,
    oldPrice: 6999,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
    altImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    ratingCount: 112,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Mustard Gold", hex: "#E4B04A" },
      { name: "Crimson Red", hex: "#B82436" }
    ],
    description: "Glow in timeless elegance. This beautiful Chanderi silk kurta set is adorned with intricate hand-blocked prints and delicate sequin hand embroidery along the neckline. Accompanied by coordinating straight trousers and a sheer organza dupatta.",
    details: [
      "Kurta & Trousers: Chanderi Silk Blend; Dupatta: Organza",
      "Gold zari block printing throughout",
      "Round keyhole neckline with micro-sequins",
      "Dry clean only"
    ],
    reviews: [
      { user: "Priya S.", rating: 5, date: "2026-05-23", comment: "The dupatta is stunning! The material looks extremely rich, perfect for wedding functions." }
    ]
  },
  {
    id: "ew2",
    category: "Ethnic Wear",
    badge: "Handloom",
    name: "Pure Chanderi Silk Zari Saree",
    price: 8999,
    oldPrice: 10999,
    image: "https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=600&q=80",
    altImage: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80",
    rating: 5.0,
    ratingCount: 30,
    sizes: ["One Size"],
    colors: [
      { name: "Teal Peacock Blue", hex: "#005D6E" },
      { name: "Fuchsia Magenta", hex: "#BF2A70" }
    ],
    description: "Celebrate handcraft traditions. A masterfully handwoven saree featuring an ornate golden zari borders and classic bootas on pure Chanderi silk. Comes with a matching unstitched blouse piece to personalize the fit.",
    details: [
      "100% Pure Silk Chanderi",
      "Real golden zari threads",
      "5.5 meters length + 80cm blouse piece",
      "Sourced directly from handloom clusters"
    ],
    reviews: [
      { user: "Leela K.", rating: 5, date: "2026-05-11", comment: "Exquisite handloom piece. The teal color shines beautiful in warm lighting." }
    ]
  }
];

// Add extra products so we have at least 1-2 per category and some variety
const additionalProducts = [
  {
    id: "ns3",
    category: "Night Suit",
    badge: "",
    name: "Classic Striped Cotton Sleepset",
    price: 2199,
    oldPrice: 2599,
    image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=600&q=80",
    altImage: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=600&q=80",
    rating: 4.6,
    ratingCount: 45,
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Sky Striped Blue", hex: "#8DA2BD" }],
    description: "Classic menswear-inspired stripes. Woven with organic long-staple cotton for a cool, structured crispness that softens with time. Features piping borders and chest embroidery.",
    details: ["100% Cotton Poplin", "Navy piping borders", "Comfortable relaxed leg"],
    reviews: []
  },
  {
    id: "ls3",
    category: "Lounge Suit",
    badge: "",
    name: "Modal Knit Wide Leg Loungeset",
    price: 3499,
    oldPrice: 3999,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
    altImage: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    ratingCount: 22,
    sizes: ["S", "M", "L"],
    colors: [{ name: "Sage", hex: "#A8B6A2" }],
    description: "Indulge in cozy modal knit fabric. Features a relaxed crewneck drape and matching wide-leg drawers.",
    details: ["95% Modal, 5% Elastane", "Drawstring waist", "Dual side pockets"],
    reviews: []
  },
  {
    id: "ts2",
    category: "T-Shirt",
    badge: "Popular",
    name: "Ribbed Retro Crop Tee",
    price: 899,
    oldPrice: 1199,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80",
    altImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
    rating: 4.5,
    ratingCount: 96,
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Butter Yellow", hex: "#F3E5AB" },
      { name: "Pure White", hex: "#FFFFFF" }
    ],
    description: "Cute and tight-fitting 90s baby tee styled in rich ribbed cotton fabric. Ideal basic for denims.",
    details: ["98% Ribbed Cotton, 2% Elastane", "Cropped baby fit", "Double stitched crew neckline"],
    reviews: []
  },
  {
    id: "bw2",
    category: "Bottom Wear",
    badge: "Sale",
    name: "Linen Wide Leg Lounge Pants",
    price: 2499,
    oldPrice: 3299,
    image: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=600&q=80",
    altImage: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80",
    rating: 4.4,
    ratingCount: 39,
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Flax Beige", hex: "#D8CBB6" }],
    description: "Easy pull-on pants with comfortable drawstring elasticized waist. Handcrafted from authentic washed organic linen.",
    details: ["100% Linen", "Elastic waistband with cotton ties", "Relaxed fit trousers"],
    reviews: []
  },
  {
    id: "ln2",
    category: "Lingerie",
    badge: "Silk Premium",
    name: "Satin Silk Cami Slip Chemise",
    price: 2199,
    oldPrice: 2899,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80",
    altImage: "https://images.unsplash.com/photo-1569591159212-b02ea8a9f239?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    ratingCount: 41,
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Champagne Pearl", hex: "#F3EAD8" }],
    description: "Slip into relaxation. Liquid satin chemise with delicate eyelash lace detailing along the scoop neck.",
    details: ["97% Silk-Poly Satin, 3% Lycra", "Adjustable crisscross back straps", "Lace neck border"],
    reviews: []
  },
  {
    id: "co2",
    category: "Co-ords",
    badge: "Premium Print",
    name: "Boho Printed Wrap Co-ord Set",
    price: 3899,
    oldPrice: 4799,
    image: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=600&q=80",
    altImage: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80",
    rating: 4.6,
    ratingCount: 57,
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Sunset Indigo", hex: "#2C394B" }],
    description: "Striking bohemian printed set featuring a tie wrap front top and corresponding fluid high-waisted palazzo bottoms.",
    details: ["100% Rayon Crêpe", "Adjustable wrap side knot", "Palazzo wide-leg pants with elastic back"],
    reviews: []
  },
  {
    id: "su2",
    category: "Suit",
    badge: "",
    name: "Linen Summer Light Blazer",
    price: 4299,
    oldPrice: 4999,
    image: "https://images.unsplash.com/photo-1548624149-f7b31668831a?auto=format&fit=crop&w=600&q=80",
    altImage: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    ratingCount: 19,
    sizes: ["S", "M", "L"],
    colors: [{ name: "Cream Flax", hex: "#EFECE6" }],
    description: "An unlined, lightweight summer blazer perfect for layering. Tailored in high-grade airy linen-cotton blend.",
    details: ["55% Linen, 45% Cotton", "Unlined breathable layout", "Patch pockets at waist"],
    reviews: []
  },
  {
    id: "dn2",
    category: "Denim",
    badge: "",
    name: "Oversized Vintage Wash Denim Jacket",
    price: 3999,
    oldPrice: 5499,
    image: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=600&q=80",
    altImage: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    ratingCount: 120,
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Washed Black", hex: "#3A3B3C" }],
    description: "Classic drop-shoulder jacket featuring heavy stone wash treatments for an authentic, lived-in vintage feel.",
    details: ["100% Rugged Denim Cotton", "Brushed metal buttons", "Four pocket setup"],
    reviews: []
  }
];

export const products = [...mockProducts, ...additionalProducts];
