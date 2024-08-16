import { LoadingButton, LoadingButtonProps } from "@mui/lab";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import { FC, MouseEventHandler, TouchEventHandler } from "react";

export type RfqStage = "cancelable" | "requiring" | "requote" | "inProgress" | "insufficientFunds";
type RfqButtonProps = {
  onInitiateRFQ: MouseEventHandler<HTMLButtonElement>;
  stage: RfqStage;
  onCancel: () => void;
  onRequote: () => void;
  onTouchStart?: TouchEventHandler<HTMLButtonElement>;
  sellSymbol: string | null;
  popoverMessage?: string | null;
};

export const RfqButton: FC<Omit<RfqButtonProps, "children"> & LoadingButtonProps> = ({
  onInitiateRFQ,
  onCancel,
  onRequote,
  stage,
  sellSymbol,
  sx,
  popoverMessage,
  ...props
}) => {
  const theme = useTheme();
  const onHandleClick: MouseEventHandler<HTMLButtonElement> = event => {
    if (popoverMessage) {
      onCancel();
      return;
    }
    switch (stage) {
      case "cancelable":
        onCancel();
        break;
      case "requiring":
        onInitiateRFQ(event);
        break;
      case "requote":
        onRequote();
        break;
      default:
        throw "Invalid stage value";
    }
  };

  const onClick: MouseEventHandler<HTMLButtonElement> = event => {
    onHandleClick(event);
  };

  const getMessage = () => {
    if (popoverMessage) {
      return "Cancel RFQ";
    } else {
      switch (stage) {
        case "requiring":
          return "Initiate RFQ";
        case "cancelable":
          return "Cancel RFQ";
        case "requote":
          return "Requote";
        case "inProgress":
          return `Sell ${sellSymbol}`;
        default:
          break;
      }
    }
  };

  return (
    <Box
      width="100%"
      position="relative">
      <LoadingButton
        {...props}
        onClick={onClick}
        variant="contained"
        sx={{
          height: theme => theme.spacing(5),
          textWrap: "nowrap",
          width: "100%",
          [theme.breakpoints.down("sm")]: {
            fontSize: "11px",
          },
          textTransform: "capitalize",
          lineHeight: 1.4,
          ...sx,
        }}>
        {getMessage()}
      </LoadingButton>
      {popoverMessage && (
        <Paper
          variant="outlined"
          sx={{
            padding: "1px 1px",
            position: "absolute",
            top: 44,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "40px",
            zIndex: 10,
            bgcolor: "#FFD966",
          }}>
          <Typography
            noWrap
            textAlign="center"
            color={theme => theme.palette.common.black}
            sx={{
              p: 1,
              py: 2,
              width: "570px",
              [theme.breakpoints.down("md")]: {
                width: "570px",
              },
              [theme.breakpoints.down("sm")]: {
                width: "410px",
                fontSize: "11.5px",
              },
              [theme.breakpoints.down("xs")]: {
                width: "365px",
                fontSize: "10.2px",
              },
            }}>
            {popoverMessage}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};
