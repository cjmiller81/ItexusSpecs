import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { delay, http, HttpResponse } from "msw";
import { ApiUsageStatus } from "./ApiUsageStatus";

const ENDPOINT = "*/api/request-tracking/status";

const meta = {
  title: "Header/ApiUsageStatus",
  component: ApiUsageStatus,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ApiUsageStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [http.get(ENDPOINT, () => HttpResponse.json({ totalRequests: 1234, allowedRequests: 5000 }))],
    },
  },
};

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(ENDPOINT, async () => {
          await delay("infinite");
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

export const Error: Story = {
  tags: ["!autodocs"],
  parameters: {
    msw: {
      handlers: [http.get(ENDPOINT, () => HttpResponse.json({ message: "Internal server error" }, { status: 500 }))],
    },
  },
};
