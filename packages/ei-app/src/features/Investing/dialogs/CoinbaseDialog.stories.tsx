import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useFormik } from "formik";

import { dialogContainerDecorator } from "components/src/storybookMocks/dialogDocsDecorator";

import { CoinbaseDialog } from "./CoinbaseDialog";

type CoinbaseFormValues = {
  apiKey: string;
  apiSecret: string;
  apiPassphrase: string;
};

const FormikHost = (props: Omit<React.ComponentProps<typeof CoinbaseDialog>, "formik">) => {
  const formik = useFormik<CoinbaseFormValues>({
    initialValues: { apiKey: "", apiSecret: "", apiPassphrase: "" },
    onSubmit: () => {},
  });
  return (
    <CoinbaseDialog
      {...props}
      formik={formik}
    />
  );
};

const meta = {
  title: "EI App/Investing/Dialogs/CoinbaseDialog",
  component: FormikHost,
  parameters: { layout: "centered" },
  // See `tradeAggregator/NoRouteDialog.stories.tsx` /
  // `dialogDocsDecorator.tsx`. Bound the modal to a sized card on the Docs
  // page only.
  decorators: [dialogContainerDecorator(640)],
  tags: ["autodocs"],
  args: {
    open: true,
    onClose: () => {},
  },
} satisfies Meta<typeof FormikHost>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Closed: Story = {
  args: { open: false },
};
