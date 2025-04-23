import React from "react"

export function useCtrlS(callMethodIfCtrlS = () => {}) {
  React.useEffect(() => {
    // check if the key is "s" with ctrl key
    const keyDown = (event: KeyboardEvent) => {
      if (event.key === "s" && event.ctrlKey) {
        // prevent the browser from opening the save dialog
        event.preventDefault()
        // call our callback method
        callMethodIfCtrlS()
      }
    }

    // listen to keydown events
    document.addEventListener("keydown", keyDown)

    // stop listening on component destory
    return () => {
      document.removeEventListener("keydown", keyDown)
    }
  })
}
