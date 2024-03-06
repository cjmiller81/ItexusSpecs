export { };

export interface WordpressApiSettings {
	accessToken: string | null
	expiresAt: number | null
	apiRootUrl: string
	nonce: string | null
	epdCustomerId: string | null
	stripeCustomerId: string | null
	userId: string | null
}

declare global {
	interface Window {
		wpApiReactSettings: WordpressApiSettings;
	}
}
