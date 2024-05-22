"use client"

import { AppStore, appStore } from "@/libs/redux/Store"
// TODO: Build error:
/*
./src/providers/StoreProvider.tsx:30:45
Type error: No overload matches this call.
  Overload 1 of 2, '(props: ProviderProps<UnknownAction>): Provider<UnknownAction>', gave the following error.
    Type 'React.ReactNode' is not assignable to type 'import("C:/Users/Ben/Documents/SVT/ItexusSpecs/node_modules/@types/react-dom/node_modules/@types/react/index").ReactNode'.
      Type 'ReactElement<any, string | JSXElementConstructor<any>>' is not assignable to type 'ReactNode'.
        Property 'children' is missing in type 'ReactElement<any, string | JSXElementConstructor<any>>' but required in type 'ReactPortal'.
  Overload 2 of 2, '(props: ProviderProps<UnknownAction>, context: any): Provider<UnknownAction>', gave the following error.
    Type 'React.ReactNode' is not assignable to type 'import("C:/Users/Ben/Documents/SVT/ItexusSpecs/node_modules/@types/react-dom/node_modules/@types/react/index").ReactNode'.

  28 |   }, [])
  29 |
> 30 |   return <Provider store={storeRef.current}>{children}</Provider>
     |                                             ^
  31 | }
  32 |
*/
//import type { ReactNode } from "react"
import { useEffect, useRef } from "react"
import { setupListeners } from "@reduxjs/toolkit/query"
import { Provider } from "react-redux"

interface Props {
  readonly children: any //ReactNode
}

export const StoreProvider = ({ children }: Props) => {
  const storeRef = useRef<AppStore | null>(null)

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = appStore
  }

  useEffect(() => {
    if (storeRef.current != null) {
      // configure listeners using the provided defaults
      // optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
      const unsubscribe = setupListeners(storeRef.current.dispatch)
      return unsubscribe
    }
  }, [])

  return <Provider store={storeRef.current}>{children}</Provider>
}
