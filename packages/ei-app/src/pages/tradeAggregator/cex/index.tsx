import { TradeTable } from "@/features/tradeAggregator/TradeTable";
import { Stack } from "@mui/material";


export default function Cex(){
    return(
        <Stack sx={{height: "100%"}}>
            <TradeTable></TradeTable>
        </Stack>
    )
}