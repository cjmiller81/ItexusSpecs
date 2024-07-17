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
              label={symbol1}
              placeholder="1,000,000"
              disabled={rfqButtonState !== "requiring"}
              value={amount}
              type="number"
              onChange={e => onAmountChange(parseFloat(e.target.value))}
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

const ContrastTextField = styled(TextField)({
  "& .Mui-disabled": {
    color: "inherit !important",
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "inherit !important",
    },
    "& .MuiInput-underline:before": {
      borderBottomStyle: "solid !important",
    },
    "& .MuiInput-underline:after": {
      borderBottomStyle: "solid !important",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "inherit !important",
    },
    "& label.Mui-disabled": {
      color: "inherit !important", // Label color when disabled
    },
  },
});

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
