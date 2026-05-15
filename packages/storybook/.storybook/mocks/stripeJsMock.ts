/**
 * Storybook drop-in for `@stripe/stripe-js`.
 *
 * Aliased from `.storybook/main.ts`. Production code does:
 *
 *     import { loadStripe } from "@stripe/stripe-js";
 *     const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
 *
 * Inside Storybook we don't want to hit `js.stripe.com`, so `loadStripe`
 * resolves to the same in-process mock Stripe instance the React mock
 * uses. The resulting promise is what gets passed to `<Elements
 * stripe={stripePromise}>` — our `<Elements>` mock looks at the value and
 * either uses it directly or falls back to its default mock if it's still
 * pending.
 */

import { defaultMockStripe, type MockStripe } from "./stripeMock";

export const loadStripe = async (_publishableKey?: string | null, _options?: unknown): Promise<MockStripe | null> => {
  // Mirror the real loadStripe behaviour for an obviously-empty key — return
  // `null` so consumers' falsy-check branches still fire if a story wants to
  // exercise them.
  if (!_publishableKey) return null;
  return defaultMockStripe;
};
