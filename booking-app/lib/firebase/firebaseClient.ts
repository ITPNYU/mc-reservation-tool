// firebaseClient.ts
import { getApp, getApps, initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  hd: "nyu.edu",
});
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    if (!user.email?.endsWith("@nyu.edu")) {
      await auth.signOut();
      throw new Error("Only nyu.edu email addresses are allowed.");
    }
    return user;
  } catch (error) {
    console.error("Google sign-in error", error);
    throw error;
  }
};
