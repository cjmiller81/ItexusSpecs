import { BoxProps } from "@mui/system"
import { clearErrors, clearMessages, useAppDispatch, useAppSelector } from "components"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export function ToastifyLayout({ children }: BoxProps) {
  const { errors, messages } = useAppSelector(s => s.ui)
  const dispatch = useAppDispatch()

  if (errors.length) {
    errors.forEach((error: string) => {
      toast.error(error)
    })

    dispatch(clearErrors())
  }

  if (messages.length) {
    messages.forEach((message: string) => {
      toast.success(message)
    })

    dispatch(clearMessages())
  }

  return (
    <>
      <ToastContainer />
      {children}
    </>
  )
}
