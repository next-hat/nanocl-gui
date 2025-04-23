import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"

import type { components } from "@/types/api-schema"

type NamespacePartial = components["schemas"]["NamespacePartial"]

type DialogNewNamespace = {
  open: boolean
  onOpenChange: () => void
  onSubmit: (data: NamespacePartial) => Promise<any>
}

export function DialogNewNamespace(props: DialogNewNamespace) {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const name = (e.currentTarget.elements[0] as HTMLInputElement).value
    if (!name) {
      return
    }
    if (name) {
      props.onSubmit({ Name: name as string })
    }
  }
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Namespace</DialogTitle>
          <DialogDescription>Create a new Namespace</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" className="col-span-3" />
          </div>
          <DialogFooter className="pt-2">
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
