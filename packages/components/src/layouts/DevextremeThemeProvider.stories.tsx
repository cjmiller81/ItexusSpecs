import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ReactNode } from "react";
// `ei-app` pulls in `dx.common.css` globally (`_app.tsx`). DevExtreme still needs
// `<link rel="dx-theme" data-theme="…" href="…">` entries — those come from
// `_document.tsx` in Next. Vite-importing theme CSS files does **not** create
// them; `devextreme/ui/themes` only discovers themes via `link[rel="dx-theme]`
// (`processMarkup` in `themes.js`). Without this setup `themes.current` throws E0021.
import "devextreme/dist/css/dx.common.css";
// Resolved URLs for the dx-theme link `href`s (Vite passes the built asset path).

// @ts-expect-error Vite `?url`; Storybook's Vite builder resolves this at compile time
import materialBlueLightHref from "devextreme/dist/css/dx.material.blue.light.css?url";
// @ts-expect-error Vite `?url`
import materialBlueDarkHref from "devextreme/dist/css/dx.material.blue.dark.css?url";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
// `init` is a named export in `devextreme/esm/ui/themes.js` but missing from `ui/themes.d.ts`.
// @ts-expect-error DevExtreme typings omit `init`
import { init as initDevextremeThemes } from "devextreme/ui/themes";
import DevextremeThemeProvider from "./DevextremeThemeProvider";
import { toggleTheme, useAppDispatch, useAppSelector } from "../slices/index";

const SB_DX_THEMES_READY = "data-sb-devextreme-dx-theme-ready";

function ensureDevextremeDxThemeLinks(): void {
  if (typeof document === "undefined") {
    return;
  }
  if (document.documentElement.hasAttribute(SB_DX_THEMES_READY)) {
    return;
  }

  const appendDxThemeLink = (themeName: string, href: string, active: boolean) => {
    const link = document.createElement("link");
    link.rel = "dx-theme";
    link.setAttribute("data-theme", themeName);
    link.setAttribute("data-active", active ? "true" : "false");
    link.href = href;
    document.head.appendChild(link);
  };

  appendDxThemeLink("material.blue.light", materialBlueLightHref, true);
  appendDxThemeLink("material.blue.dark", materialBlueDarkHref, false);

  // ESM bundle exposes `init` as a named export; the default object has `current` but not `init`.
  initDevextremeThemes();
  document.documentElement.setAttribute(SB_DX_THEMES_READY, "1");
}

/**
 * Runs sync during render so `initDevextremeThemes()` completes before
 * `DevextremeThemeProvider`'s `useEffect` calls `themes.current` (child effects
 * run before parent effects, but this wrapper’s render runs before the child mounts).
 */
function DevextremeStorybookRoot({ children }: { children: ReactNode }) {
  ensureDevextremeDxThemeLinks();
  return <>{children}</>;
}

function DevextremeDemo() {
  const mode = useAppSelector(s => s.ui.mode);
  const dispatch = useAppDispatch();
  return (
    <DevextremeThemeProvider>
      <Stack
        spacing={2}
        sx={{ maxWidth: 480 }}>
        <Typography
          variant="body2"
          color="text.secondary">
          Watches `ui.mode` and applies `themes.current(...)` for DevExtreme Material Blue (dark vs light). Toggle the
          global palette mode to confirm the hook runs without errors.
        </Typography>
        <Typography variant="body1">
          Current Redux mode: <strong>{mode}</strong>
        </Typography>
        <Button
          variant="contained"
          onClick={() => dispatch(toggleTheme())}>
          Toggle theme
        </Button>
      </Stack>
    </DevextremeThemeProvider>
  );
}

const meta = {
  title: "Layouts/DevextremeThemeProvider",
  component: DevextremeThemeProvider,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Bridges the app-wide dark/light `ui.mode` slice to DevExtreme's `material.blue.dark` / `material.blue.light` theme strings.",
      },
    },
  },
  tags: ["autodocs"],
  render: () => (
    <Box sx={{ p: 2 }}>
      <DevextremeStorybookRoot>
        <DevextremeDemo />
      </DevextremeStorybookRoot>
    </Box>
  ),
} satisfies Meta<typeof DevextremeThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
