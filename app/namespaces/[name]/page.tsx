"use client"

import React from "react"
import { useParams } from "next/navigation"
import { ApiContext } from "@/utils/api"
import YAML from "yaml"

import type { components } from "@/types/api-schema"
import { YamlEditor } from "@/components/yaml-editor"

type Namespace = components["schemas"]["NamespaceInspect"]

export default function NamespacePage() {
  const params = useParams()
  const api = React.useContext(ApiContext)
  const [namespace, setNamespace] = React.useState<Namespace | null>(null)

  React.useEffect(() => {
    if (!api.isLoaded) return
    api.instance
      .get<Namespace>(`/namespaces/${params.name}/inspect`)
      .then((res) => {
        setNamespace(res.data)
      })
  }, [api.isLoaded, api.instance, params.name, setNamespace])

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <h1 className="text-2xl font-extrabold leading-tight tracking-tighter">
        Namespace {namespace?.Name}
      </h1>
      <YamlEditor isReadOnly>
        {(namespace && YAML.stringify(namespace)) || ""}
      </YamlEditor>
    </section>
  )
}
