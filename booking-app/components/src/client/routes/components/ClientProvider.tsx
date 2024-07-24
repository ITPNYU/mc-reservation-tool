// components/ClientProvider.tsx
"use client";

import React from "react";
import { DatabaseProvider } from "@/components/src/client/routes/components/Provider";
import NavBar from "../booking/components/NavBar";
import { BookingProvider } from "../booking/bookingProvider";

type ClientProviderProps = {
  children: React.ReactNode;
};

//TODO: Only apply BookingProvider during booking flow
const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  return (
    <DatabaseProvider>
      <BookingProvider>
        <NavBar />
        {children}
      </BookingProvider>
    </DatabaseProvider>
  );
};

export default ClientProvider;
