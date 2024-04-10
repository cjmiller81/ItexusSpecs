import CustomSnackbarProvider from "@/providers/CustomSnackbarProvider"
import { createContext, useContext, useState } from "react"

interface INotificationContextProps {
  open: boolean
  message: string
  severity: "success" | "error" | "info" | "warning"
  showNotification: (message: string, severity: "success" | "error" | "info" | "warning") => void
  hideNotification: () => void
}

const NotificationContext = createContext<INotificationContextProps | undefined>(undefined)

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any
const NotificationProvider = ({ children }: any) => {
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  })

  const showNotification = (message: string, severity: "success" | "error" | "info" | "warning") => {
    setNotification({
      open: true,
      message,
      severity,
    })
  }

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      open: false,
    }))
  }

  const contextValue: INotificationContextProps = {
    ...notification,
    showNotification,
    hideNotification,
  }

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <CustomSnackbarProvider
        open={notification.open}
        onClose={hideNotification}
        severity={notification.severity}
        message={notification.message}
      />
    </NotificationContext.Provider>
  )
}

export default NotificationProvider
