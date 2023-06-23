import React from "react"
import { Editor } from "@monaco-editor/react"
import { useTheme } from "next-themes"

export type YamlEditorProps = {
  children: string
  isReadOnly?: boolean
  onChange?: (value: string | undefined) => void
}

export function YamlEditor(props: YamlEditorProps) {
  const { theme } = useTheme()
  return (
    <Editor
      onChange={props.onChange}
      theme={theme === "dark" ? "vs-dark" : "vs-light"}
      height="76vh"
      options={{
        tabSize: 2,
        readOnly: props.isReadOnly,
      }}
      defaultLanguage="yaml"
      value={props.children}
    />
  )
}
