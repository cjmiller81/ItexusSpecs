import { useMutation, useQuery, useQueryClient } from "react-query"
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

export interface Position {
	id: string
	symbol: string
	quantity?: string
	trade_type?: "options" | "shares"
	trade_price?: string
	mark_price: string
	mark_price_prev: string
	underlying_mark_price: string | null
	strike_price?: string
	call_put?: "call" | "put"
	date_entered: string
	expiration: string
	is_valid_symbol: boolean
	is_valid_option: boolean
	error: string | null
	mode: "edit" | "view"
	option_delta: string | null
	beta: string | null
	underlying_beta: string | null
	spy_mark_price: string | null
}

export enum HealthToolType {
	LongStockValue = "long_stock_value",
	NotionalExposure = "notional_exposure",
	ExtrinsicAnnualized = "extrinsic_annualized",
	BetaWtdDelta = "beta_wtd_delta",
	PremiumRatio = "premium_ratio"
}

export interface TradingPlanSetting {
	health_tool_type: HealthToolType,
	health_tool_title: string,
	level_max: number,
	level_75: number,
	level_mid: number,
	level_25: number,
	level_min: number,
	suffix_symbol: string,
}

interface Callbacks {
	onSuccess: (res: any) => void
}

export function useACF(callbacks?: Callbacks) {
	const queryClient = useQueryClient()

	// This will only run when NODE_ENV is `development`.
	useQuery(
		"auth",
		async () => {
			var headers = new Headers()
			headers.append("Content-Type", "application/json")
			var body = JSON.stringify({
				// Use conditional so .env values do not end up in production build.
				username: process.env.NODE_ENV === "development" ? process.env.REACT_APP_SVT_USER : "",
				password: process.env.NODE_ENV === "development" ? process.env.REACT_APP_SVT_PASS : "",
			})

			var requestOptions = {
				method: "POST",
				headers,
				body,
				redirect: "follow" as RequestRedirect,
			}

			let response = await fetch(`${wp_api_settings.apiRootUrl}/api-bearer-auth/v1/login`, requestOptions)

			return response.json()
		},
		{
			// Fetch the test users' token only in development if we don't already have one in localStorage
			enabled: process.env.NODE_ENV === "development" && window.localStorage.getItem("access_token") === null,
			onSuccess: (data) => {
				if (data.access_token) {
					window.localStorage.setItem("access_token", data.access_token)
					window.localStorage.removeItem("reauthing")
					window.localStorage.setItem("wp_user_id", data.wp_user.ID)
					wp_api_settings.nonce = data.access_token
					wp_api_settings.userId = data.wp_user.ID
				}
			},
		}
	)

	return useQuery(
		"positions",
		async () => {
			let response = await fetch(`${wp_api_settings.apiRootUrl}/wp/v2/users/${wp_api_settings.userId}`, {
				method: "GET",
				headers: {
					development: {
						Authorization: `Bearer ${wp_api_settings.nonce}`,
					},
					production: {
						"X-WP-Nonce": wp_api_settings.nonce || "",
					},
				}[process.env.NODE_ENV as "development" | "production"],
				...(process.env.NODE_ENV === "production" && {
					mode: "cors",
					credentials: "same-origin",
					redirect: "follow",
					referrerPolicy: "no-referrer",
				}),
			})

			return response.json()
		},
		{
			retry: false,
			refetchOnReconnect: false,
			refetchIntervalInBackground: false,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			enabled: localStorage.getItem("reauthing") === null,
			onSuccess: (res) => {
				if (res.code === "api_bearer_auth_not_logged_in" && localStorage.getItem("reauthing") === null) {
					wp_api_settings.nonce = null
					localStorage.setItem("reauthing", "true")
					localStorage.removeItem("access_token")
					queryClient.invalidateQueries("auth")
					queryClient.invalidateQueries("positions")

					return
				}

				if (!res.acf) {
					res.acf = {
						current_account_value: 0,
						user_position: [],
						user_trading_plan: 30708
					}
				}

				if (res.acf.current_account_value === null) {
					res.acf.current_account_value = 10000
				}

				if (res.acf.user_position === null) {
					res.acf.user_position = []
				}

				if (res.acf.user_trading_plan === null) {
					res.acf.user_trading_plan = 30708
				}

				callbacks?.onSuccess(res)
			},
		}
	)
}

export function useTradePlanACF(callbacks?: Callbacks) {
	const queryClient = useQueryClient()

	// This will only run when NODE_ENV is `development`.
	useQuery(
		"tradeplanauth",
		async () => {
			var headers = new Headers()
			headers.append("Content-Type", "application/json")
			var body = JSON.stringify({
				// Use conditional so .env values do not end up in production build.
				username: process.env.NODE_ENV === "development" ? process.env.REACT_APP_SVT_USER : "",
				password: process.env.NODE_ENV === "development" ? process.env.REACT_APP_SVT_PASS : "",
			})

			var requestOptions = {
				method: "POST",
				headers,
				body,
				redirect: "follow" as RequestRedirect,
			}

			let response = await fetch(`${wp_api_settings.apiRootUrl}/api-bearer-auth/v1/login`, requestOptions)

			return response.json()
		},
		{
			// Fetch the test users' token only in development if we don't already have one in localStorage
			enabled: process.env.NODE_ENV === "development" && window.localStorage.getItem("access_token") === null,
			onSuccess: (data) => {
				if (data.access_token) {
					window.localStorage.setItem("access_token", data.access_token)
					window.localStorage.removeItem("reauthing")
					window.localStorage.setItem("wp_user_id", data.wp_user.ID)
					wp_api_settings.nonce = data.access_token
					wp_api_settings.userId = data.wp_user.ID
				}
			},
		}
	)

	return useMutation(
		"tradeplan",
		async (tradePlanId: number) => {
			let response = await fetch(`${wp_api_settings.apiRootUrl}/wp/v2/ivl-trade-plans/${tradePlanId}`, {
				method: "GET",
				headers: {
					development: {
						Authorization: `Bearer ${wp_api_settings.nonce}`,
					},
					production: {
						"X-WP-Nonce": wp_api_settings.nonce || "",
					},
				}[process.env.NODE_ENV as "development" | "production"],
				...(process.env.NODE_ENV === "production" && {
					mode: "cors",
					credentials: "same-origin",
					redirect: "follow",
					referrerPolicy: "no-referrer",
				}),
			})

			return response.json()
		},
		{
			retry: false,
			onSuccess: (res) => {
				if (res.code === "api_bearer_auth_not_logged_in" && localStorage.getItem("reauthing") === null) {
					wp_api_settings.nonce = null
					localStorage.setItem("reauthing", "true")
					localStorage.removeItem("access_token")
					queryClient.invalidateQueries("tradeplanauth")
					queryClient.invalidateQueries("tradeplan")

					return
				}

				if (!res.acf) {
					res.acf = {
						ivl_account_size: "smallest",
						ivl_trading_plan_method: "Moderate Growth",
						ivl_trading_plan_pro: false,
						trading_plan_settings: [],
					}
				}

				if (res.acf.ivl_account_size === null) {
					res.acf.ivl_account_size = "smallest"
				}

				if (res.acf.ivl_trading_plan_method === null) {
					res.acf.ivl_trading_plan_method = "Moderate Growth"
				}

				if (res.acf.ivl_trading_plan_pro === null) {
					res.acf.ivl_trading_plan_pro = false
				}

				if (res.acf.trading_plan_settings === null) {
					res.acf.trading_plan_settings = []
				}

				res.acf.trading_plan_title = `${res.title.rendered} - ${res.acf.ivl_account_size.toUpperCase()} - ${res.acf.ivl_trading_plan_method.toUpperCase()}`

				callbacks?.onSuccess(res)
			},
		}
	)
}

interface AdvancedCustomFields {
	user_position?: Position[]
	current_account_value?: number
}

export function useACFMutation(callbacks?: Callbacks) {
	const postACF = useMutation(
		async (acf: AdvancedCustomFields) => {
			let response = await fetch(`${wp_api_settings.apiRootUrl}/wp/v2/users/${wp_api_settings.userId}`, {
				method: "POST",
				headers: {
					development: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${wp_api_settings.nonce}`,
					},
					production: {
						"Content-Type": "application/json",
						"X-WP-Nonce": wp_api_settings.nonce || "",
					},
				}[process.env.NODE_ENV as "development" | "production"],
				body: JSON.stringify({
					acf
				}),
				...(process.env.NODE_ENV === "production" && {
					mode: "cors",
					credentials: "same-origin",
					redirect: "follow",
					referrerPolicy: "no-referrer",
				}),
			})

			return response.json()
		},
		{
			onSuccess: (res) => {
				callbacks?.onSuccess(res)
			},
		}
	)

	return postACF
}
