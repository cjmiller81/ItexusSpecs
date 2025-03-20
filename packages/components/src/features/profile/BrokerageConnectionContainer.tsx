import { useEffect, useState } from "react";
import { Box, BoxProps, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { ProfileContainer } from "./ProfileContainer";
import { useTranslation } from "react-i18next";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckIcon from "@mui/icons-material/Check";
import { getSchwabAccountList, getSchwabConnectUrl, resetConnectedAccounts, useAppDispatch, useAppSelector } from "../..";

export const BrokerageConnectionContainer: React.FC = () => {
  const { t } = useTranslation("BrokerageConnectionContainer");
  const [isConnected, setIsConnected] = useState(false);
  const { connectedAccounts, schwabConnectUrl } = useAppSelector(state => state.userProfile || [])

  const dispatch = useAppDispatch()

  useEffect(() =>{
    dispatch(getSchwabConnectUrl());
  },[])

  const handleConnectionToggle = () => {
    if (!isConnected) {
      dispatch(getSchwabAccountList());
    } else {
      dispatch(resetConnectedAccounts())
    }
    //setIsConnected((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex", gap: 4, p: 3 }}>
      <ProfileContainer
        width={"30%"}
        title="Connect Account"
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {!isConnected ? (
            <Button
            href={schwabConnectUrl}
            target="_blank"
              onClick={handleConnectionToggle}
              sx={{
                backgroundColor: "blue",
                color: "white",
                textTransform: "none",
                width: "95%",
                "&:hover": { backgroundColor: "#0033cc" },
              }}
            >
              {t("ConnectToSchwab")}
            </Button>
          ) : (
            <>
              <Box sx={{ display: "flex", alignItems: "center", color: "#4caf50", fontWeight: "bold", padding: "6px 12px" }}>
                <CheckCircleIcon sx={{ marginRight: 1 }} />
                <Typography variant="body2">{t("ConnectedToSchwab")}</Typography>
              </Box>
              <Button
                onClick={handleConnectionToggle}
                sx={{
                  backgroundColor: "#ff6666",
                  width: "95%",
                  color: "white",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#cc0000" },
                }}
              >
                {t("Disconnect")}
              </Button>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CheckIcon sx={{ color: "#4caf50" }} />
                <Typography>{t("AuthorizedForTrading")}</Typography>
              </Box>

              <Typography sx={{ color: "red" }}>{t("AuthorizationExpires")}</Typography>

              <Button
                sx={{
                  backgroundColor: "#8dcd89",
                  color: "white",
                  width: "95%",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#77dd77" },
                }}
              >
                {t("Reauthorize")}
              </Button>
            </>
          )}
        </Box>
      </ProfileContainer>
      <ProfileContainer width={"50%"} title="Connected Account(s)" sx={{ display: "flex", flexDirection: "column" }}>
        <TableContainer sx={{ backgroundColor: "transparent" }}>
          <Table sx={{ minWidth: 650, borderCollapse: "collapse", tableLayout: "fixed" }}>
            <TableHead>
              <TableRow>
                <TableCell align="left" sx={{ fontWeight: "bold", border: "1px solid #616161", width: "50%" }}>
                  {t("AccountNumber")}
                </TableCell>
                <TableCell align="left" sx={{ fontWeight: "bold", border: "1px solid #616161", width: "50%" }}>
                  {t("Status")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {connectedAccounts?.length === 0 ? (
                <TableRow>
                  
                </TableRow>
              ) : (
                connectedAccounts?.map((account, index) => (
                  <TableRow key={index}>
                    <TableCell align="left" sx={{ border: "1px solid #616161", width: "50%" }}>
                      {account.accountNumber}
                    </TableCell>
                    <TableCell align="left" sx={{ border: "1px solid #616161", width: "50%" }}>
                      <Box
                        sx={{
                          display: "inline-block",
                          backgroundColor: "rgba(76, 175, 80, 0.2)", 
                          color: "#4caf50",
                          border: "2px solid #2e7d32", 
                          borderRadius: "16px", 
                          padding: "4px 12px",
                          fontWeight: "bold",
                          textAlign: "center",
                          pointerEvents: "none",
                        }}
                      >
                        {account.status}
                      </Box>
                    </TableCell>

                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </ProfileContainer>
    </Box>
  );
};

export default BrokerageConnectionContainer;