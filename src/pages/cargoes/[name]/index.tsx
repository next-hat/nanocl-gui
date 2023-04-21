import React from "react"
import { useRouter } from "next/router"
import moment from "moment"

import { ApiContext, instanceError } from "@/utils/api"

import PageTitle from "@/components/PageTitle"
import PageOverlay from "@/components/PageOverlay"
import Table from "@/components/Table"
import Button from "@/components/Button"
import ModalConfirm from "@/components/ModalConfirm"
import {
  DocumentTextIcon,
  MinusIcon,
  PencilIcon,
  RocketLaunchIcon,
  StopIcon,
} from "@heroicons/react/24/solid"
import MetaHeader from "@/components/MetaHeader"

export default function Cargo() {
  const router = useRouter()
  const api = React.useContext(ApiContext)
  const confirmAction = router.query.ConfirmAction as string

  const [data, setData] = React.useState<any>(null)

  React.useEffect(() => {
    if (!api.url || !router.isReady) return

    api.instance
      .get(
        `/cargoes/${router.query.name}/inspect?Namespace=${router.query.Namespace}`,
      )
      .then((res) => {
        setData(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [api.url, api.instance, router.isReady, router.query])

  const confirmActions: Record<string, any> = {
    Delete: {
      title: "Are you sure to delete this cargo ?",
      onConfirm: async () => {
        await api.instance
          .delete(
            `/cargoes/${router.query.name}?Namespace=${router.query.Namespace}`,
          )
          .then(() => {
            return router.push(`/cargoes?Namespace=${router.query.Namespace}`)
          })
          .catch((err) => {
            throw instanceError(err)
          })
      },
    },
    Stop: {
      title: "Are you sure to stop this cargo ?",
      onConfirm: async () => {
        await api.instance
          .post(
            `/cargoes/${router.query.name}/stop?Namespace=${router.query.Namespace}`,
          )
          .then(() => {
            return router.push(
              `/cargoes/${router.query.name}?Namespace=${router.query.Namespace}`,
            )
          })
          .catch((err) => {
            throw instanceError(err)
          })
      },
    },
    Start: {
      title: "Are you sure to start this cargo ?",
      onConfirm: async () => {
        await api.instance
          .post(
            `/cargoes/${router.query.name}/start?Namespace=${router.query.Namespace}`,
          )
          .then(() => {
            return router.push(
              `/cargoes/${router.query.name}?Namespace=${router.query.Namespace}`,
            )
          })
          .catch((err) => {
            throw instanceError(err)
          })
      },
    },
  }

  function setConfirmAction(confirmAction?: string) {
    router.push(
      `/cargoes/${router.query.name}?Namespace=${router.query.Namespace}${
        confirmAction ? `&ConfirmAction=${confirmAction}` : ""
      }`,
    )
  }

  function onCloseConfirm() {
    setConfirmAction()
  }

  function onOpenDeleteConfirm() {
    setConfirmAction("Delete")
  }

  function onOpenStopConfirm() {
    setConfirmAction("Stop")
  }

  function onOpenStartConfirm() {
    setConfirmAction("Start")
  }

  return (
    <>
      <MetaHeader title={`Cargo ${data?.Name || ""}`} />
      {confirmAction ? (
        <ModalConfirm
          title={confirmActions[confirmAction].title}
          onClose={onCloseConfirm}
          onConfirm={confirmActions[confirmAction].onConfirm}
        />
      ) : null}
      <PageOverlay>
        <PageTitle
          title={`Cargo ${data?.Name || ""}`}
          actions={[
            {
              title: "Delete",
              icon: <MinusIcon className="h-4 w-4" />,
              className: "mr-2 bg-red-500 hover:bg-red-700",
              onClick: onOpenDeleteConfirm,
            },
            {
              title: "Stop",
              icon: <StopIcon className="h-4 w-4" />,
              className: "mr-2 bg-purple-500 hover:bg-purple-700",
              onClick: onOpenStopConfirm,
            },
            {
              title: "Start",
              icon: <RocketLaunchIcon className="h-4 w-4" />,
              className: "mr-2 bg-green-500 hover:bg-green-700",
              onClick: onOpenStartConfirm,
            },
            {
              title: "Edit",
              icon: <PencilIcon className="h-4 w-4" />,
              className: "bg-blue-500 hover:bg-blue-700",
              onClick: () => {
                router.push(
                  `/cargoes/${router.query.name}/edit?Namespace=${router.query.Namespace}`,
                )
              },
            },
          ]}
        />
        <Table
          ID={(data) => data.Container.Id}
          Data={data?.Instances || []}
          Columns={[
            {
              Name: "Name",
              Key: "Name",
              Render: (data) => data.Container.Names[0].replace("/", ""),
            },
            {
              Name: "Image",
              Key: "Image",
              Render: (data) => data.Container.Image,
            },
            {
              Name: "Created at",
              Key: "Created",
              Render: (data) =>
                moment(data.Container.Created, "X").format(
                  "DD/MM/YYYY HH:mm:ss",
                ),
            },
            {
              Name: "Ip Address",
              Key: "Ip",
              Render: (data) =>
                data.Container.NetworkSettings.Networks[
                  router.query.Namespace as string
                ]?.IPAddress || "-",
            },
            {
              Name: "State",
              Key: "State",
              Render: (data) => data.Container.State,
            },
            {
              Name: "Status",
              Key: "Status",
              Render: (data) => data.Container.Status,
            },
            {
              Name: "Actions",
              Key: "Actions",
              Render: (_row: any, i) => (
                <div className="flex">
                  <Button
                    title="Logs"
                    className="min-w-fit bg-blue-500 hover:bg-blue-700"
                    onClick={() => {
                      router.push(
                        `/cargoes/${router.query.name}/${
                          ((router.query.name || "") as string) +
                          (i ? `-${i}` : "")
                        }/logs?Namespace=${router.query.Namespace}`,
                      )
                    }}
                  >
                    <DocumentTextIcon className="h-4 w-4" />
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </PageOverlay>
    </>
  )
}
