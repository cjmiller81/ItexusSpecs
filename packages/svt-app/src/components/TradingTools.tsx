import {
  //Heading,
  //HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from "@chakra-ui/react"
import Feed, { EventType, ITimeSeriesEvent } from "@dxfeed/api"
import { bind } from "@react-rxjs/core"

import { useEffect, useCallback, useMemo, useRef, useState } from "react"
import { distinctUntilChanged, groupBy, mergeMap, throttleTime } from "rxjs"
import { EffectReducer, useEffectReducer } from "use-effect-reducer"
import { v4 as uuid } from "uuid"

//import CurrentAccountValue from "./CurrentAccountValue"
//import HealthTool from "./HealthTool"
//import Positions from "./Positions"
import TradingMgmtTools from "./TradingMgmtTools"
import "@fontsource/ubuntu/400.css"
import "@fontsource/ubuntu/500.css"
import "@fontsource/ubuntu/700.css"
import { useValidateOptionSymbol, useValidateSymbol } from "../services/dxFeedService"
import { Position, TradingPlanSetting, useACF, useACFMutation } from "../services/useACF"
import { buildPositionSymbol, getDxFeedAccessToken } from "../utils"
import { ISymbolSub, symbolSubChanged$, symbolUnsubChanged$, setMessages, formatPositionSymbols, setSymbolSub, setSymbolUnsub, messagesChange$ } from "../services/dxFeedRx"
import TradeGenerator from "./library/TradeGenerator/TradeGenerator"
import TradeGeneratorOld from "./library/TradeGeneratorOld/TradeGeneratorOld"

// eslint-disable-next-line
const [_useSymbolSub, symbolSub$] = bind(symbolSubChanged$.pipe());
// eslint-disable-next-line
const [_useSymbolUnsub, symbolUnsub$] = bind(symbolUnsubChanged$.pipe());
// eslint-disable-next-line
const [_useMessages, messages$] = bind(messagesChange$.pipe(
  groupBy(priceData => priceData.eventSymbol),
  mergeMap(symbolGroup$ => symbolGroup$.pipe(
    distinctUntilChanged((prev, curr) => {
      return ((+prev.bidPrice) + (((+prev.askPrice) - (+prev.bidPrice)) / 2)) === ((+curr.bidPrice) + (((+curr.askPrice) - (+curr.bidPrice)) / 2))
    }),
    throttleTime(1000 * 10),
  ))
));

const newPosition = (): Position => {
  return {
    id: uuid(),
    symbol: "",
    quantity: "-1",
    trade_type: "options",
    trade_price: "0",
    mark_price: "—",
    mark_price_prev: "",
    underlying_mark_price: null,
    strike_price: "0",
    call_put: "call",
    date_entered: new Date().toISOString().slice(0, 10).replace(/-/g, ""),
    expiration: new Date().toISOString().slice(0, 10).replace(/-/g, ""),
    is_valid_symbol: false,
    is_valid_option: false,
    error: null,
    mode: "edit",
    option_delta: null,
    beta: null,
    underlying_beta: null,
    spy_mark_price: null,
  }
}

type State = {
  current_account_value: number,
  positions: Position[],
  pendingSync: boolean,
  needsSave: boolean,
  trading_plan_settings: Array<any>,
  trading_plan_title: string,
  user_trading_plan: number,
}

type Action =
  | {
      type: "set_trade_type"
      payload: { id: string; trade_type: "shares" | "options"; call_put: "call" | "put" | null }
    }
  | { type: "sync_positions"; payload: { positions: Position[] } }
  | { type: "set_positions"; payload: { positions: Position[] } }
  | { type: "set_trading_plan_settings"; payload: { trading_plan_settings: TradingPlanSetting[], trading_plan_title: string }}
  | { type: "set_user_data"; payload: { user_trading_plan: number, current_account_value: number } }
  | { type: "validate_option_symbol"; payload: { position: Position; key: keyof Position; value: any } }
  | { type: "invalidate_option_symbol"; payload: { position: Position; key: keyof Position; value: any } }
  | { type: "validate_symbol"; payload: { position: Position } }
  | { type: "invalidate_symbol"; payload: { position: Position } }
  | { type: "update_field"; payload: { id: string; index: number; key: keyof Position; value: any } }
  | { type: "clear_pending_sync" }
  | { type: "add_position" }
  | { type: "remove_position"; payload: { index: number } }
  | { type: "set_option_validity"; payload: { id: string; error: string | null; is_valid_option: boolean } }
  | { type: "set_symbol_validity"; payload: { id: string; error: string | null; is_valid_symbol: boolean } }

type Effect =
  | { type: "syncWithWordpress"; positions: Position[] }
  | { type: "validateOptionSymbol"; position: Position }
  | { type: "validateSymbol"; position: Position }

const stateReducer: EffectReducer<State, Action, Effect> = (state, action, exec) => {
  switch (action.type) {
    case "set_positions":
      action.payload.positions.forEach(position => {
        let postitionSymbols:string[] = formatPositionSymbols(position);

        postitionSymbols.forEach(sym => {
          setSymbolSub({
            parentId: position.id,
            symbol: sym,
          });
        });
      })

      return {
        ...state,
        positions: action.payload.positions,
      }

    case "set_user_data":
      return {
        ...state,
        current_account_value: action.payload.current_account_value,
        user_trading_plan: action.payload.user_trading_plan,
      }

    case "set_trading_plan_settings":
      return {
        ...state,
        trading_plan_settings: action.payload.trading_plan_settings,
        trading_plan_title: action.payload.trading_plan_title
      }

    case "validate_option_symbol":
      exec({
        type: "validateOptionSymbol",
        position: {
          ...action.payload.position,
          [action.payload.key]: action.payload.value,
        },
      })

      return state

    case "invalidate_option_symbol": {
      let positions = state.positions.map((position) => {
        return position.id === action.payload.position.id && action.payload.value
          ? {
              ...action.payload.position,
              error: null,
              is_valid_option: false,
              [action.payload.key]: action.payload.value,
            }
          : position
      })

      return {
        ...state,
        positions: positions,
        needsSave: true
      }
    }
    case "validate_symbol":
      exec({
        type: "validateSymbol",
        position: action.payload.position,
      })

      return state

    case "invalidate_symbol": {
      let positions = state.positions.map((position) => {
        return position.id === action.payload.position.id
          ? {
              ...position,
              error: null,
              // onChange, we set this to false, then onBlur, we validate it.
              is_valid_symbol: false,
              symbol: action.payload.position.symbol.toUpperCase(),
            }
          : position
      })

      return {
        ...state,
        positions: positions,
        needsSave: true
      }
    }
    case "set_option_validity": {
      let validatedPositions = state.positions.map((position) => {
        return position.id === action.payload.id
          ? {
              ...position,
              is_valid_option: action.payload.is_valid_option,
              error: action.payload.error,
            }
          : position
      })

      return {
        ...state,
        positions: validatedPositions,
        needsSave: true
      }
    }

    case "set_symbol_validity": {
      let validatedPositions = state.positions.map((position) => {
        return position.id === action.payload.id
          ? {
              ...position,
              is_valid_symbol: action.payload.is_valid_symbol,
              error: action.payload.error,
            }
          : position
      })

      return {
        ...state,
        positions: validatedPositions,
        needsSave: true
      }
    }

    case "set_trade_type":
      var updatedPositions = state.positions.map((position) => {
        return position.id === action.payload.id
          ? {
              ...position,
              id: position.id,
              trade_type: action.payload.trade_type,
              call_put: action.payload.call_put,
            }
          : position
      })

      return {
        ...state,
        positions: updatedPositions,
        needsSave: true
      }

    case "update_field":
      var newPositions = state.positions.map((position) => {
        let prev_mark_price = "";

        if (action.payload.key === "mark_price" && position.mark_price !== "-") {
          prev_mark_price = position.mark_price
        }

        let newPosition = (position.id === action.payload.id)
        ? {
            ...position,
            call_put:
              action.payload.key === "trade_type"
                ? action.payload.value === "shares"
                  ? null
                  : action.payload.value
                : position.call_put,
            [action.payload.key]: ["mark_price"].includes(action.payload.key.toString())
              ? ((position.symbol.indexOf("/") === -1)
                ? parseFloat(action.payload.value).toFixed(2).toString()
                : parseFloat(action.payload.value).toFixed(4).toString()
              )
              : action.payload.value,
          }
        : position

        if (prev_mark_price !== "") {
          newPosition.mark_price_prev = prev_mark_price
        }

        return newPosition
      })

      return {
        ...state,
        positions: newPositions,
        needsSave: (["beta", "mark_price", "option_delta", "spy_mark_price", "underlying_beta", "underlying_mark_price"].indexOf(action.payload.key) === -1) ? true : state.needsSave
      }

    case "clear_pending_sync":
      return {
        ...state,
        pendingSync: false,
        needsSave: false
      }

    case "add_position":
      var positionsAfterAddition = [...state.positions, { ...newPosition() }]
      return {
        ...state,
        positions: positionsAfterAddition,
        needsSave: true
      }

    case "remove_position":
      let removedPosition = [...state.positions].find((_, index) => index === action.payload.index);

      if (removedPosition && removedPosition !== undefined && typeof removedPosition !== 'undefined') {
        let postitionSymbols:string[] = formatPositionSymbols(removedPosition);

        postitionSymbols.forEach(sym => {
          setSymbolUnsub({
            parentId: (removedPosition as Position).id,
            symbol: sym,
          });
        });
      }

      var positionsAfterRemoval = [...state.positions].filter((_, index) => index !== action.payload.index)
      exec({
        type: "syncWithWordpress",
        positions: positionsAfterRemoval,
      })

      return {
        ...state,
        positions: positionsAfterRemoval,
        pendingSync: true
      }

    case "sync_positions":
      let validPositions = state.positions.filter(
        (pos) => pos.is_valid_symbol && (pos.trade_type !== "shares" ? pos.is_valid_option : true)
      )

      validPositions.forEach(position => {
        let postitionSymbols:string[] = formatPositionSymbols(position);

        postitionSymbols.forEach(sym => {
          setSymbolSub({
            parentId: position.id,
            symbol: sym,
          });
        });
      })

      exec({
        type: "syncWithWordpress",
        positions: validPositions,
      })
      return {
        ...state,
        pendingSync: true
      }

    default:
      throw new Error(`Missing case statement in state reducer`)
  }
}

const feed = new Feed();

export default function TradingTools() {
  const symSubs = useRef<ISymbolSub[]>([
    {
      parentId: "svtDefault",
      symbol: "SPY",
    },{
      parentId: "svtDefaultEs",
      symbol: "/ES:XCME",
    }
  ]);
  const symSubsEs = useRef<ISymbolSub[]>([
    {
      parentId: "svtDefaultEs",
      symbol: "/ES:XCME",
    }
  ]);
  const [tabIndex, setTabIndex] = useState<number>(0)
  let unsubscribe = useRef<Function>(() => {});
  let unsubscribeEs = useRef<Function>(() => {});
  let positionsRef = useRef<Position[]>([]);

  useMemo<Feed>(() => {
    if (!feed.endpoint.isConnected()) {
      //feed.connect('wss://tools.dxfeed.com/webservice/cometd');

      feed.setAuthToken(getDxFeedAccessToken().toString());
      feed.connect('wss://boca.dxfeed.com/cloudnine-delayed/cometd');
    }

    return feed;
  }, [])

  const updateDxFeedSubscription = useCallback(() => {
    if (feed.endpoint.isConnected() && symSubs.current.length > 0) {
      unsubscribe.current = feed.subscribe([EventType.Greeks, EventType.Quote], symSubs.current.map(sub => sub.symbol), setMessages);
      unsubscribeEs.current = feed.subscribe([EventType.Candle, EventType.Summary, EventType.Trade], symSubsEs.current.map(sub => sub.symbol), setMessages);
    }
  }, [symSubs, unsubscribe, unsubscribeEs])

  const handleSymbolSub = useCallback((e: ISymbolSub) => {
    if (e.symbol.length > 0 && symSubs.current.findIndex((el) => el.symbol === e.symbol && el.parentId === e.parentId) === -1) {
      let localSymbols = symSubs.current.map(sym => sym);
      localSymbols.push(...[e]);
      symSubs.current = localSymbols;
      updateDxFeedSubscription();
    }
  }, [symSubs, updateDxFeedSubscription])

  const handleSymbolUnsub = useCallback((e: ISymbolSub) => {
    const idx = symSubs.current.findIndex((el) => el.symbol === e.symbol && el.parentId === e.parentId);

    if (e.symbol.length > 0 && idx !== -1) {
      let localSymbols = symSubs.current.map(sym => sym);
      localSymbols.splice(idx, 1);
      symSubs.current = localSymbols;
      updateDxFeedSubscription();
    }
  }, [symSubs, updateDxFeedSubscription])

  //////////////////////////
  // SERVER STATE MANAGEMENT
  //////////////////////////
  useACF({
    onSuccess: (res: { acf: { current_account_value: number, user_position: any, user_trading_plan: number } }) => {
      dispatch({
        type: "set_positions",
        payload: {
          positions: res.acf.user_position.map((position: Position) => ({
            ...position,
            trade_price: typeof position.trade_price !== "undefined" ? parseFloat(position.trade_price).toFixed(2).toString() : undefined,
            is_valid_symbol: true,
            is_valid_option: true,
            error: null,
            beta: "0.5" // TODO
          })),
        },
      })

      dispatch({
        type: "set_user_data",
        payload: {
          current_account_value: res.acf.current_account_value,
          user_trading_plan: res.acf.user_trading_plan,
        },
      })
    },
  })

  const callValidateOptionSymbol = useValidateOptionSymbol({
    onSuccess: (position: Position) => {
      dispatch({
        type: "set_option_validity",
        payload: {
          is_valid_option: true,
          id: position.id,
          error: null,
        },
      })
    },
    onError: (position: Position) => {
      dispatch({
        type: "set_option_validity",
        payload: {
          is_valid_option: false,
          id: position.id,
          error: position.error,
        },
      })
    },
  })

  const callValidateSymbol = useValidateSymbol({
    onSuccess: (position: Position) => {
      dispatch({
        type: "set_symbol_validity",
        payload: {
          is_valid_symbol: true,
          id: position.id,
          error: null,
        },
      })
    },
    onError: (position: Position) => {
      dispatch({
        type: "set_symbol_validity",
        payload: {
          is_valid_symbol: false,
          id: position.id,
          error: position.error,
        },
      })
    },
  })

  const acf = useACFMutation({
    onSuccess: (res: any) => {
      dispatch({
        type: "clear_pending_sync"
      })
    }
  })

  //////////////////////////
  // CLIENT STATE MANAGEMENT
  //////////////////////////
  const [{
    //current_account_value,
    positions,
    //pendingSync,
    //needsSave,
    //trading_plan_settings,
    //trading_plan_title,
    //user_trading_plan
  }, dispatch] = useEffectReducer(
    stateReducer,
    { current_account_value: 10000, positions: [], pendingSync: false, needsSave: false, trading_plan_settings: [], trading_plan_title: "", user_trading_plan: 30708 },
    {
      syncWithWordpress: (state) => {
        return acf.mutate({
          user_position: state.positions.map((position) => {
            let { ...fieldsWeWant } = position
            return fieldsWeWant
          }),
        })
      },
      validateOptionSymbol: (state, effect) => {
        return callValidateOptionSymbol.mutate(effect.position)
      },
      validateSymbol: (state, effect) => {
        return callValidateSymbol.mutate(effect.position)
      },
    }
  )

  useEffect(() => {
    positionsRef.current = positions;
  }, [positions])

  const streamingEventHandler = useCallback((event: ITimeSeriesEvent) => {
    //console.log("event:", event.eventSymbol);
    switch (event.eventType) {
      case "Greeks":
        let matchingOptionPositions = positionsRef.current.filter((pos) => {
          return pos.trade_type !== 'shares' && buildPositionSymbol(pos) === event.eventSymbol
        })

        matchingOptionPositions.forEach((pos, index) => {
          dispatch({
            type: "update_field",
            payload: {
              index: index,
              id: pos?.id || "",
              key: "option_delta",
              value: event.delta,
            },
          })
        })
        break
      case "Profile":
        let matchingProfilePositions = positionsRef.current.filter((pos) => {
          return pos.trade_type !== 'shares' && buildPositionSymbol(pos) === event.eventSymbol
        })

        matchingProfilePositions.forEach((pos, index) => {
          dispatch({
            type: "update_field",
            payload: {
              index: index,
              id: pos?.id || "",
              key: "beta",
              value: event.beta, // TODO: What's this property name?
            },
          })
        })

        let matchingProfileOptionPositions = positionsRef.current.filter((pos) => {
          return pos.trade_type !== 'shares' && pos.symbol === event.eventSymbol
        })

        matchingProfileOptionPositions.forEach((pos, index) => {
          dispatch({
            type: "update_field",
            payload: {
              index: index,
              id: pos?.id || "",
              key: "underlying_beta",
              value: event.beta, // TODO: What's this property name?
            },
          })
        })
        break
      case "Quote":
        if (event.eventSymbol === "SPY") {
          positionsRef.current.forEach((pos, index) => {
            dispatch({
              type: "update_field",
              payload: {
                index: index,
                id: pos?.id || "",
                key: "spy_mark_price",
                value: ((+event.bidPrice) + (((+event.askPrice) - (+event.bidPrice)) / 2))
              },
            })
          })
        }

        let matchingPositions = positionsRef.current.filter((pos) => {
          return buildPositionSymbol(pos) === event.eventSymbol
        })

        matchingPositions.forEach((pos, index) => {
          dispatch({
            type: "update_field",
            payload: {
              index: index,
              id: pos?.id || "",
              key: "mark_price",
              value: ((+event.bidPrice) + (((+event.askPrice) - (+event.bidPrice)) / 2))
            },
          })
        })

        // If the position is an option, when the underlying symbol price update comes in, also set the option posisiton's underlying_mark_price value.
        let matchingUnderlyingPositions = positionsRef.current.filter((pos) => {
          return pos.trade_type !== 'shares' && pos.symbol === event.eventSymbol
        })

        matchingUnderlyingPositions.forEach((pos, index) => {
          dispatch({
            type: "update_field",
            payload: {
              index: index,
              id: pos?.id || "",
              key: "underlying_mark_price",
              value: ((+event.bidPrice) + (((+event.askPrice) - (+event.bidPrice)) / 2))
            },
          })
        })

        break
      // * Consolidated these cases and mapped event type to corresponding value
      case "Candle":
      case "Summary":
      case "Trade": {
        if (event.eventSymbol === "SPY") {
          positionsRef.current.forEach((pos, index) => {
            dispatch({
              type: "update_field",
              payload: {
                index: index,
                id: pos?.id || "",
                key: "spy_mark_price",
                value: {
                  Candle: event.close,
                  Configuration: 0,
                  Greeks: 0,
                  Order: 0,
                  Profile: 0,
                  Quote: 0,
                  Summary: event.dayClosePrice !== "NaN" ? event.dayClosePrice : event.prevDayClosePrice,
                  TheoPrice: 0,
                  TimeAndSale: 0,
                  Trade: event.price,
                  TradeETH: 0,
                  Underlying: 0
                }[event.eventType],
              },
            })
          })
        }

        let matchingPositions = positionsRef.current.filter((pos) => {
          return buildPositionSymbol(pos) === event.eventSymbol
        })

        matchingPositions.forEach((pos, index) => {
          dispatch({
            type: "update_field",
            payload: {
              index: index,
              id: pos?.id || "",
              key: "mark_price",
              value: {
                Candle: event.close,
                Configuration: 0,
                Greeks: 0,
                Order: 0,
                Profile: 0,
                Quote: 0,
                Summary: event.dayClosePrice !== "NaN" ? event.dayClosePrice : event.prevDayClosePrice,
                TheoPrice: 0,
                TimeAndSale: 0,
                Trade: event.price,
                TradeETH: 0,
                Underlying: 0
              }[event.eventType],
            },
          })
        })

        // If the position is an option, when the underlying symbol price update comes in, also set the option posisiton's underlying_mark_price value.
        let matchingUnderlyingPositions = positionsRef.current.filter((pos) => {
          return pos.trade_type !== 'shares' && pos.symbol === event.eventSymbol
        })

        matchingUnderlyingPositions.forEach((pos, index) => {
          dispatch({
            type: "update_field",
            payload: {
              index: index,
              id: pos?.id || "",
              key: "underlying_mark_price",
              value: {
                Candle: event.close,
                Configuration: 0,
                Greeks: 0,
                Order: 0,
                Profile: 0,
                Quote: 0,
                Summary: event.dayClosePrice !== "NaN" ? event.dayClosePrice : event.prevDayClosePrice,
                TheoPrice: 0,
                TimeAndSale: 0,
                Trade: event.price,
                TradeETH: 0,
                Underlying: 0
              }[event.eventType],
            },
          })
        })

        break
      }
      default:
        console.error(`Unhandled eventType of ${event.eventType}`)
    }
  }, [positionsRef, dispatch])

  const handleTabsChange = useCallback((index: number): void => {
    setTabIndex(index)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line
    let _symbolSub = symbolSub$.subscribe(handleSymbolSub);
    // eslint-disable-next-line
    let _symbolUnsub = symbolUnsub$.subscribe(handleSymbolUnsub);
    // eslint-disable-next-line
    let _messages = messages$.subscribe(streamingEventHandler);
    setTabIndex(0)

    return () => {
      // TODO: Cleanup?
      //_symbolSub.unsubscribe();
      //_symbolUnsub.unsubscribe();
      //_messages.unsubscribe();
      //unsubscribe();
      //unsubscribeEs();
      //feed.disconnect();
    };

// eslint-disable-next-line
  }, [])

  return (
    <Tabs index={tabIndex} onChange={handleTabsChange}>
      <TabList>
        {/*
        <Tab _selected={{ color: "white", borderBottomColor: "#116DFD" }} fontSize={["9px", "12px", "16px"]}>Input Positions</Tab>
        <Tab _selected={{ color: "white", borderBottomColor: "#116DFD" }} fontSize={["9px", "12px", "16px"]}>Health Tool</Tab>
        */}
        <Tab _selected={{ color: "white", borderBottomColor: "#116DFD" }} fontSize={["9px", "12px", "16px"]}>Trade Generator</Tab>
        <Tab _selected={{ color: "white", borderBottomColor: "#116DFD" }} fontSize={["9px", "12px", "16px"]}>Trade Management Tools</Tab>
        {/*
        <Tab _selected={{ color: "white", borderBottomColor: "#116DFD" }} fontSize={["9px", "12px", "16px"]}>Trade Generator (BETA)</Tab>
        */}
      </TabList>
      {/*
      <HStack spacing="30px" py="24px" w="full">
        <Heading fontFamily={"body"} size="lg" minWidth={"150px"} noOfLines={1} fontSize={{ base: '12px', sm: '12px', md: '18px', lg: '25px' }} lineHeight="29px">
          Current Account Value:
        </Heading>
        <CurrentAccountValue current_account_value={current_account_value} dispatch={dispatch} />
      </HStack>
      */}
      <TabPanels>
        {/*
        <TabPanel p="0">
          <Positions positions={positions} pendingSync={pendingSync} needsSave={needsSave} dispatch={dispatch} />
        </TabPanel>
        <TabPanel p="0">
          <HealthTool
            current_account_value={current_account_value}
            positions={positions}
            user_trading_plan={user_trading_plan}
            trading_plan_settings={trading_plan_settings}
            trading_plan_title={trading_plan_title}
            dispatch={dispatch} />
        </TabPanel>
        */}
        <TabPanel p="0">
          <TradeGeneratorOld />
        </TabPanel>
        <TabPanel p="0">
          <TradingMgmtTools />
        </TabPanel>
        <TabPanel p="0">
          <TradeGenerator />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
