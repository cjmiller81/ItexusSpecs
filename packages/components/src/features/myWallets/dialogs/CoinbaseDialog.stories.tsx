import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useFormik, type FormikConfig } from "formik";
import * as Yup from "yup";
import { fn } from "storybook/test";

import { dialogContainerDecorator } from "../../../storybookMocks/dialogDocsDecorator";

import { CoinbaseDialog } from "./CoinbaseDialog";

type CoinbaseFormValues = {
  chainName: string;
  apiKey: string;
  apiSecret: string;
};

const validationSchema = Yup.object({
  chainName: Yup.string().required("Required"),
  apiKey: Yup.string().required("Required"),
  apiSecret: Yup.string().required("Required"),
});

function useStoryFormik(overrides?: Partial<FormikConfig<CoinbaseFormValues>>) {
  return useFormik<CoinbaseFormValues>({
    initialValues: {
      chainName: "",
      apiKey: "",
      apiSecret: "",
    },
    validationSchema,
    onSubmit: fn(),
    ...overrides,
  });
}

function CoinbaseDialogDemo(props: {
  defaultOpen?: boolean;
  formikOptions?: Partial<FormikConfig<CoinbaseFormValues>>;
}) {
  const [open, setOpen] = useState(props.defaultOpen ?? false);
  const formik = useStoryFormik(props.formikOptions);
  return (
    <Stack
      spacing={2}
      alignItems="flex-start">
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}>
        Open Coinbase dialog
      </Button>
      <CoinbaseDialog
        disableModalPortal
        open={open}
        formik={formik}
        onClose={() => {
          setOpen(false);
          formik.resetForm();
        }}
        onChainNameChange={fn()}
      />
    </Stack>
  );
}

const meta: Meta<typeof CoinbaseDialog> = {
  title: "MyWallets/dialogs/CoinbaseDialog",
  component: CoinbaseDialog,
  args: {
    open: false,
    onClose: fn(),
    onChainNameChange: fn(),
    disableModalPortal: true,
    formik: {} as unknown as ReturnType<typeof useStoryFormik>,
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "API key connection dialog for Coinbase (Formik fields + disclaimer callout).",
      },
    },
  },
  // Bound the modal to a sized card on the Docs page only. The standalone
  // Story page still gets the dialog at full viewport. See
  // `storybookMocks/dialogDocsDecorator.tsx`.
  decorators: [dialogContainerDecorator(720)],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  render: () => <CoinbaseDialogDemo />,
};

export const OpenEmpty: Story = {
  render: () => <CoinbaseDialogDemo defaultOpen />,
};

export const OpenFilled: Story = {
  render: () => (
    <CoinbaseDialogDemo
      defaultOpen
      formikOptions={{
        initialValues: {
          chainName: "Coinbase main",
          apiKey: "cb_demo_public",
          apiSecret: "cb_demo_secret",
        },
      }}
    />
  ),
};

export const WithFieldErrors: Story = {
  render: () => (
    <CoinbaseDialogDemo
      defaultOpen
      formikOptions={{
        initialTouched: { chainName: true, apiKey: true, apiSecret: true },
        initialErrors: {
          chainName: "Required",
          apiKey: "Invalid API key",
          apiSecret: "Required",
        },
        validateOnChange: false,
        validateOnBlur: false,
      }}
    />
  ),
};
