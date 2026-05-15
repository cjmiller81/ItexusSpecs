import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from "@mui/material/Box";
import { NftCell, type NftCellProps } from "./NftCell";

const meta: Meta<NftCellProps> = {
  title: "MyWallets/DEX/NftCell",
  component: NftCell,
  args: {
    tokenId: "7842",
    collectionName: "Cool Cats",
    imageUrl: "https://picsum.photos/seed/nftcell/128",
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "List cell with optional square artwork, collection + token naming helpers (`extractNFTName` / `cleanCollectionName`), and a wallpaper placeholder when no image loads.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box sx={{ maxWidth: 420, p: 2, border: 1, borderColor: "divider", borderRadius: 1 }}>
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {};

export const PlaceholderOnly: Story = {
  args: { imageUrl: null },
};

export const BrokenImageFallsBack: Story = {
  args: {
    imageUrl: "https://invalid.example.test/nope.png",
    collectionName: "Broken avatar demo",
  },
};

export const LongLabels: Story = {
  args: {
    collectionName: "A Very Long Fantasy Collection Name That Should Ellipsize",
    tokenId: "999999999",
    imageUrl: null,
  },
};

export const NumericTokenId: Story = {
  args: {
    tokenId: 42,
    collectionName: "Numeric ids",
    imageUrl: null,
  },
};
