import { DexSection } from "@/features/tradeAggregator/DexSection";
import { TradeTable } from "@/features/tradeAggregator/TradeTable";
import { Stack } from "@mui/material";


export default function TradeAggregator(){
    return(
        <Stack>
            <TradeTable></TradeTable>
            <DexSection></DexSection>
        </Stack>
    )
}