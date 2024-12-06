import UserInputsSection from "@/features/SingleStockView/UserInputsSection";
import { Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import i18next, { t } from "i18next";

i18next.setDefaultNamespace("DISingleStock");
import { PageTitle } from "components";

export default function SingleStockView() {
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
        {t("SingleStockPage")}
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
      

      <UserInputsSection />
    </>
  );
}

