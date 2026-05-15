/**
 * Storybook drop-in for `@stripe/react-stripe-js`.
 *
 * The real package mounts an iframe served from `js.stripe.com` for every
 * `<CardNumberElement>` / `<CardExpiryElement>` / `<CardCvcElement>`. Loading
 * that inside Storybook (a) requires network egress, (b) drags in a real
 * publishable key, and (c) ties the story canvas to whatever the live Stripe
 * test environment is doing.
 *
 * This module is wired up via a Vite alias in `.storybook/main.ts`, so every
 * import of `@stripe/react-stripe-js` inside a story (or any component
 * rendered by a story) resolves to the exports below at runtime. TypeScript
 * resolution is unchanged — consumers still see the real Stripe types via
 * the installed package, which keeps the production code type-safe while
 * stories run against this mock.
 *
 * The mock satisfies the surface our codebase actually touches:
 *
 *   - `<Elements>` — context provider that hands out a synchronous mock
 *     `Stripe` + `Elements` pair regardless of what's passed for `stripe`.
 *   - `useStripe()` / `useElements()` — return the mocks from context.
 *   - `<CardNumberElement>` etc. — render a styled placeholder div so
 *     reviewers see the form layout (no iframe, no real card input).
 *
 * Stories that want to drive `createPaymentMethod` errors override the
 * Stripe instance per-render via `<Elements stripe={...}>`.
 */

import { createContext, useContext, type ReactNode } from "react";

export interface MockStripeError {
  message: string;
  type?: string;
  code?: string;
}

export interface MockPaymentMethod {
  id: string;
  card: {
    last4: string;
    exp_month: number;
    exp_year: number;
    brand?: string;
  };
}

export interface MockStripe {
  createPaymentMethod: (options: { type: "card"; card: unknown }) => Promise<{
    paymentMethod?: MockPaymentMethod;
    error?: MockStripeError;
  }>;
}

export interface MockElementsInstance {
  getElement: (component: unknown) => unknown;
}

interface StripeContextValue {
  stripe: MockStripe | null;
  elements: MockElementsInstance | null;
}

const StripeContext = createContext<StripeContextValue>({
  stripe: null,
  elements: null,
});

// Default mock Stripe — every `createPaymentMethod` call resolves to a
// realistic Visa test-card payload. Stories that need a different outcome
// pass their own `stripe={...}` to `<Elements>`.
export const defaultMockStripe: MockStripe = {
  createPaymentMethod: async () => ({
    paymentMethod: {
      id: "pm_storybook_4242",
      card: {
        last4: "4242",
        exp_month: 12,
        exp_year: 2030,
        brand: "visa",
      },
    },
  }),
};

const defaultMockElements: MockElementsInstance = {
  getElement: () => ({ __mockElement: true }),
};

// Helper exported for stories that want a Stripe instance that fails
// `createPaymentMethod` with a specific message.
export const makeFailingStripe = (message: string): MockStripe => ({
  createPaymentMethod: async () => ({
    error: { message, type: "card_error" },
  }),
});

interface ElementsProps {
  children?: ReactNode;
  // `stripe` is typed loosely on purpose — production callers pass a
  // `Promise<Stripe | null>` from `loadStripe` while stories may pass our
  // `MockStripe` directly. The mock always renders synchronously with
  // either the supplied stripe (if it looks like our MockStripe) or the
  // default mock.
  stripe?: unknown;
  // Real Elements supports an `options` prop too; we accept and ignore.
  options?: unknown;
}

const looksLikeMockStripe = (value: unknown): value is MockStripe =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as { createPaymentMethod?: unknown }).createPaymentMethod === "function";

export const Elements = ({ children, stripe }: ElementsProps) => {
  const resolvedStripe: MockStripe = looksLikeMockStripe(stripe) ? stripe : defaultMockStripe;
  return (
    <StripeContext.Provider value={{ stripe: resolvedStripe, elements: defaultMockElements }}>
      {children}
    </StripeContext.Provider>
  );
};

export const useStripe = (): MockStripe | null => useContext(StripeContext).stripe;
export const useElements = (): MockElementsInstance | null => useContext(StripeContext).elements;

// Visual placeholder for the card-input slots. Real Stripe renders an
// iframe with the actual input; the mock renders a styled div using the
// caller's `options.style.base` so the surrounding form still looks
// correct in dark/light mode.
interface CardElementProps {
  options?: {
    style?: {
      base?: {
        color?: string;
        fontSize?: string;
        letterSpacing?: string;
      };
    };
  };
}

const makeCardField = (placeholder: string, dataTestId: string) => {
  const Component = ({ options }: CardElementProps) => {
    const base = options?.style?.base ?? {};
    return (
      <div
        data-testid={dataTestId}
        style={{
          width: "100%",
          minHeight: 28,
          paddingBlock: 2,
          color: base.color ?? "white",
          fontSize: base.fontSize ?? "18px",
          letterSpacing: base.letterSpacing ?? "0.025em",
          opacity: 0.55,
          fontFamily: "system-ui, -apple-system, sans-serif",
          pointerEvents: "none",
        }}>
        {placeholder}
      </div>
    );
  };
  Component.displayName = `Mock(${dataTestId})`;
  return Component;
};

export const CardNumberElement = makeCardField("4242 4242 4242 4242", "mock-card-number");
export const CardExpiryElement = makeCardField("MM / YY", "mock-card-expiry");
export const CardCvcElement = makeCardField("CVC", "mock-card-cvc");
