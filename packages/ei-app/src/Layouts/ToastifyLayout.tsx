import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import { BoxProps } from "@mui/system"
import { clearErrors, clearMessages, clearWarnings } from "components"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function ToastifyLayout({ children }: BoxProps) {
  const { errors, messages, warnings } = useAppSelector(s => s.ui)
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

  if (warnings.length) {
    warnings.forEach((warning: string) => {
      toast.warn(warning)
    })

    dispatch(clearWarnings())
  }

  return (
    <>
      <ToastContainer />
      {children}
    </>
  )
}
