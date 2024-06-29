// components/ClientProvider.tsx
"use client";

import React from "react";
import { DatabaseProvider } from "@/components/src/client/routes/components/Provider";
import NavBar from "../booking/components/ NavBar";

type ClientProviderProps = {
  children: React.ReactNode;
};

const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  return (
    <DatabaseProvider>
      <NavBar />
      {children}
    </DatabaseProvider>
  );
};

export default ClientProvider;
