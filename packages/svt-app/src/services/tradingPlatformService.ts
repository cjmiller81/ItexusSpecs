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
  entryOrderStatus:	OrderStatus
  entryOrderSymbol:	string | null
  exitOrderId:	string | null
  exitOrderStatus:	OrderStatus
  exitOrderSymbol:	string | null
  exchangeUsername: string
  accountNumber:	string | null
  riskTolerance:	IvlRiskTolerance
  capitalAllocation:	number
  capitalAllocationNext: number
  contractQty:	number | null
  closingOnly: boolean
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
          capitalAllocation: accountConnect.capitalAllocation,
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
