import Box from "@mui/material/Box";
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from "@mui/material/Typography";

function TradeingRangeLabel(props: {
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

function TradeingRangeValue(props: {
  fontSize?: string;
  roundTo?: number;
  value: number;
}) {
  return (
    <Typography
      variant="h6"
      color="white"
      display="block"
      fontWeight="bold"
      fontSize={props.fontSize ?? "button.fontSize"}
      gutterBottom>
      { props.value.toFixed(props.roundTo ?? 0) }
    </Typography>
  )
}

function LineDivider() {
  return (
    <Box
      sx={{
        width: "100%"
      }}
    >
      <Divider/>
    </Box>
  )
}

export default function TradeingRangeDisplay(props: {
  low: number;
  mid: number;
  high: number;
  lowLabel: string;
  midLabel: string;
  highLabel: string;
}) {
  return (
    <div style={{ width: '100%' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        divider={<LineDivider />}
        spacing={5}
        sx={{
          px: 2,
          py: 2,
        }}
      >
        <Box display="flex" mb="5">
          <Stack
            justifyContent="center"
            alignItems="center"
            spacing={1}>
            <TradeingRangeLabel value={props.lowLabel} />
            <TradeingRangeValue fontSize="h5.fontSize" roundTo={2} value={props.low} />
          </Stack>
        </Box>
        <Box display="flex" mb="5">
          <Stack
            justifyContent="center"
            alignItems="center">
            <TradeingRangeLabel fontSize="h5.fontSize" value={props.midLabel} />
            <TradeingRangeValue fontSize="h4.fontSize" roundTo={2} value={props.mid} />
          </Stack>
        </Box>
        <Box display="flex" mb="5">
          <Stack
            justifyContent="center"
            alignItems="center">
            <TradeingRangeLabel value={props.highLabel} />
            <TradeingRangeValue fontSize="h5.fontSize" roundTo={2} value={props.high} />
          </Stack>
        </Box>
      </Stack>
    </div>
  )
}
