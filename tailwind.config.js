/** @type {import('@navith/tailwindcss-plugin-author-types').CreatePlugin} */
const plugin = require("tailwindcss/plugin");
const defaultTheme = require("tailwindcss/defaultTheme");

const safeArea = plugin(({ addUtilities }) => {
  const newUtilities = {
    ".m-safe": {
      marginTop: "env(safe-area-inset-top)",
      marginRight: "env(safe-area-inset-right)",
      marginBottom: "env(safe-area-inset-bottom)",
      marginLeft: "env(safe-area-inset-left)"
    },
    ".mx-safe": {
      marginRight: "env(safe-area-inset-right)",
      marginLeft: "env(safe-area-inset-left)"
    },
    ".my-safe": {
      marginTop: "env(safe-area-inset-top)",
      marginBottom: "env(safe-area-inset-bottom)"
    },
    ".mt-safe": {
      marginTop: "env(safe-area-inset-top)"
    },
    ".mr-safe": {
      marginRight: "env(safe-area-inset-right)"
    },
    ".mb-safe": {
      marginBottom: "env(safe-area-inset-bottom)"
    },
    ".ml-safe": {
      marginLeft: "env(safe-area-inset-left)"
    },
    ".p-safe": {
      paddingTop: "env(safe-area-inset-top)",
      paddingRight: "env(safe-area-inset-right)",
      paddingBottom: "env(safe-area-inset-bottom)",
      paddingLeft: "env(safe-area-inset-left)"
    },
    ".px-safe": {
      paddingRight: "env(safe-area-inset-right)",
      paddingLeft: "env(safe-area-inset-left)"
    },
    ".py-safe": {
      paddingTop: "env(safe-area-inset-top)",
      paddingBottom: "env(safe-area-inset-bottom)"
    },
    ".pt-safe": {
      paddingTop: "env(safe-area-inset-top)"
    },
    ".pr-safe": {
      paddingRight: "env(safe-area-inset-right)"
    },
    ".pb-safe": {
      paddingBottom: "env(safe-area-inset-bottom)"
    },
    ".pl-safe": {
      paddingLeft: "env(safe-area-inset-left)"
    }
  };

  addUtilities(newUtilities, { variants: ["responsive"] });
});

/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig} */
module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  // TODO: implement darkMode
  darkMode: "media",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans]
      },
      screens: {
        mobile: { raw: "(max-width: 768px)" },
        desktop: { raw: "(min-width: 769px)" },
        short: { raw: "(max-height: 768px)" },
        tall: { raw: "(min-height: 769px)" }
      },
      colors: {
        transparent: "transparent",
        current: "currentColor"
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [
    // require("@tailwindcss/forms"),
    safeArea
  ]
};
