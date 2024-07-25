"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, signInWithGoogle } from "@/lib/firebase/firebaseClient";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const handleAuth = async () => {
      const user = auth.currentUser;
      if (user) {
        if (user.email?.endsWith("@nyu.edu")) {
          setUser(user);
        } else {
          await auth.signOut();
          setUser(null);
          setError("Only nyu.edu email addresses are allowed.");
        }
      } else {
        try {
          const signedInUser = await signInWithGoogle();
          setUser(signedInUser);
        } catch (error) {
          if (
            error instanceof Error &&
            error.message === "Only nyu.edu email addresses are allowed."
          ) {
            setError(error.message);
          } else {
            setError("Failed to sign in. Please try again.");
          }
        }
      }
      setLoading(false);
    };

    const unsubscribe = auth.onAuthStateChanged(handleAuth);

    return () => unsubscribe();
  }, [router]);
  useEffect(() => {
    if (error === "Only nyu.edu email addresses are allowed.") {
      router.push("/forbidden");
    }
  }, [error, router]);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
