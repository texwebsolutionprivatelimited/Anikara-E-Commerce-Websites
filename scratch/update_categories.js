import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from "fs";
import path from "path";

// Load .env file
const envPath = path.resolve(process.cwd(), ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
const config = {};

envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || "";
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
    }
    config[key] = value;
  }
});

const firebaseConfig = {
  apiKey: config.VITE_FIREBASE_API_KEY,
  authDomain: config.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: config.VITE_FIREBASE_PROJECT_ID,
  storageBucket: config.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: config.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: config.VITE_FIREBASE_APP_ID,
  measurementId: config.VITE_FIREBASE_MEASUREMENT_ID
};

console.log("Connecting to Firebase project to update category assets:", firebaseConfig.projectId);

const CATEGORY_UPDATES = {
  "accessories": {
    name: "Accessories",
    image: "https://ik.imagekit.io/feu3swboqb/categories/accessories_banner.webp"
  },
  "bags": {
    name: "Bags",
    image: "https://ik.imagekit.io/feu3swboqb/categories/bags.webp"
  },
  "bottom-wear": {
    name: "Bottom Wear",
    image: "https://ik.imagekit.io/feu3swboqb/categories/bottom_wear.webp"
  },
  "co-ords": {
    name: "Co-ords",
    image: "https://ik.imagekit.io/feu3swboqb/categories/coords.webp"
  },
  "cosmetics": {
    name: "Cosmetics",
    image: "https://ik.imagekit.io/feu3swboqb/categories/cosmetics_banner.webp"
  },
  "denim": {
    name: "Denim",
    image: "https://ik.imagekit.io/feu3swboqb/categories/denim.webp"
  },
  "dress": {
    name: "Dress",
    image: "https://ik.imagekit.io/feu3swboqb/categories/dress.webp"
  },
  "footwear": {
    name: "Footwear",
    image: "https://ik.imagekit.io/feu3swboqb/categories/footwear.webp"
  },
  "lingerie": {
    name: "Lingerie",
    image: "https://ik.imagekit.io/feu3swboqb/categories/lingerie.webp"
  },
  "night-suit": {
    name: "Night Suit",
    image: "https://ik.imagekit.io/feu3swboqb/categories/night_suit.webp"
  },
  "sports-wear": {
    name: "Sports Wear",
    image: "https://ik.imagekit.io/feu3swboqb/categories/sports_wear.webp"
  },
  "suit": {
    name: "Suit",
    image: "https://ik.imagekit.io/feu3swboqb/categories/suit.webp"
  },
  "t-shirt": {
    name: "T-Shirt",
    image: "https://ik.imagekit.io/feu3swboqb/categories/t_shirt.webp"
  },
  "top-blouse": {
    name: "Top & Blouse",
    image: "https://ik.imagekit.io/feu3swboqb/categories/top_and_blouse.webp"
  }
};

try {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  console.log("Updating category image URLs in Firestore...");
  
  for (const [id, updateData] of Object.entries(CATEGORY_UPDATES)) {
    const docRef = doc(db, "categories", id);
    await setDoc(docRef, {
      name: updateData.name,
      image: updateData.image,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    console.log(`Successfully updated category [${id}] image -> ${updateData.image}`);
  }

  console.log("All categories successfully updated with premium ImageKit WebP assets!");
  process.exit(0);
} catch (error) {
  console.error("Error migrating category assets:", error);
  process.exit(1);
}
