"use client";

import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/firebaseClient";
import { useRouter } from "next/navigation";

const GoogleSignIn = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // nyu.edu ドメインのメールアドレスかチェック
      if (user.email?.endsWith("@nyu.edu")) {
        console.log("Google sign-in successful", user);
        router.push("/"); // サインイン後のリダイレクト先
      } else {
        // nyu.edu ドメイン以外のユーザーをサインアウトさせる
        await auth.signOut();
        setError("Only nyu.edu email addresses are allowed.");
      }
    } catch (error) {
      setError("Google sign-in failed. Please try again.");
      console.error("Google sign-in error", error);
    }
  };

  return (
    <div>
      <button onClick={handleGoogleSignIn}>
        Sign in with NYU Google Account
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default GoogleSignIn;
