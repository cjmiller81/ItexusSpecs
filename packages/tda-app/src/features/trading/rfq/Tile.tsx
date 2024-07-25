import { useState } from "react";
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
  const [handleAmount, setAmount] = useState("1,000");

  const customFormatNumber = value => {
    let str = value.toString().replace(/[^0-9.]/g, "");

    if (str === "") {
      return "0";
    }

    let [integerPart, decimalPart] = str.split(".");

    integerPart = integerPart.replace(/^0+/, "") || "0";

    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if (decimalPart !== undefined) {
      decimalPart = decimalPart.slice(0, 5);
      str = `${integerPart}.${decimalPart}`;
    } else {
      str = integerPart;
    }

    return str;
  };

  const handleAmountChange = event => {
    let value = event.target.value;

    let [integerPart, decimalPart] = value.split(".");

    if (decimalPart !== undefined && decimalPart.length > 5) {
      decimalPart = decimalPart.slice(0, 5);
      value = `${integerPart}.${decimalPart}`;
    }

    let formattedValue = customFormatNumber(value);

    setAmount(formattedValue);
    onAmountChange(parseFloat(formattedValue.replace(/,/g, "")));
  };

  const handleBlur = event => {
    let formattedValue = customFormatNumber(event.target.value);
    if (formattedValue.endsWith(".")) {
      formattedValue = formattedValue.slice(0, -1);
    }
    setAmount(formattedValue);
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
            direction="row"
            gap={theme => theme.spacing(1)}>
            <ContrastTextField
              label={symbol1 ?? "USDT"}
              placeholder="1,000.000"
              disabled={rfqButtonState !== "requiring"}
              value={handleAmount}
              onChange={handleAmountChange}
              onBlur={handleBlur}
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

const ContrastTextField = styled(TextField)(({ theme }) => ({
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

  "& legend": {
    display: "none",
  },

  "& .MuiInputBase-input": {
    textAlign: "center",
  },

  "& .MuiOutlinedInput-root": {
    boxShadow: "none !important",
  },

  "& .MuiOutlinedInput-root.Mui-focused": {
    boxShadow: "none !important",
  },
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
    <Box sx={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <BuySellCell
        cellType={cellType}
        onCellClick={onCellClick}
        isExpired={isExpired}
        title={title}
        value={value}
        isRequesting={isRequesting}
        contentAlignment={contentAlignment}
      />
      {isRequesting && (
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translate(-50%, -50%)",
            top: "54%",
          }}>
          <CircularWithPath color="secondary" />
        </Box>
      )}
    </Box>
  );
};

export default Tile;
