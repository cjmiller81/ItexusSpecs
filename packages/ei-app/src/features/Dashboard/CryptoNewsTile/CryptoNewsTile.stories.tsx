import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";

import { CryptoNewsTile } from "./CryptoNewsTile";

// CryptoNewsTile dispatches `fetchNewsByCategoryAsync` on mount; the storied
// preview store includes `cryptoNewsSlice` and the preview-default MSW
// handlers reply to `/api/cryptonews/category` with a fixture, so the tile
// hydrates without any per-story wiring.
const meta: Meta<typeof CryptoNewsTile> = {
  title: "EI App/Dashboard/CryptoNewsTile",
  component: CryptoNewsTile,
  parameters: {
    layout: "centered",
    // `CryptoNewsTile`'s props extend `DashboardTileProps`, which is
    // `Omit<StackProps, 'title'> & {...}` — so it inherits MUI Stack's
    // `color`, `bgcolor`, `borderColor`, etc., typed as the polymorphic
    // `ResponsiveStyleValue<…>` (react-docgen-typescript flags those as the
    // catch-all `"other"` kind). The preview-level matcher
    // ``color: /(background|color)$/i`` in `.storybook/preview.tsx` then
    // tries to render them with a color picker and logs:
    //   "Addon controls: Control of type color only supports string,
    //    received 'other' instead"
    // None of those Stack styling props are exercised by this story —
    // only `title` and `icon` are varied. Restrict the controls panel
    // accordingly so the matcher never has a chance to fire.
    controls: { include: ["title", "icon"] },
  },
  decorators: [
    Story => (
      <Box sx={{ width: 480, height: 540 }}>
        <Story />
      </Box>
    ),
  ],
  args: {
    title: "Crypto news",
    icon: <ArticleIcon fontSize="small" />,
  },
};

export default meta;

type Story = StoryObj<typeof CryptoNewsTile>;

export const Default: Story = {};
