// app/layout.tsx

import { Inter } from "next/font/google";
import "@/components/src/client/styles.css";
import ClientProvider from "@/components/src/client/routes/components/ClientProvider";
import { AuthProvider } from "@/components/src/client/routes/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Media commons booking app",
  description: "Media commons booking app",
};

type LayoutProps = {
  children: React.ReactNode;
};

const RootLayout: React.FC<LayoutProps> = ({ children }) => (
  <html lang="en">
    <head></head>
    <body className={inter.className}>
      <AuthProvider>
        <ClientProvider>{children}</ClientProvider>
      </AuthProvider>
    </body>
  </html>
);

export default RootLayout;
