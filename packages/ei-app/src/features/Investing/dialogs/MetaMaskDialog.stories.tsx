import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useFormik } from "formik";

import { dialogContainerDecorator } from "components/src/storybookMocks/dialogDocsDecorator";

import { MetaMaskDialog } from "./MetaMaskDialog";

type MetaMaskFormValues = {
  network: string;
  customRpcUrl: string;
};

const FormikHost = (props: Omit<React.ComponentProps<typeof MetaMaskDialog>, "formik">) => {
  const formik = useFormik<MetaMaskFormValues>({
    initialValues: { network: "", customRpcUrl: "" },
    onSubmit: () => {},
  });
  return (
    <MetaMaskDialog
      {...props}
      formik={formik}
    />
  );
};

const meta = {
  title: "EI App/Investing/Dialogs/MetaMaskDialog",
  component: FormikHost,
  parameters: { layout: "centered" },
  // See `tradeAggregator/NoRouteDialog.stories.tsx` /
  // `dialogDocsDecorator.tsx`. Bound the modal to a sized card on the Docs
  // page only.
  decorators: [dialogContainerDecorator(560)],
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
