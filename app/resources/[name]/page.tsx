"use client"

import React from "react"
import { useParams } from "next/navigation"
import { ApiContext } from "@/utils/api"
import YAML from "yaml"

import type { components } from "@/types/api-schema"
import { YamlEditor } from "@/components/yaml-editor"

type Resource = components["schemas"]["NamespaceInspect"]

export default function ResourcePage() {
  const params = useParams()
  const api = React.useContext(ApiContext)
  const [resource, setResources] = React.useState<Resource | null>(null)

  React.useEffect(() => {
    if (!api.isLoaded) return
    api.instance.get<Resource>(`/resources/${params.name}`).then((res) => {
      console.log(res)
      setResources(res.data)
    })
  }, [api.isLoaded, api.instance, params.name, setResources])

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <h1 className="text-2xl font-extrabold leading-tight tracking-tighter">
        Resource {resource?.Name}
      </h1>
      <YamlEditor isReadOnly>
        {(resource && YAML.stringify(resource)) || ""}
      </YamlEditor>
    </section>
  )
}
