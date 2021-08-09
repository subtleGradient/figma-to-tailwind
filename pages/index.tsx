import React, { ReactElement, ReactNode, useState } from "react"

const uniq = (item, index, items) => items.indexOf(item) === index

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
