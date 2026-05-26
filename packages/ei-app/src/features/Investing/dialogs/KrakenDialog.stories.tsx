import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useFormik } from "formik";

import { dialogContainerDecorator } from "components/src/storybookMocks/dialogDocsDecorator";

import { KrakenDialog } from "./KrakenDialog";

type KrakenFormValues = {
  apiKey: string;
  apiSecret: string;
  apiPassphrase: string;
};

// Formik wrapper because the dialog expects a real FormikProps instance for
// values / errors / touched bookkeeping.
const FormikHost = (props: Omit<React.ComponentProps<typeof KrakenDialog>, "formik">) => {
  const formik = useFormik<KrakenFormValues>({
    initialValues: { apiKey: "", apiSecret: "", apiPassphrase: "" },
    onSubmit: () => {},
  });
  return (
    <KrakenDialog
      {...props}
      formik={formik}
    />
  );
};

const meta = {
  title: "EI App/Investing/Dialogs/KrakenDialog",
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
