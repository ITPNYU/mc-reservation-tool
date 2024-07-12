// firebaseClient.ts
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getFirestore,
  Firestore,
  Timestamp,
  initializeFirestore,
  setLogLevel,
  connectFirestoreEmulator,
  addDoc,
  collection,
} from "firebase/firestore";
import { firebase } from "googleapis/build/src/apis/firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDdFBW-MHSbBCHg-6TLBgJUmp1hacx7Vr8",
  authDomain: "flowing-mantis-389917.firebaseapp.com",
  projectId: "flowing-mantis-389917",
  storageBucket: "flowing-mantis-389917.appspot.com",
  messagingSenderId: "289027705740",
  appId: "1:289027705740:web:31820e33df9be4d65d24a9",
  measurementId: "G-B2TH2J5RFR",
};
const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(
  app,
  {
    experimentalForceLongPolling: true,
    experimentalAutoDetectLongPolling: false,
  },
  "media-commons1"
);
