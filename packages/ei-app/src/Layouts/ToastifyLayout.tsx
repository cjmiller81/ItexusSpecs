import { clearErrors } from "@/libs/redux/Slices/UiSlice"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import { BoxProps } from "@mui/system"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function ToastifyLayout({ children }: BoxProps) {
  const { errors } = useAppSelector(s => s.walletsReducer.ui)
  const dispatch = useAppDispatch()

  if (errors.length) {
    errors.forEach((error: string) => {
      toast.error(error)
    })

    dispatch(clearErrors())
  }

  return (
    <>
      <ToastContainer />
      {children}
    </>
  )
}
