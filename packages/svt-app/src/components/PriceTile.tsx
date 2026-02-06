import { useEffect, useMemo, useState } from "react";
import { bind } from "@react-rxjs/core";
import { filter } from "rxjs";

import {
  messagesChange$,
  setSymbolSub,
  ISymbolSub,
  IQuoteEvent
} from "../services/dxFeedRx";

function PriceValue(props: { parentId: string, symbol: string }) {
  const [msg, setMsg] = useState<IQuoteEvent>({} as IQuoteEvent);

  const messages$ = useMemo(() => {
    const [_useMessages, msg$] = bind(messagesChange$.pipe(filter(x => x.eventSymbol === props.symbol)),);
    return msg$;
  }, [props.symbol]);

  let symbolSub = useMemo<ISymbolSub>(():ISymbolSub => {
    return {
      parentId: props.parentId,
      symbol: props.symbol,
    }
  }, [props]);

  useEffect(() => {
    let _sub = messages$.subscribe(e => {
      setMsg(e);
    });
    setSymbolSub(symbolSub);

    return () => {
      //_sub.unsubscribe();
    };
  }, [symbolSub]);

  useEffect(() => {

    return () => {
      //sub.unsubscribe();
      //setSymbolUnsub(symbolSub);
    };
  }, []);

  return <>Bid: {msg ? `${msg.eventSymbol}:${msg.bidPrice}` : 0}</>
}

export default function PriceTile(props: { parentId: string, symbol: string }) {
  return (
    <div>
      <PriceValue parentId={ props.parentId } symbol={ props.symbol } />
    </div>
  )
}
