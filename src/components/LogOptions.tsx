import React from "react"
import {Cog6ToothIcon} from "@heroicons/react/24/solid"

export type LogOptions = {
  since: Date | undefined,
  until: Date | undefined,
  timestamps: boolean,
  follow: boolean,
  tail: string,
}

type LogOptionsDisplayProps = {options: LogOptions, setOptions: (options: LogOptions) => void} 

function setTimestamps(e: React.ChangeEvent<HTMLInputElement>, props: LogOptionsDisplayProps) {
  props.setOptions(Object.assign({}, props.options, {timestamps: e.target.checked}))
}

function setFollow(e: React.ChangeEvent<HTMLInputElement>, props: LogOptionsDisplayProps) {
  props.setOptions(Object.assign({}, props.options, {follow: e.target.checked}))
}

function propegateTail(e: React.ChangeEvent<HTMLInputElement>, props: LogOptionsDisplayProps) {
  props.setOptions(Object.assign({}, props.options, {tail: e.target.value}))
}

export function LogOptionsDisplay(props: LogOptionsDisplayProps) {
  const [isHidden, setHidden] = React.useState(true)
  const [tail, setTail] = React.useState("0")

  React.useEffect(() => {
    setTail(props.options.tail) 
  }, [props.options.tail])

  return (
    <>
      {!isHidden ? (
        <>
          <label>
            Timestamps: <input type="checkbox" checked={props.options.timestamps} onChange={(e) => setTimestamps(e, props)} />
          </label><br/>
          <label>
            Follow: <input type="checkbox" checked={props.options.follow}  onChange={(e) => setFollow(e, props)}/>
          </label><br/>
          <label>
            Tail: 
            <input type="text" value={tail} onBlur={(e) => propegateTail(e, props)} onChange={(e) => setTail(e.target.value)} />
          </label><br/>
        </>
      ) : null}
      <Cog6ToothIcon className="h-4 w-4" onClick={() => setHidden(!isHidden)} />
    </>
  )
}
