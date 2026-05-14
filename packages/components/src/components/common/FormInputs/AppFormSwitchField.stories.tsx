import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { Formik, useFormikContext } from "formik";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import { AppFormSwitchField } from "./AppFormSwitchField";

function FieldStateReadout({ name }: { name: string }) {
  const { values } = useFormikContext<Record<string, boolean>>();
  return (
    <Typography
      variant="caption"
      sx={{ display: "block", mt: 1, color: "text.secondary" }}>
      Formik state: <code>{name}</code> = {String(values[name])}
    </Typography>
  );
}

const meta = {
  title: "Common/FormInputs/AppFormSwitchField",
  component: AppFormSwitchField,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof AppFormSwitchField>;

export default meta;
type Story = StoryObj<typeof meta>;

const renderInFormik = (initialValues: Record<string, boolean>) =>
  function Render(args: React.ComponentProps<typeof AppFormSwitchField>) {
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={fn()}>
        <Box sx={{ minWidth: 280 }}>
          <FormControlLabel
            control={<AppFormSwitchField {...args} />}
            label="Email notifications"
          />
          <FieldStateReadout name={args.name} />
        </Box>
      </Formik>
    );
  };

export const Off: Story = {
  args: { name: "notificationsEnabled" },
  render: renderInFormik({ notificationsEnabled: false }),
};

export const On: Story = {
  args: { name: "notificationsEnabled" },
  render: renderInFormik({ notificationsEnabled: true }),
};

export const Disabled: Story = {
  args: { name: "notificationsEnabled", disabled: true },
  render: renderInFormik({ notificationsEnabled: true }),
};
