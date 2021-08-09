import { useState } from "react"

export default function IndexPage() {
  const [css, setCSS] = useState("")
  return (
    <div className="flex min-h-screen columns">
      <textarea
        className="flex-auto font-mono text-xs bg-gray-200"
        placeholder="Paste some Figma CSS here"
        value={css}
        onChange={e => setCSS(e.target.value)}></textarea>
      <main className="w-5/6">
        <ParseCSS css={css} />
      </main>
    </div>
  )
}

function ParseCSS({ css }) {
  const blocks = css.split(/(?=\/\*.*?\*\/\n\n)/g)
  return (
    <div>
      {blocks.map((block, index) => {
        return <Block key={index} block={block}></Block>
      })}
    </div>
  )
}

function Block({ block }: { block: string }) {
  const [, name, ...innards] = block.trim().split(/\/\*\s+(.*?)\s+\*\/\n\n/g)
  const innardSections = innards.map(it => it.split(/\n\n/))
  return (
    <div>
      <h1>{name}</h1>
      <div>
        {innardSections.map((it, index) => (
          <div key={index}>
            {it.map((it, index) => (
              <div key={index}>{it}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
