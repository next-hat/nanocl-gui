import React from "react"

import Convert from "ansi-to-html"

export type ConsoleProps = {
  id: string
  data: string
  className?: string
  enableStream?: boolean
}

const converts = new Map<string, Convert>()

const Console = (props: ConsoleProps) => {
  let convert = converts.get(props.id)
  if (!convert) {
    convert = new Convert({
      stream: props.enableStream || false,
    })
    converts.set(props.id, convert)
  }
  return (
    <div
      className={`max-h-[70vh] min-h-[70vh] w-full rotate-180 transform flex-col justify-end overflow-scroll bg-[var(--ifm-background-secondary-color)] p-4 ${
        props.className || ""
      }`}
    >
      <div className="rotate-180 transform">
        <code
          className="whitespace-pre-line text-xs"
          dangerouslySetInnerHTML={{
            __html: convert.toHtml(props.data),
          }}
        />
      </div>
    </div>
  )
}

export default Console
