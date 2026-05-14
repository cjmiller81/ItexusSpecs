import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { useOry, addError, addMessage, useAppDispatch, AppFormTextField, WelcomeModal } from "components";
import { parseOryErrorMessage } from "../../utils/parseOryErrors";
import { authLogger } from "../../utils/authLogger";
import { Formik, Form } from "formik";
import { InferType, object, string } from "yup";
import i18n from "i18next";

const NewPasswordModelSchema = object({
  newPassword: string()
    .required(i18n.t("mandatoryField", { ns: "ErrorMessages" }))
    .min(1, i18n.t("mandatoryField", { ns: "ErrorMessages" }))
    .min(8, i18n.t("incorectPassword", { ns: "ErrorMessages" })),
});

type NewPasswordModel = InferType<typeof NewPasswordModelSchema>;

export interface PasswordResetModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onWelcomeModalOpen?: (isOpen: boolean) => void;
}

export const PasswordResetModal: React.FC<PasswordResetModalProps> = ({
  open,
  onClose,
  onSuccess,
  onWelcomeModalOpen,
}) => {
  const { t } = useTranslation("SecurityContainer");
  const dispatch = useAppDispatch();
  const { onChangePassword, createSettingsFlow } = useOry();

  const [newPasswordLoading, setNewPasswordLoading] = useState(false);
  const [settingsFlowCreating, setSettingsFlowCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [hasExpiredFlow, setHasExpiredFlow] = useState(false);

  useEffect(() => {
    if (open) {
      setHasExpiredFlow(false);
      setSettingsFlowCreating(true);
      createSettingsFlow()
        .catch(error => {
          authLogger.error("PasswordResetModal: createSettingsFlow failed", error);
        })
        .finally(() => {
          setSettingsFlowCreating(false);
        });
    }
  }, [open, createSettingsFlow]);

  const onSubmitNewPassword = async (password: string, resetForm: () => void) => {
    setNewPasswordLoading(true);

    onChangePassword(password)
      .then(() => {
        dispatch(addMessage({ message: "New password accepted.", autoClose: false }));
        resetForm();
        setShowWelcomeModal(true);
        onWelcomeModalOpen?.(true);
      })
      .catch(error => {
        const errorMessage = parseOryErrorMessage(error);

        if (
          errorMessage.includes("session is too old") ||
          errorMessage.includes("too old and thus not allowed") ||
          errorMessage.includes("expired") ||
          error?.response?.status === 410
        ) {
          setHasExpiredFlow(true);
        }

        dispatch(addError({ message: errorMessage, autoClose: false }));
      })
      .finally(() => {
        setNewPasswordLoading(false);
      });
  };

  const handleClose = (_event: React.SyntheticEvent, reason: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }
  };

  const handleCloseWithX = () => {
    onClose();
    setShowWelcomeModal(true);
    onWelcomeModalOpen?.(true);
  };

  const handleWelcomeModalClose = () => {
    setShowWelcomeModal(false);
    onWelcomeModalOpen?.(false);
    onSuccess();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown
        sx={{
          zIndex: 10000,
          "& .MuiDialog-paper": {
            borderRadius: 2,
          },
        }}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography
            variant="h6"
            component="div">
            {t("ChangePassword")}
          </Typography>
          {hasExpiredFlow && (
            <IconButton
              onClick={handleCloseWithX}
              sx={{
                color: "text.secondary",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}>
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>

        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Formik<NewPasswordModel>
              initialValues={{
                newPassword: "",
              }}
              validateOnBlur={false}
              validateOnChange={false}
              validationSchema={NewPasswordModelSchema}
              onSubmit={(data, { resetForm }) => {
                onSubmitNewPassword(data.newPassword, resetForm);
              }}>
              {({ submitForm }) => (
                <Form>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <AppFormTextField
                      tooltip={t("Password", { ns: "Tooltips" })}
                      name="newPassword"
                      label={t("NewPassword")}
                      id="filled-adornment-password"
                      inputProps={{
                        type: showPassword ? "text" : "password",
                        placeholder: t("EnterPassword"),
                        InputProps: {
                          autoComplete: "off",
                          endAdornment: (
                            <InputAdornment
                              sx={{ cursor: "pointer" }}
                              onClick={() => setShowPassword(prev => !prev)}
                              position="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Box>
                  <DialogActions sx={{ p: 0, pt: 2 }}>
                    <LoadingButton
                      loading={newPasswordLoading || settingsFlowCreating}
                      disabled={settingsFlowCreating}
                      onClick={submitForm}
                      sx={{
                        width: "100%",
                        minWidth: "170px",
                      }}
                      variant={"contained"}>
                      {settingsFlowCreating ? "Initializing..." : t("ChangePassword")}
                    </LoadingButton>
                  </DialogActions>
                </Form>
              )}
            </Formik>
          </Box>
        </DialogContent>
      </Dialog>

      <WelcomeModal
        open={showWelcomeModal}
        onClose={handleWelcomeModalClose}
      />
    </>
  );
};
