import { blue, grey, red } from "@mui/material/colors";
import { Box, BoxProps, lighten, useTheme } from "@mui/system";
import { FC } from "react";
import { ConfirmationCellContent } from "./ConfirmationCellContent";
import { PriceCellContent } from "./PriceCellContent";

export type BuySellCellProps = BoxProps & {
  cellType: "buy" | "sell";
  title: string;
  value?: number | null;
  isExpired: boolean;
  isRequesting: boolean;
  confirmationText?: string;
  contentAlignment?: "center" | "start" | "end";
  onConfirm: () => void;
  onDiscard: () => void;
  isConfirming?: boolean;
  onCellClick: () => void;
  isQuoteSubmitting?: boolean;
};

const BuySellCell: FC<BuySellCellProps> = ({
  title,
  value,
  isExpired,
  isRequesting,
  cellType,
  contentAlignment,
  onConfirm,
  onDiscard,
  isConfirming,
  confirmationText,
  onCellClick,
  isQuoteSubmitting,
  sx,
  ...props
}) => {
  const theme = useTheme();

  let bgColor: string = theme.palette.mode === "dark" ? grey[800] : grey[200];

  if (value && cellType === "sell") {
    bgColor = theme.palette.mode === "dark" ? red[700] : red[400];
  }

  if (value && cellType === "buy") {
    bgColor = theme.palette.mode === "dark" ? blue[700] : blue[400];
  }
  return (
    <Box
      sx={{
        padding: isConfirming ? 0 : 1,
        minWidth: "200px",
        maxWidth: "200px",
        paddingBlock: "8px",
        paddingBottom: "0px",
        [theme.breakpoints.down("sm")]: {
          maxWidth: "125px",
          minWidth: "125px",
          paddingBottom: isConfirming ? "0px" : "2px",
        },
        borderRadius: "8px",
        width: "100%",
        height: "100%",
        cursor: "pointer",
        backgroundColor: bgColor,
        "&:hover": {
          ...(!isConfirming && {
            transition: "0.3s",
            backgroundColor: lighten(bgColor, 0.2),
          }),
        },
        ...sx,
      }}
      {...props}
      onClick={onCellClick}>
      {isConfirming ? (
        <ConfirmationCellContent
          cellType={cellType}
          isQuoteSubmitting={isQuoteSubmitting}
          onYes={onConfirm}
          onNo={onDiscard}
          confirmationText={confirmationText}
        />
      ) : (
        <PriceCellContent
          alignItems={contentAlignment ?? "start"}
          value={value}
          title={title}
        />
      )}
    </Box>
  );
};

export default BuySellCell;
