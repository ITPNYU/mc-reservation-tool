"use client";
import React, { useState, useEffect } from "react";
import {
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/firebaseClient";
import { useRouter } from "next/navigation";
import { Box, Button, styled, CircularProgress } from "@mui/material";

const Center = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const GoogleSignIn = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        setIsLoading(true);
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          if (user.email?.endsWith("@nyu.edu")) {
            console.log("Google sign-in successful", user);
            router.push("/");
          } else {
            await auth.signOut();
            setError("Only nyu.edu email addresses are allowed.");
          }
        }
      } catch (error) {
        setError("Google sign-in failed. Please try again.");
        console.error("Google sign-in error", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkRedirectResult();
  }, [router]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      setError("Google sign-in failed. Please try again.");
      console.error("Google sign-in error", error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Center>
        <CircularProgress />
      </Center>
    );
  }

  return (
    <div>
      <Center>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGoogleSignIn}
          sx={{
            alignSelf: "center",
            marginTop: 6,
          }}
        >
          Sign in with NYU Google Account
        </Button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </Center>
    </div>
  );
};

export default GoogleSignIn;
