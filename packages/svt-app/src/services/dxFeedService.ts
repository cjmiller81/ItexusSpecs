//import { ITimeSeriesEvent } from "@dxfeed/api"
import { useMutation } from "react-query"
import { buildPositionSymbol } from "../utils"
import { Position } from "./useACF"
import { getDxFeedAccessToken } from "../utils"

/*
interface DXFeedInputs {
    positions: Position[]
    handler: (event: ITimeSeriesEvent) => void
}
*/

/*
const feed = new Feed()
console.log('Connecting to DxFeed...')
feed.setAuthToken(getDxFeedAccessToken().toString())
feed.connect('wss://boca.dxfeed.com/cloudnine-delayed/cometd')
*/

/**
 * @description Connect to DxFeed's WebSocket and subscribe to symbol data streams.
 *
 * @see https://tools.dxfeed.com/webservice/rest-demo.jsp
 * @see https://kb.dxfeed.com/en/data-access/rest-api.html
 * @see https://symbol-lookup.dxfeed.com/
 */
/*
export function useDxFeed({ positions, handler }: DXFeedInputs) {
    let [feedIsConnected, setFeedIsConnected] = useState<boolean>(false)
    let lastPriceUpdate2 = useRef(Date.now())

    const wrapHandler = useCallback((event: ITimeSeriesEvent) => {
        //console.log("called wrapHandler:", lastPriceUpdate2.current);
        //console.log(Date.now() - lastPriceUpdate2.current);

        // TODO: Hack to throttle price updates.
        // TODO: This is off (`true`) right now.
        if (false && Date.now() - lastPriceUpdate2.current > 1000) {
            lastPriceUpdate2.current = Date.now();
            //console.log("send event to handler:", event);
            return handler(event);
        }

        return;
    }, [lastPriceUpdate2, handler]);

    let formattedSymbols = positions
        .filter(position => (position.is_valid_symbol && (position.trade_type !== "shares" ? position.is_valid_option : true)))
        .reduce<string[]>((formattedArray, position) => {
            let greekFormatted = buildPositionSymbol(position)

            if (formattedArray.indexOf(greekFormatted) === -1) {
                formattedArray.push(greekFormatted)
            }

            if (position.trade_type !== "shares" && formattedArray.indexOf(buildPositionSymbol(position, true)) === -1) {
                formattedArray.push(buildPositionSymbol(position, true))
            }

            return formattedArray
        }, (positions.length > 0 ? ["SPY"] : []) as string[])

    let formattedCandleSymbols = positions
        .filter(position => (position.is_valid_symbol && (position.trade_type !== "shares" ? position.is_valid_option : true)))
        .reduce<string[]>((formattedArray, position) => {
            let greekFormatted = buildPositionSymbol(position)
            let candleFormatted = `${greekFormatted}{=1m}`

            if (formattedArray.indexOf(candleFormatted) === -1) {
                formattedArray.push(candleFormatted)
            }

            return formattedArray
        }, (positions.length > 0 ? ["SPY{=1m}"] : []) as string[])

    // React will only re-run this effect if the values within the dependency array change
    // The dependency array is the second argument to `useEffect`
    // We want the DX Feed to re-subscribe whenever one of our symbols changes, so we are
    // reducing our positions down to a serialized string of symbols.
    let serializedSymbols = formattedSymbols.join("")
    let serializedCandleSymbols = formattedCandleSymbols.join("")

    useEffect(() => {
        setFeedIsConnected(true) // Tell React state that we're connected

        if (!feed.endpoint.isConnected()) {
            console.log('Reconnecting to DxFeed...')
            feed.setAuthToken(getDxFeedAccessToken().toString())
            feed.connect('wss://boca.dxfeed.com/cloudnine-delayed/cometd')
        }

        return () => {
            // Don't really need to do anything here...
        }
    }, [serializedSymbols, serializedCandleSymbols])

    // Once connected, subscribe to the symbols in the positions
    useEffect(() => {
        if (feedIsConnected) {
            let unsubscribe = feed.subscribe(
                // TODO: DxFeed's Profile event does not have Beta yet. Working with their support on this still.
                // TODO: Skipping Trade Event for now.
                //[EventType.Trade, EventType.Greeks, EventType.Profile, EventType.Quote], //Do we need `EventType.Summary` ???
                [EventType.Greeks, EventType.Quote],
                //['IBM','NFLX'],
                formattedSymbols,
                // TODO: Hack to throttle price updates.
                //handler
                wrapHandler
            )

            return () => {
                unsubscribe()
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [feedIsConnected, serializedSymbols])
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ This effects returned function will be run if the dependency array values change
    // We can be assured that if a symbol changes, the serialized symbols will also change, causing an unsubscribe
    // The effect is then re-run with the latest data, causing us to subscribe with the newest symbols

    // Candle symbols need the `{=1m}` postfix added and subscribed to using `feed.subscribeTimeSeries()`.
    useEffect(() => {
        // TODO: Disabling Candle support for now.
        if (false && feedIsConnected) {
            let unsubscribeTimeSeries = feed.subscribeTimeSeries<ITimeSeriesEvent>(
                [EventType.Candle],
                // Symbol for `EventType.Candle` needs the `{=1m}` postfix to work.
                //['IBM{=1m}','NFLX{=1m}'],
                formattedCandleSymbols,
                Math.round((new Date()).getTime() / 1000) - 600,
                // TODO: Hack to throttle price updates.
                //handler
                wrapHandler
            )

            return () => {
                unsubscribeTimeSeries()
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [feedIsConnected, serializedCandleSymbols])
}
*/

interface Callbacks {
    onError: (res: any) => void
    onSuccess: (res: any) => void
}

async function callWebService(events: Array<string>, symbols: Array<string>, timeout?: Number) {
    // let url = new URL('https://tools.dxfeed.com/webservice/rest/events.json')
    let url = new URL('https://boca.dxfeed.com/cloudnine-delayed/rest/events.json')

    if (events.length > 0) {
        url.searchParams.append('events', events.toString())
    }

    if (symbols.length > 0) {
        url.searchParams.append('symbols', symbols.toString())
    }

    if (timeout) {
        url.searchParams.append('timeout', timeout.toString())
    }

    url.searchParams.append('access_token', getDxFeedAccessToken().toString())

    let response = await fetch(url, {
        method: "GET",
    })

    return response.json()
}

export function useValidateOptionSymbol(callbacks?: Callbacks) {
    const validateSymbol = useMutation(
        async (position: Position) => {
            let res = await callWebService(['Quote'], [buildPositionSymbol(position)])

            if (res.status === "TIMED_OUT") {
                return { ...position, is_valid_symbol: false, error: "Option not found!" }
            }

            return { ...position, is_valid_symbol: true, error: null }
        },
        {
            onSuccess: (position: Position) => {
                // DxFeed will actually send `"status": "TIMED_OUT"` if any of the `events` fail,
                // but `res` will still include any successful `events` reponses. May still want
                // to respond with a success here depending one what events were passed.
                if (position.is_valid_symbol) {
                    return callbacks?.onSuccess(position)
                }

                return callbacks?.onError(position)
            },
            onError: (err: any) => {
                callbacks?.onError(err)
            }
        }
    )

    return validateSymbol
}

export function useValidateSymbol(callbacks?: Callbacks) {
    const validateSymbol = useMutation(
        async (position: Position) => {
            let symbol = position.symbol

            if (position.symbol.indexOf("/") === 0) {
                symbol = buildPositionSymbol(position, true)
            }

            let res = await callWebService(['Quote'], [symbol])

            if (res.status === "TIMED_OUT") {
                return { ...position, is_valid_symbol: false, error: "Symbol not found!" }
            }

            return { ...position, is_valid_symbol: true, error: null }
        },
        {
            onSuccess: (position: Position) => {
                // DxFeed will actually send `"status": "TIMED_OUT"` if any of the `events` fail,
                // but `res` will still include any successful `events` reponses. May still want
                // to respond with a success here depending one what events were passed.
                if (position.is_valid_symbol) {
                    return callbacks?.onSuccess(position)
                }

                return callbacks?.onError(position)
            },
            onError: (err: any) => {
                callbacks?.onError(err)
            }
        }
    )

    return validateSymbol
}

export function useSymbolsCandle(callbacks: Callbacks) {
    const symbolCandle = useMutation(
        async (symbol: string) => {
            return await callWebService(['Candle'], [symbol])
        },
        {
            onSuccess: (res: any) => {
                // DxFeed will actually send `"status": "TIMED_OUT"` if any of the `events` fail,
                // but `res` will still include any successful `events` reponses. May still want
                // to respond with a success here depending one what events were passed.
                if (res.status === "TIMED_OUT") {
                    callbacks.onError("Not found")
                }

                callbacks.onSuccess(res)
            },
            onError: (err: any) => {
                callbacks.onError(err)
            }
        }
    )

    return symbolCandle
}

export function useOptionSymbolsGreeks(callbacks: Callbacks) {
    const symbolGreeks = useMutation(
        async (symbol: string) => {
            return callWebService(['Greeks'], [symbol])
        },
        {
            onSuccess: (res: any) => {
                // DxFeed will actually send `"status": "TIMED_OUT"` if any of the `events` fail,
                // but `res` will still include any successful `events` reponses. May still want
                // to respond with a success here depending one what events were passed.
                if (res.status === "TIMED_OUT") {
                    callbacks.onError("Not found")
                }

                callbacks.onSuccess(res)
            },
            onError: (err: any) => {
                callbacks.onError(err)
            }
        }
    )

    return symbolGreeks
}

export function useSymbolsProfile(callbacks: Callbacks) {
    const symbolProfile = useMutation(
        async (symbol: string) => {
            return callWebService(['Profile'], [symbol])
        },
        {
            onSuccess: (res: any) => {
                // DxFeed will actually send `"status": "TIMED_OUT"` if any of the `events` fail,
                // but `res` will still include any successful `events` reponses. May still want
                // to respond with a success here depending one what events were passed.
                if (res.status === "TIMED_OUT") {
                    callbacks.onError("Not found")
                }

                callbacks.onSuccess(res)
            },
            onError: (err: any) => {
                callbacks.onError(err)
            }
        }
    )

    return symbolProfile
}

export function useSymbolsQuote(callbacks: Callbacks) {
    const symbolQuote = useMutation(
        async (symbol: string) => {
            return callWebService(['Quote'], [symbol])
        },
        {
            onSuccess: (res: any) => {
                // DxFeed will actually send `"status": "TIMED_OUT"` if any of the `events` fail,
                // but `res` will still include any successful `events` reponses. May still want
                // to respond with a success here depending one what events were passed.
                if (res.status === "TIMED_OUT") {
                    callbacks.onError("Not found")
                }

                callbacks.onSuccess(res)
            },
            onError: (err: any) => {
                callbacks.onError(err)
            }
        }
    )

    return symbolQuote
}

export function useSymbolsSummary(callbacks: Callbacks) {
    const symbolSummary = useMutation(
        async (symbol: string) => {
            return callWebService(['Summary'], [symbol])
        },
        {
            onSuccess: (res: any) => {
                // DxFeed will actually send `"status": "TIMED_OUT"` if any of the `events` fail,
                // but `res` will still include any successful `events` reponses. May still want
                // to respond with a success here depending one what events were passed.
                if (res.status === "TIMED_OUT") {
                    callbacks.onError("Not found")
                }

                callbacks.onSuccess(res)
            },
            onError: (err: any) => {
                callbacks.onError(err)
            }
        }
    )

    return symbolSummary
}
