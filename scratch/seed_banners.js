import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
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
    // Remove wrapping quotes
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

console.log("Connecting to Firebase project:", firebaseConfig.projectId);

const defaultSlides = [
  {
    id: 1,
    subtitle: "ANIKARA",
    title: "EVERY LOOK. EVERY OCCASION.",
    desc: "Effortless fashion for work, weekends, and everything in between.",
    image: "/banners/every-look-every-occasion.png",
    navigatePage: "products",
    navigateParams: {},
    active: true,
    isFullWidth: true
  },
  {
    id: 2,
    subtitle: "ANIKARA",
    title: "MOVE IN STYLE. LIVE IN COMFORT.",
    desc: "From casual denim to active essentials and everyday bottoms.",
    image: "/banners/move-in-style-live-in-comfort.png",
    navigatePage: "products",
    navigateParams: {},
    active: true,
    isFullWidth: true
  },
  {
    id: 3,
    subtitle: "ANIKARA",
    title: "COMFORT DESIGNED FOR YOU.",
    desc: "Relax, unwind, and feel confident every day.",
    image: "/banners/comfort-designed-for-you.jpg",
    navigatePage: "products",
    navigateParams: {},
    active: true,
    isFullWidth: true
  },
  {
    id: 4,
    subtitle: "ANIKARA",
    title: "COMPLETE YOUR SIGNATURE STYLE.",
    desc: "Sophisticated accessories and timeless outfits crafted for modern women.",
    image: "/banners/complete-your-signature-style.jpg",
    navigatePage: "products",
    navigateParams: {},
    active: true,
    isFullWidth: true
  }
];

try {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  // 1. Delete all existing slides
  const querySnapshot = await getDocs(collection(db, "slides"));
  console.log(`Found ${querySnapshot.size} existing slides. Deleting them...`);
  for (const docSnap of querySnapshot.docs) {
    await deleteDoc(doc(db, "slides", docSnap.id));
  }
  
  // 2. Insert new slides
  console.log("Seeding new slides...");
  for (const slide of defaultSlides) {
    await setDoc(doc(db, "slides", slide.id.toString()), slide);
    console.log(`Seeded slide ${slide.id}: "${slide.title}"`);
  }
  
  console.log("Database seeded successfully!");
  process.exit(0);
} catch (error) {
  console.error("Error seeding Firestore:", error);
  process.exit(1);
}
