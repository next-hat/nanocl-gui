import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"

export type ModalConfirmProps = {
  open: boolean
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onOpenChange: () => void
  onSubmit: () => Promise<any>
}

export function ModalConfirm({
  open,
  title,
  description,
  confirmText,
  cancelText,
  onOpenChange,
  onSubmit,
}: ModalConfirmProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex">
          <AlertDialogCancel onClick={onOpenChange}>
            {cancelText || "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onSubmit}>
            {confirmText || "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
