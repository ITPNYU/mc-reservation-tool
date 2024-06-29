// components/Layout.tsx

import NavBar from "@/components/src/client/routes/booking/components/ NavBar";
import { DatabaseProvider } from "@/components/src/client/routes/components/Provider";
import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <DatabaseProvider>
      <NavBar />
      {children}
    </DatabaseProvider>
  );
};

export default Layout;
