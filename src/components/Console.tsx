import React from "react"

import Convert from "ansi-to-html"

const convert = new Convert({
  newline: false,
  escapeXML: false,
})

export type ConsoleProps = {
  data: string
  className?: string
}

const Console = (props: ConsoleProps) => {
  return (
    <div
      className={`flex h-full min-h-[76vh] w-full max-w-full rotate-180 transform flex-col justify-end overflow-scroll bg-[var(--ifm-background-secondary-color)] p-4 ${
        props.className || ""
      }`}
    >
      <div className="h-full w-full rotate-180 transform">
        <code
          className="h-full whitespace-pre-line text-xs"
          dangerouslySetInnerHTML={{
            __html: convert.toHtml(props.data),
          }}
        />
      </div>
    </div>
  )
}

export default Console
