"use client";

import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Fade from "@mui/material/Fade";
import Modal, { ModalProps } from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/system";
import MainCard from "components/MainCard";
import { FC } from "react";
import { useTranslation } from "react-i18next";

type Props = Omit<ModalProps, "children"> & {};

export const WithdrawalRequestConfirmationModal: FC<Props> = ({ onClose, open, ...props }) => {
  const { t } = useTranslation("WithdrawalRequestConfirmationModal");
  const theme = useTheme();
  return (
    <Modal
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      sx={{
        minWidth: "500px",
      }}
      open={open}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
      onClose={onClose}
      {...props}>
      <Fade in={open}>
        <MainCard
          sx={{
            minWidth: "500px",
            [theme.breakpoints.down("xs")]: {
              minWidth: "90%",
            }
          }}
          title={t("ModalTitle")}
          modal
          darkTitle
          content={false}>
          <CardContent>
            <Typography>{t("ModalText1")}</Typography>
            <Typography>{t("ModalText2")}</Typography>
          </CardContent>
          <Divider />
          <Stack
            direction="row"
            spacing={1}
            justifyContent="flex-end"
            sx={{ px: 2.5, py: 2 }}>
            <Button
              color="error"
              size="small"
              onClick={event => {
                if (onClose) {
                  onClose(event, "backdropClick");
                }
              }}>
              {t("Close", { ns: "Common" })}
            </Button>
          </Stack>
        </MainCard>
      </Fade>
    </Modal>
  );
};

export default WithdrawalRequestConfirmationModal;
