import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, Typography, Box, IconButton, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useOry } from "../../features";
import { useTranslation } from "react-i18next";
import { authLogger } from "../../utils/authLogger";

export interface SessionWatcherProps {
  logOut?: () => void;
}

export const SessionWatcher = ({ logOut }: SessionWatcherProps) => {
  const { session, logOut: oryLogOut } = useOry();
  const effectiveLogOut = logOut ?? oryLogOut;
  const [remainingMinutes, setRemainingMinutes] = useState<number | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const theme = useTheme();
  const { t } = useTranslation("SessionWatcher");

  useEffect(() => {
    if (!session?.expires_at || dismissed) return;

    const expirationTime = new Date(session.expires_at).getTime();

    const updateCountdown = () => {
      const msLeft = expirationTime - Date.now();
      const minutesLeft = Math.ceil(msLeft / (60 * 1000));

      setRemainingMinutes(minutesLeft);

      if (minutesLeft <= 3) {
        setShowWarning(true);
      }

      if (minutesLeft <= 0) {
        setShowWarning(false);
        try {
          const result = effectiveLogOut();
          if (result && typeof (result as Promise<void>).catch === "function") {
            (result as Promise<void>).catch(err => {
              authLogger.error("SessionWatcher: auto logOut failed", err);
            });
          }
        } catch (err) {
          authLogger.error("SessionWatcher: auto logOut threw", err);
        }
      }
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);
    return () => clearInterval(intervalId);
  }, [session, effectiveLogOut, dismissed]);

  const handleClose = () => {
    setShowWarning(false);
    setDismissed(true);
  };

  return (
    <Dialog
      open={showWarning}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2,
          maxWidth: 600,
          textAlign: "center",
        },
      }}>
      <Box
        display="flex"
        justifyContent="flex-end">
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        mb={1}
        fontSize="40px">
        ⚠️
      </Box>

      <DialogTitle sx={{ fontWeight: 500, fontSize: 28, textAlign: "center" }}>{t("SessionExpiringSoon")}</DialogTitle>

      <DialogContent>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 2, fontSize: 20 }}>
          {t("YourSessionWillAutomaticallyExpireIn")} {remainingMinutes ?? "-"}{" "}
          {remainingMinutes === 1 ? "minute" : "minutes"}.
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.mode === "dark" ? "#75b2f7ff" : "#217ee9ff",
            fontWeight: 600,
            fontSize: 20,
            backgroundColor: theme.palette.mode === "dark" ? "#2b5480ff" : "#e1eef3ff",
            borderRadius: "8px",
            padding: 2,
          }}>
          {t("UseRENEWButtonInTheTop")}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};
