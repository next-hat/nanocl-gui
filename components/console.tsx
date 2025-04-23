import React from "react"
import Convert from "ansi-to-html"
import { cn } from "@/lib/utils"

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
      className={cn(
        "max-h-[70vh] min-h-[70vh] w-full rotate-180 flex-col justify-end overflow-scroll rounded-md bg-background-secondary p-4",
        props.className
      )}
    >
      <div className="rotate-180">
        <code
          className="whitespace-pre-line break-words text-xs text-white"
          dangerouslySetInnerHTML={{
            __html: convert.toHtml(props.data),
          }}
        />
      </div>
    </div>
  )
}

export default Console
