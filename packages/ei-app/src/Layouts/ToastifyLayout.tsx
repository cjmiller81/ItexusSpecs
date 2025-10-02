import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import { BoxProps } from "@mui/system"
import { clearErrors, clearMessages, clearWarnings } from "components"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function ToastifyLayout({ children }: BoxProps) {
  const { errors, messages, warnings } = useAppSelector(s => s.ui)
  const dispatch = useAppDispatch()

  if (errors.length) {
    errors.forEach((errorObj: { message: string; autoClose?: boolean }) => {
      const error = typeof errorObj === 'string' ? errorObj : errorObj.message;
      const autoClose = typeof errorObj === 'string' ? true : (errorObj.autoClose !== false);

      toast.error(error, {
        autoClose: autoClose ? 5000 : false,
        position: "top-center"
      });
    });

    dispatch(clearErrors())
  }

  if (messages.length) {
    messages.forEach((messageObj: { message: string; autoClose?: boolean }) => {
      const message = typeof messageObj === 'string' ? messageObj : messageObj.message;
      const autoClose = typeof messageObj === 'string' ? true : (messageObj.autoClose !== false);

      toast.success(message, {
        autoClose: autoClose ? 5000 : false,
        position: "top-center"
      });
    });

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
      <ToastContainer position="top-center" />
      {children}
    </>
  )
}
