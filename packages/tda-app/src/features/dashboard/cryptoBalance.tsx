import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Avatar,
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
import { grey, orange } from "@mui/material/colors";
import { Box, Stack, darken } from "@mui/system";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardTile, DashboardTileProps } from "./DashboardTile";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

type Props = Omit<DashboardTileProps, "children"> & {
  version: string;
};

export const CryptoBalance: FC<Props> = ({ icon, version, sx, ...props }) => {
  const { t } = useTranslation("UpdatesTile");
  const theme = useTheme();
  const fillGrey = theme.palette.mode === "light" ? grey[600] : grey[500];
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Sample data for the table
  const cryptoData = [
    { coin: "BTC", quantity: "1.6000" },
    { coin: "ETH", quantity: "2.5000" },
    { coin: "USDT", quantity: "2,256.5000" },
  ];

  return (
    <DashboardTile
      icon={icon}
      sx={{
        ...sx,
        marginTop: "27px",
      }}
      {...props}>
      <Box sx={{ mt: 2, px: 2 }}>
        <Button
          onClick={handleToggleExpand}
          sx={{ mb: 2, color: theme.palette.primary.main, display: "flex", alignItems: "center" }}>
          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          <Typography sx={{ ml: 1 }}>{"Crypto Balance"}</Typography>
        </Button>
        {isExpanded && (
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              letterSpacing={0.5}
              color={fillGrey}
              sx={{ mb: 2 }}>
              Crypto Balance
            </Typography>
            <TableContainer
              component={Paper}
              sx={{
                maxWidth: "100%",
                overflowX: "auto",
              }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}>
                        Coin
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}>
                        Quantity
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cryptoData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.coin}</TableCell>
                      <TableCell>{row.quantity}</TableCell>
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
