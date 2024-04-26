import { clearErrors, clearMessages } from "@/libs/redux/Slices/UiSlice"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import { BoxProps } from "@mui/system"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function ToastifyLayout({ children }: BoxProps) {
  const { errors, messages } = useAppSelector(s => s.walletsReducer.ui)
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
