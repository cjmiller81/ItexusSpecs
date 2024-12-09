import UserInputsSectorsSection from "@/features/SingleStockView/UserInputsSectorsSection";
import { Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import i18next, { t } from "i18next";

i18next.setDefaultNamespace("DISingleStock");

export default function SectorsView() {
  return (
    <>
    <Box>
      <Typography
        sx={{
          width:"100%",
          textWrap: "nowrap", 
          minWidth: "300px",
          marginTop: "-10px",
          fontSize: "15px", 
          paddingBottom: "10px", 
        }}
      >
        {t("SectorsView")}
      </Typography>
      <Divider sx={{ marginTop: "-2px", marginBottom: "20px", width: "100vw", left: 0, position: "absolute", top: "auto" }} />
      </Box>

      <Typography
        sx={{
          width:"100%",
          textWrap: "nowrap", 
          minWidth: "200px",
          marginTop: "0px",
          fontSize: "14px", 
          paddingTop:"5px",
          
        }}
      >
        {t("UserInputs")}
      </Typography>
      

      <UserInputsSectorsSection />
    </>
  );
}


