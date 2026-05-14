import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { Formik, useFormikContext } from "formik";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import { AppFormCheckboxField } from "./AppFormCheckboxField";

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
  title: "Common/FormInputs/AppFormCheckboxField",
  component: AppFormCheckboxField,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof AppFormCheckboxField>;

export default meta;
type Story = StoryObj<typeof meta>;

const renderInFormik = (initialValues: Record<string, boolean>) =>
  function Render(args: React.ComponentProps<typeof AppFormCheckboxField>) {
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={fn()}>
        <Box sx={{ minWidth: 240 }}>
          <FormControlLabel
            control={<AppFormCheckboxField {...args} />}
            label="Subscribe to updates"
          />
          <FieldStateReadout name={args.name} />
        </Box>
      </Formik>
    );
  };

export const Unchecked: Story = {
  args: { name: "subscribed" },
  render: renderInFormik({ subscribed: false }),
};

export const Checked: Story = {
  args: { name: "subscribed" },
  render: renderInFormik({ subscribed: true }),
};

export const Disabled: Story = {
  args: { name: "subscribed", disabled: true },
  render: renderInFormik({ subscribed: true }),
};
