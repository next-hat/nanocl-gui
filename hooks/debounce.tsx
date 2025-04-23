import React from "react"
import { Subject } from "rxjs"
import { debounceTime } from "rxjs/operators"

export function useDebounce(
  time: number,
  initialValue: any,
  hook?: (value: any) => void
) {
  const [value, setValue] = React.useState(initialValue)
  const [values] = React.useState(() => new Subject())
  React.useEffect(() => {
    const sub = values.pipe(debounceTime(time)).subscribe((v) => {
      if (hook) hook(v)
      setValue(v)
    })
    return () => sub.unsubscribe()
  }, [time, values])
  return [value, (v: any) => values.next(v)]
}
