import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: "var(--roboto-text)",
        rubick: "var(--rubick-text)",
      },
      margin: { tomato: "120px" },
      borderRaidus: { "sexy-name": "11.11px" },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
