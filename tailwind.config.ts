import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        coastal: {
          blue: "#0170BF",
          sky: "#A1D9FF",
        },
      },
    },
  },
  plugins: [],
};

export default config;
