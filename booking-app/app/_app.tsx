import "../styles.css";
import { Metadata } from "next";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { DatabaseProvider } from "@/components/src/client/routes/components/Provider";
import theme from "./theme/theme";

export const metadata: Metadata = {
  title: "Your App Name",
  description: "Your app description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("theme", theme);
  return (
    <html lang="en">
      <body>
        <DatabaseProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </DatabaseProvider>
      </body>
    </html>
  );
}
