import React, { useCallback, useEffect, useState } from "react";

import { bind } from "@react-rxjs/core";
import { distinctUntilChanged, groupBy, mergeMap, throttleTime } from "rxjs";
import { ITimeSeriesEvent } from "@dxfeed/api";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2

import TitleValueDisplay from "../TitleValueDisplay/TitleValueDisplay";
import {
  ICandleEvent,
  ISummaryEvent,
  ITradeEvent,
  messagesChange$,
} from "../../../../services/dxFeedRx";

import { formatDollarsCents } from "../../../../utils";

import "./SymbolLastPriceChangeDisplay.scss";

// eslint-disable-next-line
const [_useMessages, messages$] = bind(
  messagesChange$.pipe(
    groupBy((priceData) => priceData.eventSymbol),
    mergeMap((symbolGroup$) =>
      symbolGroup$.pipe(
        distinctUntilChanged((prev, curr) => {
          if (prev.eventType === "Candle" && curr.eventType === "Candle") {
            return +prev.close === +curr.close;
          } else if (prev.eventType === "Quote" && curr.eventType === "Quote") {
            return (
              +prev.bidPrice + (+prev.askPrice - +prev.bidPrice) / 2 ===
              +curr.bidPrice + (+curr.askPrice - +curr.bidPrice) / 2
            );
          } else if (
            prev.eventType === "Summary" &&
            curr.eventType === "Summary"
          ) {
            return +prev.dayOpenPrice === +curr.dayOpenPrice;
          } else if (prev.eventType === "Trade" && curr.eventType === "Trade") {
            return +prev.price === +curr.price;
          }

          return false;
        }),
        throttleTime(1000 * 10)
      )
    )
  )
);

const RenderSymbol = (props: { text: string }) => {
  return (
    <div
      className={`dx-theme-material-typography symbol-last-price-change-symbol dx-font-xl`}
    >
      {props.text}
    </div>
  );
};

const RenderDelayedDataMsg = () => {
  return (
    <div className={`dx-theme-material-typography delayed-data-msg dx-font-xs`}>
      Market quotes 15 minutes delayed
    </div>
  );
};

const SymbolLastPriceChangeDisplay = () => {
  const appTheme = useTheme();
  const [tradeMsg, setTradeMsg] = useState<ITradeEvent>({
    change: 0,
    changePercent: 0,
    price: 0,
  } as ITradeEvent);
  const [openPrice, setOpenPrice] = useState(0);

  const streamingEventHandler = useCallback(
    (event: ITimeSeriesEvent) => {
      //console.log("event:", event.eventType);
      switch (event.eventType) {
        case "Candle": {
          if (event.eventSymbol === "/ES:XCME") {
            const candle = event as ICandleEvent;
            //console.log("Candle event:", candle);

            setTradeMsg({
              change:
                openPrice !== 0 ? openPrice - candle.close : tradeMsg.change,
              changePercent:
                openPrice !== 0
                  ? (openPrice - candle.close) / openPrice
                  : tradeMsg.changePercent,
              price: candle.close,
            } as ITradeEvent);
          }

          break;
        }
        case "Summary": {
          if (event.eventSymbol === "/ES:XCME") {
            const summary = event as ISummaryEvent;
            //console.log("Summary event:", summary);

            setOpenPrice(summary.dayOpenPrice);

            setTradeMsg({
              change: summary.dayOpenPrice - summary.prevDayClosePrice,
              changePercent:
                (summary.dayOpenPrice - summary.prevDayClosePrice) /
                summary.dayOpenPrice,
              price: summary.dayOpenPrice,
            } as ITradeEvent);
          }

          break;
        }
        case "Trade": {
          if (event.eventSymbol === "/ES:XCME") {
            const trade = event as ITradeEvent;
            //console.log("Trade event:", trade);

            setTradeMsg({
              change: trade.change,
              changePercent: trade.change / trade.price,
              price: trade.price,
            } as ITradeEvent);
          }

          break;
        }
        default:
      }
    },
    [openPrice, tradeMsg.change, tradeMsg.changePercent]
  );

  useEffect(() => {
    // eslint-disable-next-line
    let _messages = messages$.subscribe(streamingEventHandler);

    return () => {
      // TODO: Cleanup?
      //_messages.unsubscribe();
    };

    // eslint-disable-next-line
  }, []);

  return (
    <ThemeProvider theme={appTheme}>
      <Grid
        container
        spacing={0}
        rowGap={1}
        className={"symbol-last-price-change-display"}
      >
        <Grid xs={12} sm={3} lg={3} xl={3}>
          <RenderSymbol text="/ES" />
        </Grid>
        <Grid xs={6} sm={5} lg={5} xl={5}>
          <TitleValueDisplay
            align="right"
            title="Last"
            titleSize="xs"
            value={formatDollarsCents(Number(tradeMsg.price).toFixed(2))}
            valueColor={tradeMsg.change < 0 ? "red" : "green"}
            valueSize="l"
            width={50}
          />
        </Grid>
        <Grid xs={3} sm={2} lg={2} xl={2}>
          <TitleValueDisplay
            align="right"
            title="Day Chg"
            titleSize="xs"
            value={`${tradeMsg.change > 0 ? "+" : ""}${tradeMsg.change.toFixed(
              2
            )}`}
            valueColor={tradeMsg.change < 0 ? "red" : "green"}
            valueSize="s"
            width={50}
          />
        </Grid>
        <Grid xs={3} sm={2} lg={2} xl={2}>
          <TitleValueDisplay
            align="right"
            title="% Chg"
            titleSize="xs"
            value={`${tradeMsg.changePercent > 0 ? "+" : ""}${(
              tradeMsg.changePercent * 100
            ).toFixed(2)}%`}
            valueColor={tradeMsg.change < 0 ? "red" : "green"}
            valueSize="s"
            width={50}
          />
        </Grid>
        <Grid xs={12} sm={12} lg={12} xl={12}>
          <RenderDelayedDataMsg />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default SymbolLastPriceChangeDisplay;
