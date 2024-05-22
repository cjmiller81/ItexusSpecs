import { useMutation } from "react-query"
import { WordpressApiSettings } from "../types"

window.localStorage.removeItem("reauthing")
var wp_api_settings: WordpressApiSettings = window.wpApiReactSettings

if (process.env.NODE_ENV === "development") {
  wp_api_settings = {
    accessToken: process.env.REACT_APP_SVT_BACKEND_API_ACCESSS_TOKEN as string,
    expiresAt: 2007736838, // 2033-08-15
    apiRootUrl: process.env.REACT_APP_SVT_WORDPRESS_API_URL as string,
    // In prod, the nonce is available, but in dev we have to authenticate with the /login endpoint and store the returned jwt in nonce
    nonce: window.localStorage.getItem("access_token"),
    epdCustomerId: "", // Test Customer Id
    stripeCustomerId: "cus_J6VBWbuAuQ4LBP", // Test Customer Id
    userId: window.localStorage.getItem("wp_user_id"),
  }
}

export enum IvlRiskTolerance {
  High, Medium, Low
}
export enum OrderStatus {
  Submitted, Working, Partial, Filled, PendingCancel, Error, FilledPartiallyAndCancelled, Canceled, Undefined
}

export interface ExchangePosition {
  username: string
  accountNumber: string
  amount: number
  amountFilled: number
  averagePrice: number
  fees: number
  direction: string
  instruction: string
  liquidationPrice: number
  leverage: number
  lastPrice: number
  marketSymbol: string
  status: string,
  timeStamp: string | Date
}

export interface ExchangeAccount {
  exchangeUsername: string
  accountBalance: number
  accountName: string | null
  accountNumber: string
  authorityLevel: string | null
  isClosed: boolean
  isFuturesApproved: boolean
  isMargin: boolean
  isPrimary: boolean
  suitableOptionsLevel: string | null
}

export interface TastytradeAccountConnect {
  login: string
  password:	string | null
  rememberToken: string | null
  epdCustomerId: string | null
  stripeCustomerId: string | null
}

export interface SvtIvlStrategyAccountConnect {
  accountNumber:	string
  riskTolerance: IvlRiskTolerance
  capitalAllocation: number
  capitalAllocationNext: number
  closingOnly: boolean
}

export interface SvtIvlEsStrategySetStatus {
  isStarted: boolean
  entryOrderId:	string | null
  entryOrderStatus:	string | null
  entryOrderSymbol:	string | null
  exitOrderId:	string | null
  exitOrderStatus:	string | null
  exitOrderSymbol:	string | null
  exchangeUsername: string
  accountNumber:	string | null
  riskTolerance:	IvlRiskTolerance
  capitalAllocation:	number
  capitalAllocationStart: number
  capitalAllocationNext: number
  contractQty:	number | null
  closingOnly: boolean
}
export interface CreateFifoStrategyRequest {
  active: boolean,
  exchangeAccountNumber: string | null,
  masterSymbol: string,
  tradeQty: {
    units: number,
    nanos: number
  },
  tradingSymbol: string
}

export interface FifoStrateguListItem {
  active: boolean,
  atrPeriod: number,
  capitalAllocation: number,
  entryOrderId: string,
  hasEntryOrderId: boolean,
  entryOrderStatus: string,
  hasEntryOrderStatus: false,
  exchange: string,
  exchangeAccountNumber: string,
  masterSymbol: string,
  masterSymbolAssetType: string,
  stopOrderId: string,
  hasStopOrderId: boolean,
  stopOrderStatus: string,
  hasStopOrderStatus: boolean,
  targetOrderId: string,
  hasTargetOrderId: boolean,
  targetOrderStatus: string,
  hasTargetOrderStatus: false,
  tradeQty: {
    units: number,
    nanos: number
  },
  tradeSymbol: string,
  tradeSymbolAssetType: string,
  userId: string
}

export interface FifoStrateguListResponse
{
  fifoStrategyList_: FifoStrateguListItem[]
}

interface Callbacks {
  onError: (res: any) => void
  onSuccess: (res: any) => void
}

export function useGetPositionList(callbacks?: Callbacks) {
  return useMutation(
    "positions",
    async (accountNumber: string = '') => {
      let url = new URL(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/positions`)

      let response = await fetch(`${url.toString()}/${accountNumber}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${wp_api_settings.accessToken}`,
        },
      })

      if (response.ok && response.body) {
        return response.json()
      }

      return
    },
    {
      retry: false,
      onSuccess: (res) => {
        callbacks?.onSuccess(res)
      },
      onError: (err: any) => {
        callbacks?.onError(err)
      }
    }
  )
}

export function useUpsertTastytradeConnection(callbacks?: Callbacks) {
  return useMutation(
    "tastytradeConnect",
    async (connection: TastytradeAccountConnect) => {
      let url = new URL(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/account/tastytrade/connect?source=WordPress`)

      const headers = new Headers();
      headers.append("Authorization", `Bearer ${wp_api_settings.accessToken}`);
      headers.append("Content-Type", "application/json");

      let response = await fetch(url.toString(), {
        method: "POST",
        headers: headers,
        body: JSON.stringify(
          {
            ...connection,
            epdCustomerId: wp_api_settings.epdCustomerId,
            stripeCustomerId: wp_api_settings.stripeCustomerId,
          }
        )
      })

      if (response.ok) {
        return true
      }

      throw new Error(response.statusText);
    },
    {
      retry: false,
      onSuccess: (res) => {
        callbacks?.onSuccess(res)
      },
      onError: (err: any) => {
        callbacks?.onError(err)
      }
    }
  )
}

export function useGetAccountList(callbacks?: Callbacks) {
  return useMutation(
    "accounts",
    async () => {
      let url = new URL(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/accounts`)

      let response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${wp_api_settings.accessToken}`,
        },
      })

      if (response.ok && response.body) {
        return response.json()
      }

      return
    },
    {
      retry: false,
      onSuccess: (res) => {
        callbacks?.onSuccess(res)
      },
      onError: (err: any) => {
        callbacks?.onError(err)
      }
    }
  )
}

export function useUpsertIvlAutomation(callbacks?: Callbacks) {
  return useMutation(
    "upsertIvlAutomation",
    async (accountConnect: SvtIvlEsStrategySetStatus) => {
      let url = new URL(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/svt/ivl/es?source=WordPress`)

      const headers = new Headers();
      headers.append("Authorization", `Bearer ${wp_api_settings.accessToken}`);
      headers.append("Content-Type", "application/json");

      let response = await fetch(url.toString(), {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          accountNumber:	accountConnect.accountNumber,
          riskTolerance: accountConnect.riskTolerance,
          capitalAllocation: accountConnect.capitalAllocation ?? 0,
          capitalAllocationNext: accountConnect.capitalAllocationNext,
          closingOnly: accountConnect.closingOnly
        } as SvtIvlStrategyAccountConnect)
      })

      if (response.ok) {
        return true
      }

      throw new Error(response.statusText);
    },
    {
      retry: false,
      onSuccess: (res) => {
        callbacks?.onSuccess(res)
      },
      onError: (err: any) => {
        callbacks?.onError(err)
      }
    }
  )
}

export function useGetIvlAutomationStatus(callbacks?: Callbacks) {
  return useMutation(
    "ivlAutomationStatus",
    async () => {
      let url = new URL(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/svt/ivl/es`)

      let response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${wp_api_settings.accessToken}`,
        },
      })

      if (response.ok && response.body) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json()
        }
      }

      return
    },
    {
      retry: false,
      onSuccess: (res) => {
        callbacks?.onSuccess(res)
      },
      onError: (err: any) => {
        callbacks?.onError(err)
      }
    }
  )
}

export function useStopIvlAutomation(callbacks?: Callbacks) {
  return useMutation(
    "stopIvlAutomation",
    async () => {
      let url = new URL(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/svt/ivl/es/stop`)

      let response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${wp_api_settings.accessToken}`,
        },
      })

      if (response.ok && response.body) {
        return true
      }

      return false
    },
    {
      retry: false,
      onSuccess: (res) => {
        callbacks?.onSuccess(res)
      },
      onError: (err: any) => {
        callbacks?.onError(err)
      }
    }
  )
}

export function useCreateFifoStrategy(callbacks?: Callbacks) {
  return useMutation(
    "createFifoStrategy",
    async (strategy: CreateFifoStrategyRequest) => {
      let url = new URL(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/api/fifoStrategy/tastytrade`)

      const headers = new Headers();
      headers.append("Authorization", `Bearer ${wp_api_settings.accessToken}`);
      headers.append("Content-Type", "application/json");

      let response = await fetch(url.toString(), {
        method: "POST",
        headers: headers,
        body: JSON.stringify(strategy)
      })

      if (response.ok) {
        return true
      }

      throw new Error(response.statusText);
    },
    {
      retry: false,
      onSuccess: (res) => {
        callbacks?.onSuccess(res)
      },
      onError: (err: any) => {
        callbacks?.onError(err)
      }
    }
  )
}

export function useStartStrategy(callbacks?: Callbacks) {
  return useMutation(
    "startStrategy",
    async ({accountNumber, masterSymbol, tradeSymbol}: {accountNumber: string, masterSymbol: string, tradeSymbol: string}) => {
      let url = new URL(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/api/fifoStrategy/tastytrade/${accountNumber}/${masterSymbol}/${tradeSymbol}/start`)

      const headers = new Headers();
      headers.append("Authorization", `Bearer ${wp_api_settings.accessToken}`);
      headers.append("Content-Type", "application/json");

      let response = await fetch(url.toString(), {
        method: "POST",
        headers: headers
      })

      if (response.ok) {
        return true
      }

      throw new Error(response.statusText);
    },
    {
      retry: false,
      onSuccess: (res) => {
        callbacks?.onSuccess(res)
      },
      onError: (err: any) => {
        callbacks?.onError(err)
      }
    }
  )
}

export function useStopStrategy(callbacks?: Callbacks) {
  return useMutation(
    "stopStrategy",
    async ({accountNumber, masterSymbol, tradeSymbol}: {accountNumber: string, masterSymbol: string, tradeSymbol: string}) => {
      let url = new URL(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/api/fifoStrategy/tastytrade/${accountNumber}/${masterSymbol}/${tradeSymbol}/stop`)

      const headers = new Headers();
      headers.append("Authorization", `Bearer ${wp_api_settings.accessToken}`);
      headers.append("Content-Type", "application/json");

      let response = await fetch(url.toString(), {
        method: "POST",
        headers: headers
      })

      if (response.ok) {
        return true
      }

      throw new Error(response.statusText);
    },
    {
      retry: false,
      onSuccess: (res) => {
        callbacks?.onSuccess(res)
      },
      onError: (err: any) => {
        callbacks?.onError(err)
      }
    }
  )
}

export function useDeleteStrategy(callbacks?: Callbacks) {
  return useMutation(
    "deleteStrategy",
    async ({accountNumber, masterSymbol, tradeSymbol}: {accountNumber: string, masterSymbol: string, tradeSymbol: string}) => {
      let url = new URL(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/api/fifoStrategy/tastytrade/${accountNumber}/${masterSymbol}/${tradeSymbol}`)

      const headers = new Headers();
      headers.append("Authorization", `Bearer ${wp_api_settings.accessToken}`);
      headers.append("Content-Type", "application/json");

      let response = await fetch(url.toString(), {
        method: "DELETE",
        headers: headers
      })

      if (response.ok) {
        return true
      }

      throw new Error(response.statusText);
    },
    {
      retry: false,
      onSuccess: (res) => {
        callbacks?.onSuccess(res)
      },
      onError: (err: any) => {
        callbacks?.onError(err)
      }
    }
  )
}

export function useGetFifoStrategy(callbacks?: Callbacks) {
  return useMutation(
    "getFifoStrategy",
    async () => {
      let url = new URL(`${process.env.REACT_APP_SVT_BACKEND_API_URL as string}/api/fifoStrategy/tastytrade`)

      const headers = new Headers();
      headers.append("Authorization", `Bearer ${wp_api_settings.accessToken}`);
      headers.append("Content-Type", "application/json");

      let response = await fetch(url.toString(), {
        method: "GET",
        headers: headers
      })

      const jsonData = await response.json()
      const data = JSON.parse(jsonData);
      return data;
    },
    {
      retry: false,
      onSuccess: (res) => {
        callbacks?.onSuccess(res)
      },
      onError: (err: any) => {
        callbacks?.onError(err)
      }
    }
  )
}