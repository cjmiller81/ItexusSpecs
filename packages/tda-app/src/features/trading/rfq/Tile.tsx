import { Box, Card, TextField, Typography, useTheme } from "@mui/material";
import { BoxProps, Stack, styled } from "@mui/system";
import { Status } from "components";
import * as React from "react";
import { BuySellCell } from "./BuySellCell";
import { ProgressFooter } from "./ProgressBar";
import { RfqButton, RfqStage } from "./RfqButton";
import CircularWithPath from "../../../../src/components/@extended/progress/CircularWithPath";

type TileProps = BoxProps & {
  symbol1: string | null;
  symbol2: string | null;
  sellCellValue?: number;
  buyCellValue?: number;
  stage: RfqStage;
  statusFetchingRfq: Status;
  amount: number;
  progress: number;
  secondsLeft: number;
  onInitiateRfq: () => void;
  onReject: () => void;
  onAmountChange: (amount: number) => void;
  onSellClick: () => void;
  onBuyClick: () => void;
};

const Tile: React.FC<TileProps> = ({
  symbol1,
  symbol2,
  sellCellValue,
  buyCellValue,
  amount,
  progress,
  secondsLeft,
  stage: rfqButtonState,
  onReject,
  onAmountChange,
  onSellClick,
  onBuyClick,
  statusFetchingRfq,
  onInitiateRfq,
  ...props
}) => {
  const theme = useTheme();

  const customFormatNumber = (value: number) => {
    const stringValue = value.toString();
    const integerPart = stringValue.slice(0, 4);
    let decimalPart = stringValue.slice(4);
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if (decimalPart) {
      decimalPart = decimalPart.slice(0, 5);
    }
    let formattedNumber = formattedIntegerPart;
    if (decimalPart && decimalPart !== ".") {
      formattedNumber += "." + decimalPart;
    }

    return formattedNumber;
  };

  const CenteredTextField = styled(TextField)({
    "& .Mui-focused .MuiInputAdornment-root": {
      color: theme.palette.primary.main,
    },
    "& .Mui-error .MuiInputAdornment-root": {
      color: theme.palette.error.main,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      px: 12,
      border: `0.7px solid ${theme.palette.divider} !important`,
    },
    "& .MuiOutlinedInput-root": {
      border: `0.7px solid ${theme.palette.grey[200]}`,
      transition: theme.transitions.create(["border-color", "background-color"]),
      "&:hover": {
        borderColor: `${theme.palette.primary.light} !important`,
      },
      "&.Mui-focused": {
        borderColor: theme.palette.primary.light,
      },
      backgroundColor: theme.palette.mode === "dark" ? "#292929 !important" : "transparent",
    },

    "& .MuiInputLabel-root": {
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: theme.palette.mode === "dark" ? "#292929 !important" : "transparent",
      padding: "0 5px",
      textAlign: "center",
      fontSize: "10px !important",
    },
    "& .MuiInputLabel-shrink": {
      left: "53%",
      transform: "translateX(-50%)",
      padding: "0 5px",
      textAlign: "center",
      top: "-14px !important",
    },
  });

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/,/g, "").match(/^-?\d*(\.\d{0,5})?/)![0];
    onAmountChange(parseFloat(value));
  };

  return (
    <Box {...props}>
      <Card sx={{ p: 2 }}>
        <Stack alignItems="center">
          <Typography>{`${symbol1 ?? ""}/${symbol2 ?? ""}`}</Typography>
          <Stack
            direction="row"
            justifyContent="space-between"
            width="100%">
            <Stack
              direction="row"
              width="100%"
              alignItems="center"
              justifyContent="space-between">
              <LoadingBuySellCell
                cellType="sell"
                onCellClick={onSellClick}
                isExpired={rfqButtonState === "requote"}
                title="SELL"
                isRequesting={statusFetchingRfq === "loading"}
                value={sellCellValue}
              />
              <Stack alignItems="center">
                <RfqButton
                  disabled={!symbol1 || !symbol2 || !amount}
                  sx={{
                    height: "60px",
                    ":disabled": {
                      bgcolor: theme.palette.mode === "dark" ? theme.palette.grey[200] : theme.palette.grey[400],
                    },
                  }}
                  loading={statusFetchingRfq === "loading" || rfqButtonState === "inProgress"}
                  stage={rfqButtonState}
                  onInitiateRFQ={onInitiateRfq}
                  onCancel={onReject}
                  onRequote={onReject}
                />
                {rfqButtonState === "requote" && <CircularWithPath color="secondary" />}
              </Stack>
              <LoadingBuySellCell
                cellType="buy"
                contentAlignment="end"
                onCellClick={onBuyClick}
                isExpired={rfqButtonState === "requote"}
                title="BUY"
                isRequesting={statusFetchingRfq === "loading"}
                value={buyCellValue}
              />
            </Stack>
          </Stack>
          <Stack
            mt={8}
            alignItems="center"
            justifyContent="center"
            width="100%"
            direction="row"
            gap={theme => theme.spacing(1)}>
            <CenteredTextField
              label={<CustomLabel variant="body1">USDT</CustomLabel>}
              placeholder="1,000.000"
              disabled={rfqButtonState !== "requiring"}
              value={customFormatNumber(amount)}
              type="text"
              onChange={handleAmountChange}
              variant="outlined"
              InputProps={{
                inputProps: {
                  style: { textAlign: "center" },
                },
              }}
            />
          </Stack>

          <ProgressFooter
            sx={{ mt: 5 }}
            secondsLeft={secondsLeft}
            progress={progress}
            handleReject={onReject}
          />
        </Stack>
      </Card>
    </Box>
  );
};

const CustomLabel = styled(Typography)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  height: "100%",
  paddingTop: theme.spacing(1),
  lineHeight: "normal",
  margin: 0,
  fontSize: "10px !important",
}));

type LoadingBuySellCellProps = {
  cellType: "sell" | "buy";
  onCellClick: () => void;
  isExpired: boolean;
  title: string;
  contentAlignment?: "start" | "center" | "end";
  isRequesting: boolean;
  value?: number;
};

const LoadingBuySellCell: React.FC<LoadingBuySellCellProps> = ({
  cellType,
  onCellClick,
  isExpired,
  title,
  contentAlignment,
  isRequesting,
  value,
}) => {
  return (
    <Stack alignItems="center">
      <BuySellCell
        cellType={cellType}
        onCellClick={onCellClick}
        isExpired={isExpired}
        title={title}
        value={value}
        isRequesting={isRequesting}
        contentAlignment={contentAlignment}
      />
      {isRequesting && <CircularWithPath color="secondary" />}
    </Stack>
  );
};

export default Tile;
