import React from "react"

import Convert from "ansi-to-html"

const convert = new Convert({
  newline: false,
  escapeXML: true,
})

export type ConsoleProps = {
  data: string
  className?: string
}

const Console = (props: ConsoleProps) => {
  return (
    <div
      className={`max-h-[80vh] min-h-[80vh] w-full rotate-180 transform justify-end overflow-auto overflow-x-scroll rounded bg-[var(--ifm-background-secondary-color)] p-2 ${props.className}`}
    >
      <div className="w-full rotate-180 transform">
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
