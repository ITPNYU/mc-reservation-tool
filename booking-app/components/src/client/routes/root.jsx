import "../styles.css";
import { Metadata } from "next";
import CssBaseline from "@mui/material/CssBaseline";
import { DatabaseProvider } from "./components/Provider";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";

export const metadata = {
  title: "Your App Name",
  description: "Your app description",
};

export default function RootLayout({ children }) {
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
