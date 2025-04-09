import { CurrentPositionSection } from "@/features/tradeAggregator/CurrentPositionSection";
import { Stack, Typography } from "@mui/material";


export default function Dex(){
    return(
        <Stack>
            <Typography
                          variant="h3"
                          component="div"
                          sx={{
                            alignSelf: "flex-start",
                            fontSize: "20px",
                            marginTop: "11px",
                            marginBottom: "-7px",
                            marginLeft: "10px",
                            width: "100%",
                          }}>
                          {"DEX:"}
                        </Typography>
            <CurrentPositionSection></CurrentPositionSection>
        </Stack>
    )
}