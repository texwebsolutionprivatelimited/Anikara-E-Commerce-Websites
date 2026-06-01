import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import fs from "fs";
import path from "path";
import { products } from "./old_products.js";

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

console.log("Connecting to Firebase project:", firebaseConfig.projectId);

try {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const querySnapshot = await getDocs(collection(db, "products"));
  console.log(`Found ${querySnapshot.size} existing products in Firestore. Deleting them...`);
  for (const docSnap of querySnapshot.docs) {
    await deleteDoc(doc(db, "products", docSnap.id));
  }

  console.log(`Seeding ${products.length} products into Cloud Firestore...`);
  for (const product of products) {
    const displaySection = product.displaySection || "deals";
    const seedData = {
      ...product,
      displaySection,
      stock: product.stock !== undefined ? product.stock : 50,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(doc(db, "products", product.id), seedData);
    console.log(`Seeded product ${product.id}: "${product.name}"`);
  }

  console.log("Products seeded successfully in Cloud Firestore!");
  process.exit(0);
} catch (error) {
  console.error("Error seeding products:", error);
  process.exit(1);
}
