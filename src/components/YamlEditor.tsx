import React from "react"
import { Editor } from "@monaco-editor/react"

export type YamlEditorProps = {
  children: string
  isReadOnly?: boolean
  onChange?: (value: string | undefined) => void
}

const YamlEditor = (props: YamlEditorProps) => {
  return (
    <Editor
      onChange={props.onChange}
      theme="vs-dark"
      height="80vh"
      options={{
        // model: null,
        tabSize: 2,
        readOnly: props.isReadOnly,
      }}
      defaultLanguage="yaml"
      value={props.children}
    />
  )
}

export default YamlEditor
