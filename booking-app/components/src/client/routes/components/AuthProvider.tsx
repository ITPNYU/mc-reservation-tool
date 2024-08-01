"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, getRedirectResult } from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  auth,
  googleProvider,
  initiateGoogleSignIn,
} from "@/lib/firebase/firebaseClient";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signIn: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAuthResult = async () => {
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        const user = result.user;
        if (user.email?.endsWith("@nyu.edu")) {
          setUser(user);
        } else {
          await auth.signOut();
          setUser(null);
          setError("Only nyu.edu email addresses are allowed.");
          router.push("/signin");
        }
      }
    } catch (error) {
      console.error("Auth error", error);
      setError("Authentication failed. Please try again.");
      router.push("/signin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        if (user.email?.endsWith("@nyu.edu")) {
          setUser(user);
        } else {
          await auth.signOut();
          setUser(null);
          setError("Only nyu.edu email addresses are allowed.");
          router.push("/signin");
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    handleAuthResult();

    return () => unsubscribe();
  }, [router]);

  const signIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await initiateGoogleSignIn();
    } catch (error) {
      console.error("Sign-in error", error);
      setError("Failed to initiate sign-in. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};
