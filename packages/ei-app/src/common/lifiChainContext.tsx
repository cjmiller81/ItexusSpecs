import React, { createContext, useContext, useEffect, useState } from "react";
import appAxios from "@/libs/axios/axios";

export interface LifiChain {
  id: number;
  key: string;
  name: string;
  logoURI: string;
  coin: string;
  mainnet: boolean;
}

export type LifiChainMap = Map<number, LifiChain>;

interface LifiChainContextValue {
  lifiChainMap: LifiChainMap | null;
  isLoading: boolean;
  error: Error | null;
}

const LifiChainContext = createContext<LifiChainContextValue>({
  lifiChainMap: null,
  isLoading: true,
  error: null,
});

export const useLifiChainMap = () => useContext(LifiChainContext);

export const LifiChainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lifiChainMap, setLifiChainMap] = useState<LifiChainMap | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchChains = async () => {
      try {
        const response = await appAxios.get("/api/lifi/chains");
        const map = new Map<number, LifiChain>();
        response.data.chains.forEach((chain: LifiChain) => {
          map.set(chain.id, chain);
        });
        if (isMounted) {
          setLifiChainMap(map);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          setIsLoading(false);
        }
      }
    };
    fetchChains();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <LifiChainContext.Provider value={{ lifiChainMap, isLoading, error }}>
      {children}
    </LifiChainContext.Provider>
  );
};
