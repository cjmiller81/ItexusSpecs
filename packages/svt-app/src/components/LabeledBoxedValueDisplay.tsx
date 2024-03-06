import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

function BoxLabel(props: {
  fontSize?: string;
  value: string;
}) {
  return (
    <Typography
      variant="button"
      display="block"
      color="#555689"
      fontWeight="bold"
      fontSize={props.fontSize ?? "button.fontSize"}
      gutterBottom>
      { props.value }
    </Typography>
  )
}

function BoxValue(props: {
  value: number;
  active?: boolean;
  fontSize?: string;
  roundTo?: number;
}) {
  return (
    <Box
      display="flex"
      mb="5"
      sx={{
        px: 8,
        py: 1,
        backgroundColor: props.active ? '#203864' : '#1d2538',
        border: props.active ? 2 : 0,
        borderColor: 'primary.dark',
      }}>
      <Typography
        variant="button"
        color={props.active ? "white" : "#555689"}
        display="block"
        fontWeight="bold"
        fontSize={props.fontSize ?? "button.fontSize"}>
        { props.value.toFixed(props.roundTo ?? 0) }
      </Typography>
    </Box>
  )
}

export default function LabeledBoxedValueDisplay(props: {
  label: string;
  value: number;
  active?: boolean;
}) {
  return (
    <Box display="flex" mb="5">
      <Stack
        justifyContent="center"
        alignItems="center">
        <BoxLabel value={props.label} />
        <BoxValue value={props.value} active={props.active} fontSize="h5.fontSize" roundTo={0} />
      </Stack>
    </Box>
  )
}
