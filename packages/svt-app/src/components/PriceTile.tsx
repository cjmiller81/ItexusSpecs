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
    //console.log('PriceValue useMemo msg$ called: ', props.symbol);
    const [_useMessages, msg$] = bind(messagesChange$.pipe(filter(x => x.eventSymbol === props.symbol)),);
    return msg$;
  }, [props.symbol]);

  let symbolSub = useMemo<ISymbolSub>(():ISymbolSub => {
    //console.log('PriceValue useMemo ISymbolSub called: ', props.symbol);
    return {
      parentId: props.parentId,
      symbol: props.symbol,
    }
  }, [props]);

  useEffect(() => {
    //console.log('PriceValue useEffect called: ', props.symbol);
    let _sub = messages$.subscribe(e => {
      setMsg(e);
    });
    setSymbolSub(symbolSub);

    return () => {
      //_sub.unsubscribe();
      //console.log('PriceValue useEffect return called: ', props.symbol);
    };
  }, [symbolSub]);

  useEffect(() => {
    //console.log('PriceValue useEffect init called: ', props.symbol);

    return () => {
      //sub.unsubscribe();
      //console.log('PriceValue useEffect init return called: ', props.symbol);
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
