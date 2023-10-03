"use client"

import React from "react"
import { ApiContext } from "@/utils/api"
import { ProgressBar } from "nanocl-gui-toolkit/components/progress-bar"
import { Card } from "nanocl-gui-toolkit/components/ui/card"

import { HttpCharts } from "@/components/http-charts"

const httpMetricTitles = [
  {
    title: "Total",
    backgroundColor: "orange",
  },
  { title: "Success", backgroundColor: "green" },
  { title: "Redirection", backgroundColor: "yellow" },
  { title: "Client Error", backgroundColor: "red" },
  { title: "Server Error", backgroundColor: "purple" },
]

export default function IndexPage() {
  const api = React.useContext(ApiContext)
  const [nodeData, setNodeData] = React.useState<any[]>([])
  const [httpData, setHttpData] = React.useState<any[]>([])

  React.useEffect(() => {
    if (!api.isLoaded) return
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
        const nodes: Record<string, Node> = {}

        for (let node of curr_nodes) {
          const node_name = node.Name
          nodes[node_name] = {
            ...(nodes[node_name] || {}),
            NodeName: node_name,
            IpAddress: node.IpAddress,
          } as any
        }

        for (let mem_node of mem_nodes) {
          const node_name = mem_node.NodeName
          nodes[node_name] = {
            ...(nodes[node_name] || {}),
            NodeName: node_name,
            Ram: mem_node.Data,
          } as any
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
          } as any
        }
        const n = Object.values(nodes)
        setHttpData(
          results.slice(3).map((r, i) => ({
            ...(httpMetricTitles[i] as any),
            count: r.data.Count,
          }))
        )
        setNodeData(n)
      })
      .catch((err) => {
        // TODO: Handle error
        console.log(err)
      })
  }, [api.isLoaded, api.instance, setNodeData, setHttpData])
  console.log(httpData)
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <h1 className="text-2xl font-extrabold leading-tight tracking-tighter">
        Home
      </h1>
      {httpData.length ? (
        <HttpCharts
          title="Http metrics"
          data={httpData}
          dataKey="count"
          axisKey="title"
        />
      ) : null}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {nodeData.map((node) => (
          <Card
            key={node.NodeName}
            className="flex flex-col justify-center rounded-[4px] border-0 bg-background p-2 shadow-lg"
          >
            <div className="flex w-full flex-col justify-center">
              <h2 className="mb-2 text-xl font-bold capitalize">Hostname</h2>
              <code className="mb-2 text-base font-normal">
                {node.NodeName}
              </code>
              <h2 className="mb-2 text-xl font-bold capitalize">Address</h2>
              <code className="text-base font-normal">{node.IpAddress}</code>
              <h3 className="py-2 text-xl font-bold">Memory</h3>
              <ProgressBar Progress={(node.Ram.Used / node.Ram.Total) * 100}>
                <p className="text-xs text-white">
                  {(node.Ram.Used * (9.31 * 1e-10)).toFixed(0)} /{" "}
                  {(node.Ram.Total * (9.31 * 1e-10)).toFixed(0)} G
                </p>
              </ProgressBar>
              <h3 className="py-2 text-xl font-bold">Cpu</h3>
              <ProgressBar Progress={node.Cpu.Usage}>
                <p className="text-xs text-white">
                  {node.Cpu.Usage.toFixed(0)}%
                </p>
              </ProgressBar>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
