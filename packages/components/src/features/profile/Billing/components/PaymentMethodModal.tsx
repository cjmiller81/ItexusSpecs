import { useTheme } from "@mui/material";
import { FC } from "react";
import { AppModal, AppModalProps } from "../../../../components";

export const PaymentMethodModal: FC<AppModalProps> = ({ children, ...props }) => {
  const theme = useTheme();

  return (
    <AppModal
      bodyProps={{
        sx: {
          minWidth: "700px",
          minHeight: "400px",
          [theme.breakpoints.down("md")]: {
            minWidth: "90%",
            paddingX: 1,
          },
        },
      }}
      {...props}>
      {children}
    </AppModal>
  );
};
