import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getPublicFirebaseConfig } from "@/lib/env";

let cachedDb: Firestore | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApp();
  }

  return initializeApp(getPublicFirebaseConfig());
}

export function getClientFirestore(): Firestore {
  if (!cachedDb) {
    cachedDb = getFirestore(getFirebaseApp());
  }

  return cachedDb;
}
