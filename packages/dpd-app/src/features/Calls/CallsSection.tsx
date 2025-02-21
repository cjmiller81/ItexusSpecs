import { useState } from "react";
import { Box, Button, Divider, MenuItem, Select, SelectChangeEvent, TextField, Checkbox, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function CallOptionSet() {
  const [account, setAccount] = useState("");
  const [subProfile, setSubProfile] = useState("");
  const { t } = useTranslation("CallsSection");
  const [isBAMaxEnabled, setIsBAMaxEnabled] = useState(false);

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "background.default", p: 1.2 }}>
      <Typography 
        variant="h4" 
        sx={{ fontWeight: "bold", mb: 3 }}
      >
        {t("CallOptionSet")}
      </Typography>

      <Divider sx={{ mb: 4, width: "100vw", left: 0, position: "absolute", top: "auto" }} />

      <Box sx={{ display: "flex", gap: 1.8, alignItems: "center", marginTop:"45px" }}>
        <Select
          value={account}
          onChange={(event: SelectChangeEvent) => setAccount(event.target.value)}
          displayEmpty
          sx={{ width: "200px", height: "40px", bgcolor: "gray",boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)" }}
        >
          <MenuItem value="" disabled>{t("Account")}</MenuItem>
        </Select>

        <Select
          value={subProfile}
          onChange={(event: SelectChangeEvent) => setSubProfile(event.target.value)}
          displayEmpty
          sx={{ width: "300px", height: "40px", bgcolor: "#2A9D8F", color: "white",boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)" }}
        >
          <MenuItem value="" disabled>{t("SelectSub-Profile")}</MenuItem>
        </Select>

        <Button variant="contained" 
          sx={{ 
            height: "40px", 
            bgcolor: "#2A9D8F", 
            color: "white", 
            textTransform: "none", 
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)", 
            whiteSpace: "nowrap",
            overflow: "hidden",
            minWidth: "150px",
            maxWidth: "100%", }}>
              {t("CreateNewSub-Profile")}
        </Button>
        <Button variant="contained" 
          sx={{ 
            height: "40px", bgcolor: "#2A9D8F", color: "white",textTransform: "none",boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)" }}>
              {t("Save")}
        </Button>
        <Button variant="outlined" 
          sx={{ 
            height: "40px", bgcolor: "#2A9D8F", color: "white",textTransform: "none",boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)" }}>
              {t("SaveCopy")}
        </Button>
      </Box>

      <Divider sx={{ my: 4, width: "100vw", left: 0, position: "absolute", top: "auto" }} />
      <Box sx={{display: "flex", marginTop:"50px"}}>
        <Button variant="outlined" 
          sx={{ 
            height: "40px", bgcolor: "#2A9D8F", color: "white", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)" }}>
              {t("SendOrder")}
        </Button>
      </Box>

      <Box sx={{ width: "500px", 
                bgcolor: "#2A2A2A", 
                p: 3, 
                borderRadius: 2, 
                color: "white", 
                marginTop: "25px",
                border: "2px solid green", 
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)" }}>
        <h3>{t("OptionDetails")}</h3>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <TextField 
          placeholder="Enter ticker"
          variant="outlined"
          InputLabelProps={{ shrink: false }} 
          sx={{ 
            bgcolor: "#1E1E1E", 
            input: { 
              color: "white", 
              padding: "10px 12px" 
            }, 
            "& .MuiOutlinedInput-root": { 
              height: "40px", 
              display: "flex", 
              alignItems: "center" 
            } 
          }}/>

          <Typography sx={{ color: "white", minWidth: "80px" }}>{t("DTERange")}</Typography>
          <TextField 
            type="number"
            variant="outlined" 
            defaultValue={0}
            sx={{ 
              bgcolor: "#1E1E1E", 
              input: { color: "white", textAlign: "center" }, 
              width: "60px", 
              "& .MuiOutlinedInput-root": { height: "40px" } 
            }} 
          />

          <Typography sx={{ color: "white" }}>{t("to")}</Typography>
          <TextField 
            type="number"
            variant="outlined" 
            defaultValue={32}
            sx={{ 
              bgcolor: "#1E1E1E", 
              input: { color: "white", textAlign: "center" }, 
              width: "60px", 
              "& .MuiOutlinedInput-root": { height: "40px" } 
            }} 
          />
        </Box>

          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "flex-start" }}>
              <Checkbox sx={{ color: "gray", p: 0 }} />
              <Typography sx={{ fontSize: "13px", color: "white", mt: 0.5 }}>
              {t("RequireActiveBid")}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center",marginLeft:"auto" }}>
              <Checkbox checked={isBAMaxEnabled}
                onChange={() => setIsBAMaxEnabled((prev) => !prev)}
                sx={{ color: "gray" }} />
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <Typography sx={{ fontSize: "13px", color: "white", mt: 0.5 }}>
              {t("B/AMaxOn/Off")}
              </Typography>
              
              <Typography sx={{ fontSize: "10px", fontStyle: "italic", color: isBAMaxEnabled ? "white" : "gray" }}>
              {t("B/AMax(e.g 5 = 5%)")}
            </Typography>
              </Box>
              <TextField 
                placeholder="20"
                variant="outlined"
                disabled={!isBAMaxEnabled}
                InputLabelProps={{ shrink: false }} 
                sx={{ 
                  bgcolor: "#1E1E1E", 
                  width: "60px",
                  marginLeft: "10px",
                  input: { 
                    color: isBAMaxEnabled ? "white" : "gray",
                    padding: "10px 12px",
                  }, 
                  "& .MuiOutlinedInput-root": { 
                    height: "40px", 
                    display: "flex", 
                    alignItems: "center",
                    borderColor: "gray",
                    "&:hover": {
                      borderColor: "white",
                    },
                  }, 
                }} 
              />
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography sx={{ color: "white" }}>{t("MinContractAsk")}</Typography>
            <TextField 
              type="number"
              variant="outlined" 
              defaultValue={1.05}
              sx={{ 
                bgcolor: "#1E1E1E", 
                input: { color: "white", textAlign: "center" }, 
                width: "70px", 
                "& .MuiOutlinedInput-root": { height: "40px" } 
              }} />
            <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Checkbox sx={{ color: "gray", p: 0 }} />
              <Typography sx={{ color: "white" }}>{t("TradeAsSet")}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{width: "500px", 
                bgcolor: "#2A2A2A", 
                p: 3, 
                borderRadius: 2, 
                color: "white", 
                marginTop: "25px",
                border: "2px solid green", 
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)" }}>
        <h3>{t("OptionFilter")}</h3>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography sx={{ color: "white", }}>{t("MinOpenInterest")}</Typography>
                  <TextField 
                    type="number"
                    variant="outlined" 
                    defaultValue={150}
                    sx={{ 
                      bgcolor: "#1E1E1E", 
                      input: { color: "white", textAlign: "center" }, 
                      width: "100px", 
                      "& .MuiOutlinedInput-root": { height: "40px" } 
                    }} 
                  />
                  </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography sx={{ color: "white" }}>{t("MinVolume")}</Typography>
                  <TextField 
                    type="number"
                    variant="outlined" 
                    defaultValue={10}
                    sx={{ 
                      bgcolor: "#1E1E1E", 
                      input: { color: "white", textAlign: "center" }, 
                      width: "100px", 
                      "& .MuiOutlinedInput-root": { height: "40px" } 
                    }} 
                  />
                </Box>                   
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}></Box> 
                <Typography sx={{ color: "white" }}>{t("B/ASpreadDiff")}</Typography>
                <TextField 
                      type="number"
                      variant="outlined" 
                      defaultValue={10}
                      sx={{ 
                        bgcolor: "#1E1E1E", 
                        input: { color: "white", textAlign: "center" }, 
                        width: "100px", 
                        "& .MuiOutlinedInput-root": { height: "40px" } 
                      }} 
                    /> 
                </Box>     
            </Box>
        </Box>
  );
}
