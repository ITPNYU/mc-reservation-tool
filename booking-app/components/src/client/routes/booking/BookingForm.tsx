"use client";
import React, { useEffect } from "react";
import { Header } from "./components/Header";

type BookingFormProps = {
  children: React.ReactNode;
};

export default function BookingForm({ children }: BookingFormProps) {
  useEffect(() => {
    console.log("DEPLOY MODE ENVIRONMENT:", process.env.CALENDAR_ENV);
  }, []);

  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
