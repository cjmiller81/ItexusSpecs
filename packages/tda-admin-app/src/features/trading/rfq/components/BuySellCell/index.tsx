import { blue, grey, red } from "@mui/material/colors";
import { Box, BoxProps, useTheme } from "@mui/system";
import { FC, MouseEventHandler } from "react";
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
  label?: string | null;
  secondsLeft: number;
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
  label,
  secondsLeft,
  ...props
}) => {
  const theme = useTheme();

  let bgColor: string = theme.palette.mode === "dark" ? grey[800] : grey[500];

  if (value && cellType === "sell") {
    bgColor = red[600];
  }

  if (value && cellType === "buy") {
    bgColor = blue[600];
  }

  const handleClick: MouseEventHandler<HTMLDivElement> = event => {
    if (!value) {
      event.preventDefault();
      return;
    }

    onCellClick();
  };

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
        height: "100px",
        cursor: "pointer",
        backgroundColor: bgColor,
        border: `2px solid ${theme.palette.mode === "dark" ? theme.palette.grey[100] : theme.palette.grey[500]}`,
        boxShadow: `0px 4px 12px rgba(0, 0, 0, 0.5)`,
        fontWeight: 200,

        "&:hover": {
          ...(!isConfirming && {
            transition: "0.3s",
            backgroundColor: cellType === "sell" ? "#60161b" : cellType === "buy" ? "#0d3157" : bgColor,
            "& *": {
              fontWeight: "700 !important",
              color: `${theme.palette.common.white} !important`,
            },
            "& .price-label": {
              fontWeight: "200 !important",
            },
          }),
        },
        ...sx,
      }}
      {...props}
      onClick={handleClick}>
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
          label={label}
          cellType={cellType}
          secondsLeft={secondsLeft}
          className="price-label"
        />
      )}
    </Box>
  );
};

export default BuySellCell;
