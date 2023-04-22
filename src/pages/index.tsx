import React from "react"

import MetaHeader from "@/components/MetaHeader"
import PageOverlay from "@/components/PageOverlay"
import PageTitle from "@/components/PageTitle"
import ProgressBar from "@/components/ProgressBar"

import { ApiContext } from "@/utils/api"
import type * as Types from "@/utils/types"

const httpMetricTitles = [
  {
    title: "Total",
    className:
      "bg-[var(--ifm-background-secondary-color)] hover:bg-[rgba(255,255,255,0.1)]",
  },
  { title: "Success", className: "bg-green-500 hover:bg-green-700" },
  { title: "Redirection", className: "bg-yellow-500 hover:bg-yellow-700" },
  { title: "Client Error", className: "bg-red-500 hover:bg-red-700" },
  { title: "Server Error", className: "bg-purple-500 hover:bg-purple-700" },
]

const Home = () => {
  const api = React.useContext(ApiContext)
  const [nodeData, setNodeData] = React.useState<Types.Node[]>([])
  const [httpData, setHttpData] = React.useState<any>([])

  React.useEffect(() => {
    if (!api.url) return
    Promise.all([
      api.instance.get("/nodes"),
      api.instance.get("/metrics?Kind=MEMORY"),
      api.instance.get("/metrics?Kind=CPU"),
      api.instance.get("/http_metrics/count"),
      api.instance.get("/http_metrics/count?Status=200,299"),
      api.instance.get("/http_metrics/count?Status=300,399"),
      api.instance.get("/http_metrics/count?Status=400,499"),
      api.instance.get("/http_metrics/count?Status=500,599"),
    ])
      .then((results) => {
        const curr_nodes = results[0].data
        const mem_nodes = results[1].data
        const cpu_nodes = results[2].data
        const nodes: Record<string, Types.Node> = {}

        for (let node of curr_nodes) {
          const node_name = node.Name
          nodes[node_name] = {
            ...(nodes[node_name] || {}),
            NodeName: node_name,
            IpAddress: node.IpAddress,
          }
        }

        for (let mem_node of mem_nodes) {
          const node_name = mem_node.NodeName
          nodes[node_name] = {
            ...(nodes[node_name] || {}),
            NodeName: node_name,
            Ram: mem_node.Data,
          }
        }

        for (let cpu_node of cpu_nodes) {
          const node_name = cpu_node.NodeName
          let usage = 0
          const cpu = cpu_node.Data.reduce((acc: any, curr: any) => {
            usage += curr.Usage
            return {
              ...acc,
              ...curr,
            }
          }, {})
          cpu.Usage = usage / cpu_node.Data.length
          nodes[node_name] = {
            ...(nodes[node_name] || {}),
            NodeName: node_name,
            Cpu: cpu,
          }
        }
        const n = Object.values(nodes)
        setNodeData(n)
        setHttpData(
          results.slice(3).map((r, i) => ({
            ...httpMetricTitles[i],
            count: r.data.Count,
          })),
        )
      })
      .catch((err) => {
        // TODO: Handle error
        console.log(err)
      })
  }, [api.url, api.instance, setNodeData, setHttpData])

  console.log(httpData)

  return (
    <>
      <MetaHeader title="Home" />
      <PageOverlay>
        <PageTitle title="Home" />
        <h1 className="mb-4 px-2 text-3xl font-bold">HTTP Metrics</h1>
        <div className="mb-4 flex flex-row">
          {httpData.map((metric: any) => (
            <div
              className={`m-2 flex w-full flex-col justify-center rounded p-2 shadow-lg ${metric.className}`}
              key={metric.title}
              title={metric.title}
            >
              <code className="text-center font-bold">{metric.count}</code>
            </div>
          ))}
        </div>
        <h1 className="mb-4 px-2 text-3xl font-bold">Nodes</h1>
        <div className="flex flex-col pl-2 pr-2">
          {nodeData.map((node) => (
            <div
              className="flex w-full flex-col justify-center"
              key={node.NodeName}
            >
              <h2 className="mb-1 text-xl font-bold capitalize">
                {node.NodeName}:{" "}
                <code className="text-base font-normal">{node.IpAddress}</code>
              </h2>
              <h3 className="pb-2 pt-2 text-xl font-bold">Memory</h3>
              <ProgressBar Progress={(node.Ram.Used / node.Ram.Total) * 100}>
                <p className="text-xs text-white">
                  {(node.Ram.Used * (9.31 * 1e-10)).toFixed(0)} /{" "}
                  {(node.Ram.Total * (9.31 * 1e-10)).toFixed(0)} G
                </p>
              </ProgressBar>
              <h3 className="pb-2 pt-2 text-xl font-bold">Cpu</h3>
              <ProgressBar Progress={node.Cpu.Usage}>
                <p className="text-xs text-white">
                  {node.Cpu.Usage.toFixed(0)}%
                </p>
              </ProgressBar>
            </div>
          ))}
        </div>
      </PageOverlay>
    </>
  )
}

export default Home
