import React from "react";
import { ThemeProvider, createTheme, type Theme } from "@mui/material/styles";
import type { Decorator } from "@storybook/nextjs-vite";

/**
 * Theme extension that makes MUI Dialog/Modal render inline + bounded by the
 * nearest `position: relative` ancestor instead of escaping to the viewport
 * via portal + `position: fixed`.
 *
 * - `MuiModal.defaultProps.disablePortal = true` keeps the modal in the
 *   React tree where it was declared (Dialog extends Modal).
 * - `MuiModal.defaultProps.disableScrollLock = true` stops the Modal from
 *   pinning `<body>` with `overflow: hidden` (and the corresponding
 *   `padding-right` scrollbar-width compensation) when it opens. Without
 *   this, the Docs page itself becomes unscrollable as soon as the first
 *   "open" dialog story mounts, because MUI's `ModalManager` writes that
 *   style straight onto the top-level `document.body` regardless of
 *   `disablePortal` / `container`.
 * - `styleOverrides.root` on both `MuiModal` and `MuiBackdrop` swaps the
 *   default `position: fixed; inset: 0` for `position: absolute; inset: 0`,
 *   so the modal/backdrop fill the wrapping container rather than the
 *   entire viewport.
 */
const modalContainmentOverrides = {
  components: {
    MuiModal: {
      defaultProps: { disablePortal: true, disableScrollLock: true },
      // `as const` keeps the literal "absolute" narrow so the CSSObject
      // overload picks it up (string union, not arbitrary string).
      styleOverrides: { root: { position: "absolute" as const, inset: 0 } },
    },
    MuiBackdrop: {
      styleOverrides: { root: { position: "absolute" as const, inset: 0 } },
    },
  },
} as const;

const extendThemeForBoundedModal = (parent: Theme): Theme => createTheme(parent, modalContainmentOverrides);

/**
 * Wrap a Storybook story in a bounded container so an MUI Dialog/Modal
 * inside renders as a card on the Docs page instead of escaping its
 * `position: fixed` backdrop over the entire page.
 *
 * Applied conditionally: only when `viewMode === "docs"`. On the standalone
 * Story page the dialog renders normally (full-viewport modal) so developers
 * can interact with it at production sizing.
 *
 * Why not the alternative `parameters.docs.story.{ inline: false,
 * iframeHeight }`? That also bounds the modal — by giving each story its own
 * preview iframe — but in Vite dev mode each iframe re-boots the entire
 * Storybook preview runtime (Redux store, MSW worker, every RTK Query API,
 * i18next, the LiFi chain provider, …). On a Docs page with N visible
 * dialog stories that explodes into N × thousands of ES-module requests and
 * 0.5GB+ of dev-mode bundle traffic, with the canvas taking up to a minute
 * to render. The inline `disablePortal` + CSS containment approach below
 * renders the same DOM the regular Story page builds, so the Docs page
 * loads at near-parity speed with non-dialog components.
 *
 * @param height pixels of vertical room to reserve for the bounded modal.
 *   Aim for the natural Dialog content height plus ~32px buffer; the wrapper
 *   uses `overflow: hidden` so anything taller is clipped.
 * @param minWidth optional pixel floor for the bounded modal width. Defaults
 *   to 640px (fits a `maxWidth="sm"` Dialog Paper + its 32px horizontal
 *   margins with a small buffer). Bump this for wider modals (e.g.
 *   `PaymentMethodModal` is 700px → use 760).
 */
export const dialogContainerDecorator = (height: number, minWidth: number = 640): Decorator => {
  // Named function expression so ESLint's `react/display-name` rule is
  // satisfied — the inner closure is treated as a React component because
  // it returns JSX, and an unnamed component triggers the rule.
  const DialogContainerStory: Decorator = (Story, context) => {
    if (context.viewMode !== "docs") {
      return <Story />;
    }
    return (
      <ThemeProvider theme={extendThemeForBoundedModal}>
        <div
          style={{
            position: "relative",
            // Width handling is load-bearing. With `disablePortal: true` the
            // modal root + backdrop render as siblings inside this wrapper
            // but they're `position: absolute` (per the theme styleOverrides
            // above) — absolutely-positioned children contribute 0 to the
            // parent's intrinsic inline size. The Docs canvas slot is
            // `width: fit-content`, so a plain `width: 100%` resolves to
            // `100%` of 0 → the wrapper collapses and the Dialog's
            // flex-centered Paper compresses into a thin vertical strip
            // (visually "dots down the middle"). Stories that render the
            // Dialog alongside a normally-positioned sibling
            // (e.g. `<Stack><Button /><Dialog /></Stack>`) sidestep this
            // because the sibling provides the intrinsic width — but we
            // don't want every story to need a wrapper just to get sized.
            //
            // `min-width` forces a concrete floor that propagates up the
            // fit-content ancestor chain. The default 640px matches a
            // `maxWidth="sm"` (600px) Dialog Paper plus its 32px horizontal
            // margins, with a small buffer. `width: 100%` lets the container
            // still expand on wider Docs canvases where the parent does
            // provide a width.
            width: "100%",
            minWidth,
            height,
            overflow: "hidden",
            // Subtle outline so an empty/closed dialog story still shows a
            // visible "container" on the Docs page (otherwise it looks like
            // a blank gap).
            border: "1px dashed rgba(127, 127, 127, 0.32)",
            borderRadius: 4,
          }}>
          <Story />
        </div>
      </ThemeProvider>
    );
  };
  return DialogContainerStory;
};
