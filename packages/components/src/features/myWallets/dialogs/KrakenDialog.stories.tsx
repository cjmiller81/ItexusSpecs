import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useFormik, type FormikConfig } from "formik";
import * as Yup from "yup";
import { fn } from "storybook/test";

import { dialogContainerDecorator } from "../../../storybookMocks/dialogDocsDecorator";

import type { IExchange } from "../../../models";
import { KrakenDialog } from "./KrakenDialog";

type KrakenFormValues = {
  chainName: string;
  apiKey: string;
  apiSecret: string;
};

const validationSchema = Yup.object({
  chainName: Yup.string().required("Required"),
  apiKey: Yup.string().required("Required"),
  apiSecret: Yup.string().required("Required"),
});

const existingMock: IExchange[] = [
  { exchange_id: "kraken-1", name: "Existing account", apiKey: "k1", apiSecret: "s1" },
];

function useStoryFormik(
  overrides?: Partial<FormikConfig<KrakenFormValues>>,
  deps?: Pick<FormikConfig<KrakenFormValues>, "initialValues" | "initialTouched" | "initialErrors">,
) {
  return useFormik<KrakenFormValues>({
    initialValues: {
      chainName: "",
      apiKey: "",
      apiSecret: "",
    },
    validationSchema,
    onSubmit: fn(),
    ...deps,
    ...overrides,
  });
}

function KrakenDialogDemo(props: {
  defaultOpen?: boolean;
  isEditing?: boolean;
  editingExchangeName?: string;
  existingExchanges?: IExchange[];
  formikOverrides?: Partial<FormikConfig<KrakenFormValues>>;
  formikDeps?: Pick<FormikConfig<KrakenFormValues>, "initialValues" | "initialTouched" | "initialErrors">;
}) {
  const [open, setOpen] = useState(props.defaultOpen ?? false);
  const isEditing = props.isEditing ?? false;
  const editingExchangeName = props.editingExchangeName ?? " ";
  const existingExchanges = props.existingExchanges ?? [];

  const formik = useStoryFormik(props.formikOverrides, props.formikDeps);

  return (
    <Stack
      spacing={2}
      alignItems="flex-start">
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}>
        Open Kraken dialog
      </Button>
      <KrakenDialog
        disableModalPortal
        open={open}
        formik={formik}
        onClose={() => {
          setOpen(false);
          formik.resetForm();
        }}
        onChainNameChange={fn()}
        existingExchanges={existingExchanges}
        isEditing={isEditing}
        onUpdateExchange={fn()}
        editingExchangeName={editingExchangeName}
      />
    </Stack>
  );
}

const meta: Meta<typeof KrakenDialog> = {
  title: "MyWallets/dialogs/KrakenDialog",
  component: KrakenDialog,
  args: {
    open: false,
    onClose: fn(),
    onChainNameChange: fn(),
    existingExchanges: [],
    isEditing: false,
    onUpdateExchange: fn(),
    editingExchangeName: " ",
    disableModalPortal: true,
    formik: {} as unknown as ReturnType<typeof useStoryFormik>,
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Kraken connection / edit dialog with duplicate account-name check, expandable API help, and illustration asset (`/KrakenApiSetup.png`).",
      },
    },
  },
  // Bound the modal to a sized card on the Docs page only. Height accounts
  // for the API-help illustration block which can push the Paper tall. See
  // `storybookMocks/dialogDocsDecorator.tsx`.
  decorators: [dialogContainerDecorator(800)],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  render: () => <KrakenDialogDemo />,
};

export const NewConnection: Story = {
  render: () => <KrakenDialogDemo defaultOpen />,
};

export const DuplicateAccountName: Story = {
  render: () => (
    <KrakenDialogDemo
      defaultOpen
      existingExchanges={existingMock}
      formikDeps={{
        initialValues: {
          chainName: "Existing account",
          apiKey: "",
          apiSecret: "",
        },
      }}
    />
  ),
};

export const EditingConnection: Story = {
  render: () => (
    <KrakenDialogDemo
      defaultOpen
      isEditing
      editingExchangeName="Existing account"
      existingExchanges={existingMock}
      formikDeps={{
        initialValues: {
          chainName: "Existing account",
          apiKey: "k1",
          apiSecret: "s1",
        },
      }}
    />
  ),
};
