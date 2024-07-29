import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    custom: {
      gray: string;
      gray2: string;
      gray3: string;
      border: string;
    };
  }
  interface PaletteOptions {
    custom?: {
      gray?: string;
      gray2?: string;
      gray3?: string;
      border?: string;
    };
  }
}
