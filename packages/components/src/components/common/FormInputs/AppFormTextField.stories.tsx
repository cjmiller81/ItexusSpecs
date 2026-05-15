import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { Formik, useFormikContext } from "formik";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AppFormTextField } from "./AppFormTextField";

function FieldStateReadout({ name }: { name: string }) {
  const { values } = useFormikContext<Record<string, string>>();
  return (
    <Typography
      variant="caption"
      sx={{ display: "block", mt: 1, color: "text.secondary" }}>
      Formik state: <code>{name}</code> = &quot;{values[name]}&quot;
    </Typography>
  );
}

const meta = {
  title: "Common/FormInputs/AppFormTextField",
  component: AppFormTextField,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    label: { control: "text" },
    tooltip: { control: "text" },
    required: { control: "boolean" },
    error: { control: "text" },
  },
} satisfies Meta<typeof AppFormTextField>;

export default meta;
type Story = StoryObj<typeof meta>;

const renderInFormik = (initialValues: Record<string, string>) =>
  function Render(args: React.ComponentProps<typeof AppFormTextField>) {
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={fn()}>
        <Box sx={{ minWidth: 320 }}>
          <AppFormTextField {...args} />
          <FieldStateReadout name={args.name} />
        </Box>
      </Formik>
    );
  };

export const Default: Story = {
  args: { name: "displayName", label: "Display name" },
  render: renderInFormik({ displayName: "" }),
};

export const Prefilled: Story = {
  args: { name: "displayName", label: "Display name" },
  render: renderInFormik({ displayName: "Satoshi" }),
};

export const Required: Story = {
  args: {
    name: "username",
    label: "Username",
    required: true,
    tooltip: "Letters, numbers, and underscores only.",
  },
  render: renderInFormik({ username: "" }),
};

// AppFormTextField reads error state from Formik via useField's meta.error.
// We seed initialErrors so the error message renders without needing to run
// a validation schema.
export const WithError: Story = {
  args: { name: "email", label: "Email" },
  render: function Render(args) {
    return (
      <Formik
        initialValues={{ email: "not-an-email" }}
        initialErrors={{ email: "Must be a valid email address." }}
        initialTouched={{ email: true }}
        onSubmit={fn()}>
        <Box sx={{ minWidth: 320 }}>
          <AppFormTextField {...args} />
          <FieldStateReadout name={args.name} />
        </Box>
      </Formik>
    );
  },
};
