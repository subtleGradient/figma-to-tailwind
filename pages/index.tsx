import React, { FC, ReactElement, ReactNode, useState } from "react";

const titleCase = (it: string) =>
  String(it)
    .replace(/^([a-z])/gi, (_, it) => it.toLowerCase())
    .replace(/-([a-z])/g, (_, it) => it.toUpperCase());

const uniq = (item, index, items) => items.indexOf(item) === index;

const defaultStyles = {
  "align-items": undefined,
  "backdrop-filter": undefined,
  "border-radius": undefined,
  "box-shadow": undefined,
  "box-sizing": undefined,
  "flex-direction": undefined,
  "flex-grow": undefined,
  "font-family": undefined,
  "font-size": undefined,
  "font-style": undefined,
  "font-variant": undefined,
  "font-weight": undefined,
  "justify-content": undefined,
  "letter-spacing": undefined,
  "line-height": undefined,
  "mix-blend-mode": undefined,
  "text-align": undefined,
  "text-transform": undefined,
  background: undefined,
  border: undefined,
  bottom: undefined,
  color: undefined,
  display: undefined,
  flex: undefined,
  height: undefined,
  left: undefined,
  margin: undefined,
  opacity: undefined,
  order: undefined,
  padding: undefined,
  position: undefined,
  right: undefined,
  top: undefined,
  transform: undefined,
  visibility: undefined,
  width: undefined
};
const cssToStyles = (
  css: string
): typeof defaultStyles & { [key: string]: string } =>
  css
    .split(/(?:\n|;)+/)
    .filter(Boolean)
    .map((it) => it.split(/:\s*/))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), defaultStyles);

function styleToTextSize({
  "font-size": fontSize,
  "line-height": lineHeight,
  "letter-spacing": letterSpacing
}: ReturnType<typeof cssToStyles>) {
  return `${fontSize}/${lineHeight}`.replace(/px/g, "");
}

function Layer2({
  index,
  name,
  colorToName,
  style,
  alt = []
}: {
  index: number;
  name: string;
  colorToName: {};
  style: ReturnType<typeof cssToStyles>;
  alt?: {
    name: string;
    style: ReturnType<typeof cssToStyles>;
  }[];
} & JSX.IntrinsicElements["div"]): ReactElement {
  const className = [
    `bg-${colorToName[style.background]}`,
    `text-${colorToName[style.color]}`,
    `font-${titleCase(style["font-family"])}`,
    `text-${styleToTextSize(style)}`,
    "",
    ...alt.map(({ style: altStyle }, index) => [
      colorToName[altStyle.background] === colorToName[style.background]
        ? ""
        : `alt${index}:bg-${colorToName[altStyle.background]}`,
      colorToName[altStyle.color] === colorToName[style.color]
        ? ""
        : `alt${index}:text-${colorToName[altStyle.color]}`,
      titleCase(altStyle["font-family"]) === titleCase(style["font-family"])
        ? ""
        : `alt${index}:font-${titleCase(altStyle["font-family"])}`,
      styleToTextSize(altStyle) === styleToTextSize(style)
        ? ""
        : `alt${index}:text-${styleToTextSize(altStyle)}`,
      ""
    ])
  ]
    .flat()
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  return (
    <pre className="font-mono" style={{ fontSize: 9, marginBottom: 8 }}>
      {`
      <MyAwesomeTextView${index} ${titleCase(name)}=${JSON.stringify(name)} />
      <MyAwesomeTextView${index}>${name}</MyAwesomeTextView${index}>

      const MyAwesomeTextView${index}: FC<{ ${titleCase(
        name
      )}: string } & JSX.IntrinsicElements['div']> = ({ children, ${titleCase(
        name
      )} = ${JSON.stringify(name)}, ...props }) => {
        return <>
          <div className=${JSON.stringify(className)}>{${titleCase(name)}}</div>
          <div style={${titleCase(JSON.stringify(style))}}>{children}</div>
        </>
      }`}
    </pre>
  );
}

export default function IndexPage() {
  const [css, setCSS] = useState("");
  const [css2, setCSS2] = useState("");

  const colors = css
    .split(/\n\n/)
    .filter((it) => /#[0-9A-F]{6}/.test(it))
    .map((it) => it.split(";")[0]);

  const namedColors = colors
    .map((it) => it.match(/\/\*\s+(.*?)\s+\*\/[^#]+(#[0-9A-F]{6})/mu))
    .filter((it) => Array.isArray(it))
    .map(([, name, color]) => [name, color])
    .reduce(
      (acc, [name, color]) => ({
        ...acc,
        [name
          .toLowerCase()
          .replace(/[^a-z0-9/]/giu, "-")
          .replace(/[-/]+/g, "-")
          .replace(/[-]+$|^[-]+/g, "")]: color
      }),
      {}
    );
  const colorToName = Object.keys(namedColors).reduce(
    (acc, name) => ({ ...acc, [namedColors[name]]: name }),
    {}
  );

  const textStyles = css
    .split(/\n\n/)
    .filter((it) => /font-size/.test(it))
    .filter(uniq);

  const fontSizes = css
    .split(/\n|;/)
    .filter((it) => /font-size/.test(it))
    .filter(uniq);

  const layers = css
    .split(/(?=\/\*.*?\*\/\n\n)/g)
    .map((it) => it.split(/^\/\*\s+(.*?)\s+\*\/\n\n/g))
    .map(([, name, styles]) => [name, styles?.trim().split(/\n\n+/)].flat());

  const textLayers = layers.filter(([, ...styles]) =>
    styles.some((it) => /font/.test(it))
  );

  const layers2 = figmaCSSToLayers(css);
  const layers22 = figmaCSSToLayers(css2);
  const getLayersByName = (name: string) => {
    return layers22.filter((it) => it.name === name);
  };

  const fontFamilies = [...layers2, ...layers22].reduce(
    (acc, { name, style: { "font-family": fontFamily } }) => ({
      ...acc,
      [titleCase(fontFamily)]: [fontFamily]
    }),
    {}
  );

  const fontSizes2 = [...layers2, ...layers22].reduce(
    (acc, { name, style }) => {
      const {
        "font-size": fontSize,
        "line-height": lineHeight,
        "letter-spacing": letterSpacing
      } = style;
      return {
        ...acc,
        [styleToTextSize(style)]: [fontSize, { letterSpacing, lineHeight }]
      };
    },
    {}
  );

  const twTheme = {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      ...namedColors
    },
    fontSize: { ...fontSizes2 }
  };
  return (
    <div className="flex h-screen">
      <aside className="flex flex-col">
        <textarea
          className="flex-1 font-mono text-xs bg-gray-200"
          placeholder="Paste some Figma CSS here"
          value={css}
          onChange={(e) => setCSS(e.target.value)}
        />
        <textarea
          className="flex-1 font-mono text-xs bg-gray-400 text-white placeholder-black"
          placeholder="Paste some Figma CSS here"
          value={css2}
          onChange={(e) => setCSS2(e.target.value)}
        />
      </aside>
      <main className="w-5/6 overflow-y-scroll">
        <h1 className="text-lg">
          Down here you'll see some code you can copy & paste
        </h1>
        <p>You'll want to rename a bunch of stuff.</p>
        <div className="font-mono">
          {layers2.map(({ name, style }, index) => (
            <Layer2
              key={index}
              {...{ index, name, colorToName, style }}
              alt={getLayersByName(name)}
            />
          ))}
        </div>

        <hr />
        <pre className="font-mono text-xs">{`
// tailwind.config.js

/** @type {import('@navith/tailwindcss-plugin-author-types').CreatePlugin} */
const plugin = require("tailwindcss/plugin");
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig} */
module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  // TODO: implement darkMode
  darkMode: "media",
  theme: {
    extend: {
      ...${JSON.stringify(twTheme, null, 2).replace(/^/gm, "      ").trim()},
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
        ...${JSON.stringify(fontFamilies, null, 2)
          .replace(/^/gm, "        ")
          .trim()}
      },
      screens: {
        mobile: { raw: "(max-width: 768px)" },
        desktop: { raw: "(min-width: 769px)" },
        short: { raw: "(max-height: 768px)" },
        tall: { raw: "(min-height: 769px)" },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms"), safeArea()],
};

function safeArea(){
  return plugin(({ addUtilities }) => {
    const newUtilities = {
      ".m-safe": {
        marginTop: "env(safe-area-inset-top)",
        marginRight: "env(safe-area-inset-right)",
        marginBottom: "env(safe-area-inset-bottom)",
        marginLeft: "env(safe-area-inset-left)",
      },
      ".mx-safe": {
        marginRight: "env(safe-area-inset-right)",
        marginLeft: "env(safe-area-inset-left)",
      },
      ".my-safe": {
        marginTop: "env(safe-area-inset-top)",
        marginBottom: "env(safe-area-inset-bottom)",
      },
      ".mt-safe": {
        marginTop: "env(safe-area-inset-top)",
      },
      ".mr-safe": {
        marginRight: "env(safe-area-inset-right)",
      },
      ".mb-safe": {
        marginBottom: "env(safe-area-inset-bottom)",
      },
      ".ml-safe": {
        marginLeft: "env(safe-area-inset-left)",
      },
      ".p-safe": {
        paddingTop: "env(safe-area-inset-top)",
        paddingRight: "env(safe-area-inset-right)",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
      },
      ".px-safe": {
        paddingRight: "env(safe-area-inset-right)",
        paddingLeft: "env(safe-area-inset-left)",
      },
      ".py-safe": {
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      },
      ".pt-safe": {
        paddingTop: "env(safe-area-inset-top)",
      },
      ".pr-safe": {
        paddingRight: "env(safe-area-inset-right)",
      },
      ".pb-safe": {
        paddingBottom: "env(safe-area-inset-bottom)",
      },
      ".pl-safe": {
        paddingLeft: "env(safe-area-inset-left)",
      },
    };
  
    addUtilities(newUtilities, { variants: ["responsive"] });
  });
}
`}</pre>
      </main>
    </div>
  );
}
function figmaCSSToLayers(css: string) {
  return css
    .replace(/\n\n\/\* Inside Auto Layout \*\/\n/g, "")
    .replace(/\/\* identical to box height, or \d+% \*\/\n+/g, "")
    .split(/(?=\/\*.*?\*\/\n\n)/g)
    .map((it) => it.split(/^\/\*\s+(.*?)\s+\*\/\n\n/g))
    .map(([, name, styles]) => ({ name, style: cssToStyles(styles || "") }));
}
