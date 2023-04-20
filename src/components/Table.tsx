import React from "react"
import { useRouter } from "next/router"
import type { NextRouter } from "next/router"

export type TableColumn = {
  Name: string
  Key: string
  Render?: null | ((data: any, i: number) => React.ReactNode)
}

export type TableProps = {
  Data: any[]
  ID: string | ((data: any) => string)
  Columns: TableColumn[]
}

const renderHeader = (columns: TableColumn[]) => {
  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <th
            className="border-grey-200 border-b p-2 text-left"
            key={column.Key}
          >
            {column.Name}
          </th>
        ))}
      </tr>
    </thead>
  )
}

const renderBody = (props: TableProps, router: NextRouter) => {
  return (
    <tbody>
      {props.Data.map((row, i) => (
        <tr
          className="duration-2 rounded transition hover:border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.1)]"
          key={typeof props.ID === "string" ? row[props.ID] : props.ID(row)}
        >
          {props.Columns.map((column) => (
            <td className="justify-center p-2 text-xs" key={column.Key}>
              {column.Render ? column.Render(row, i) : row[column.Key]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}

const Table = (props: TableProps) => {
  const router = useRouter()
  return (
    <table className="w-full table-auto">
      {renderHeader(props.Columns)}
      {renderBody(props, router)}
    </table>
  )
}

export default Table
