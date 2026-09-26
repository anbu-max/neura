import { initializeApp, getApps, App, getApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import fs from "fs";
import path from "path";

let app: App;

const serviceKeyPath = path.join(process.cwd(), "service_key.json");

if (getApps().length === 0) {
  if (fs.existsSync(serviceKeyPath)) {
    const serviceKey = JSON.parse(fs.readFileSync(serviceKeyPath, "utf8"));
    app = initializeApp({
      credential: cert(serviceKey),
    });
  } else {
    // Fallback initialize with project ID to prevent missing project ID errors
    app = initializeApp({
      projectId: "neura-ai-793fb",
      storageBucket: "neura-ai-793fb.firebasestorage.app",
    });
  }
} else {
  app = getApp();
}

const adminDb = getFirestore(app);
const adminStorage = getStorage(app);

export { app as adminApp, adminDb, adminStorage };
