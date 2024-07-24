import {
  Button,
  Typography,
  useTheme,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardTile } from "features/dashboard/DashboardTile";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DownloadOutlined from "@ant-design/icons/DownloadOutlined";
import customFormatNumber from "helpers/customFormatNumber";

export const CryptoBalance = ({ data }) => {
  const { t } = useTranslation("UpdatesTile");
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDownloadCsv = () => {
    console.log("DownloadCsv!");
  };

  return (
    <DashboardTile
      sx={{
        marginTop: "27px",
        maxWidth: 223,
        paddingLeft: 0,
      }}
      title={""}>
      <Box sx={{ px: 3, padding: "7px 0 5px 0", pt: isExpanded ? 2 : 1 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            onClick={handleToggleExpand}
            sx={{ display: "flex", alignItems: "center", padding: "4px 8px", minWidth: "auto" }}>
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            <Typography
              sx={{
                ml: 1,
                color: theme.palette.common.white,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
              {t("CryptoBalance", { ns: "Dashboard" })}
            </Typography>
          </Button>
          <Box sx={{ ml: 1 }}>
            <Button
              onClick={handleDownloadCsv}
              sx={{ display: "flex", alignItems: "center", padding: "4px 8px", minWidth: "auto" }}>
              <DownloadOutlined style={{ cursor: "pointer", fontSize: 20, color: "initial" }} />
            </Button>
          </Box>
        </Box>
        {isExpanded && (
          <Box>
            <TableContainer
              component={Paper}
              sx={{
                maxWidth: "100%",
                overflowX: "auto",
                pt: isExpanded ? 2 : 0,
              }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}>
                        {t("Coin", { ns: "Dashboard" })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}>
                        {t("Quantity", { ns: "Dashboard" })}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.coin}</TableCell>
                      <TableCell>{customFormatNumber(row.quantity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    </DashboardTile>
  );
};
