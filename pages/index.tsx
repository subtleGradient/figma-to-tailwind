import React, { FC, ReactElement, ReactNode, useState } from "react"

const uniq = (item, index, items) => items.indexOf(item) === index

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
  width: undefined,
}
const cssToStyles = (css: string): typeof defaultStyles & { [key: string]: string } =>
  css
    .split(/(?:\n|;)+/)
    .filter(Boolean)
    .map(it => it.split(/:\s*/))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), defaultStyles)

export default function IndexPage() {
  const [css, setCSS] = useState("")

  const colors = css
    .split(/\n\n/)
    .filter(it => /#[0-9A-F]{6}/.test(it))
    .map(it => it.split(";")[0])

  const namedColors = colors
    .map(it => it.match(/\/\*\s+(.*?)\s+\*\/[^#]+(#[0-9A-F]{6})/mu))
    .filter(it => Array.isArray(it))
    .map(([, name, color]) => [name, color])
    .reduce(
      (acc, [name, color]) => ({
        ...acc,
        [name
          .toLowerCase()
          .replace(/[^a-z0-9/]/giu, "-")
          .replace(/[-/]+/g, "-")
          .replace(/[-]+$|^[-]+/g, "")]: color,
      }),
      {},
    )
  const colorToName = Object.keys(namedColors).reduce((acc, name) => ({ ...acc, [namedColors[name]]: name }), {})

  const textStyles = css
    .split(/\n\n/)
    .filter(it => /font-size/.test(it))
    .filter(uniq)

  const fontSizes = css
    .split(/\n|;/)
    .filter(it => /font-size/.test(it))
    .filter(uniq)

  const layers = css
    .split(/(?=\/\*.*?\*\/\n\n)/g)
    .map(it => it.split(/^\/\*\s+(.*?)\s+\*\/\n\n/g))
    .map(([, name, styles]) => [name, styles?.trim().split(/\n\n+/)].flat())

  const textLayers = layers.filter(([, ...styles]) => styles.some(it => /font/.test(it)))

  return (
    <div className="flex min-h-screen columns">
      <textarea
        className="flex-auto font-mono text-xs bg-gray-200"
        placeholder="Paste some Figma CSS here"
        value={css}
        onChange={e => setCSS(e.target.value)}
      />
      <main className="w-5/6">
        <pre className="font-mono">{JSON.stringify(namedColors, null, 2)}</pre>
        <pre className="font-mono">{JSON.stringify(colorToName, null, 2)}</pre>
        <pre className="font-mono">{JSON.stringify(fontSizes, null, 2)}</pre>
        <pre className="font-mono">{JSON.stringify(textStyles, null, 2)}</pre>
        <div className="font-mono">
          {textLayers.map(([text, ...styles], index) => {
            const style = cssToStyles(styles.join("\n"))
            const bg = style.background
            const fg = style.color

            const fontSize = style["font-size"]
            const fontWeight = style["font-weight"]
            const borderRadius = style["border-radius"]
            const boxShadow = style["box-shadow"]
            const border = style.border

            const fontFamily = style["font-family"]
            const fontStyle = style["font-style"]
            const fontVariant = style["font-variant"]
            const letterSpacing = style["letter-spacing"]
            const textTransform = style["text-transform"]
            const lineHeight = style["line-height"]

            const background = style.background
            const color = style.color

            const alignItems = style["align-items"]
            const backdropFilter = style["backdrop-filter"]
            const boxSizing = style["box-sizing"]
            const flexDirection = style["flex-direction"]
            const flexGrow = style["flex-grow"]
            const justifyContent = style["justify-content"]
            const mixBlendMode = style["mix-blend-mode"]
            const textAlign = style["text-align"]
            const display = style.display
            const flex = style.flex
            const order = style.order
            const transform = style.transform
            const visibility = style.visibility

            const position = style.position
            const top = style.top
            const right = style.right
            const bottom = style.bottom
            const left = style.left

            const height = style.height
            const width = style.width

            const margin = style.margin
            const padding = style.padding

            const opacity = style.opacity

            return (
              <div key={index} className="font-mono" style={{ fontSize: 9 }}>
                {
                  `<div className=${JSON.stringify(
                    `text-${colorToName[fg]} bg-${colorToName[bg]} text-${fontSize}`
                      .replace(/(\w+)-undefined|\s+/g, " ")
                      .trim(),
                  )}
                  style={${JSON.stringify({
                    // fontSize,
                    // fontWeight,
                    borderRadius,
                    boxShadow,
                    border,
                    // fontFamily,
                    // fontStyle,
                    // fontVariant,
                    // letterSpacing,
                    // textTransform,
                    // lineHeight,
                    // background,
                    // color,
                    // alignItems,
                    // backdropFilter,
                    // boxSizing,
                    // flexDirection,
                    // flexGrow,
                    // justifyContent,
                    // mixBlendMode,
                    // textAlign,
                    // display,
                    // flex,
                    // order,
                    // transform,
                    // visibility,
                    // position,
                    // top,
                    // right,
                    // bottom,
                    // left,
                    // height,
                    // width,
                    // margin,
                    // padding,
                    opacity,
                  })}} >${text}</div>`.replace(/\s*style=[{}]+\s*/, "")
                  //  style={{${JSON.stringify(style)}}}
                }
              </div>
            )
          })}
        </div>
        {/* <div className="font-mono">
          {textLayers.map(([text], index) => (
            <div key={index} className="font-mono" style={{ fontSize: 9 }}>
              {`
  const MyAwesomeTextView: FC<{ text: string }> = ({ text = ${JSON.stringify(text)} }) => {
    return <div className="text-red-500 bg-red-200">{text}</div>
  }`}
            </div>
          ))}
        </div> */}
        {/* <pre className="font-mono">{JSON.stringify(textLayers, null, 2)}</pre> */}
        {/* <ParseCSS css={css} render={({ name }) => <div>{name}</div>} /> */}
        {/* <ParseCSS css={css} render={({ name, colors }) => <div>{colors}</div>} /> */}
      </main>
    </div>
  )
}

function ParseCSS({
  css,
  render: Render,
}: {
  css: string
  render: (props: { name: string; position?: string; colors?: string; font?: string }) => ReactElement
}) {
  const blocks = css.split(/(?=\/\*.*?\*\/\n\n)/g)
  return (
    <div>
      {blocks.map(function Block(block, index) {
        const [, name, ...innards] = block.trim().split(/\/\*\s+(.*?)\s+\*\/\n\n/g)
        const innardSections = innards.map(it => it.split(/\n\n/))
        return (
          <>
            {innardSections.map((it, index) => (
              <React.Fragment key={index}>
                {it.map((it, index) => (
                  <Render key={index} name={name} colors={/color|background/.test(it) ? it : ""} />
                ))}
              </React.Fragment>
            ))}
          </>
        )
      })}
    </div>
  )
}

const MyAwesomeTextView: FC<{ text: string }> = ({ text = "" }) => {
  return <div className="text-red-500 bg-red-200">{text}</div>
}
