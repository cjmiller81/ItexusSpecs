import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import { Box, Theme } from "@mui/system";
import { ColumnDef } from "@tanstack/react-table";
import Chip from "@mui/material/Chip";

const formatCountry = (value: string) => value;
const formatCurrency = (value: string) => value;
const formatCustomNameTag = (value: string) => value;
const formatBankName = (value: string) => value;
const formatAccountType = (value: string) => value;
const formatAccountNumber = (value: string) => value;

const StatusChip = ({ status }: { status: string }) => {
  let chipColor: "success" | "warning" | "default" = "default";
  let label = status;

  if (status === "Verified") {
    chipColor = "success";
  } else if (status === "Unverified") {
    chipColor = "warning";
  }

  return (
    <Chip
      label={label}
      color={chipColor}
      size="small"
      sx={{
        height: "32px",
        width: "110px",
        minWidth: "0 !important",
      }}
    />
  );
};

const RemoveAccountChip = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation("ManageBankAccounts");
  return (
    <Chip
      label={t("Delete")}
      onClick={onClick}
      color="primary"
      sx={{
        width: "90px",
        minWidth: "0 !important",
        fontSize: "12px",
        cursor: "pointer",
        marginLeft: "35px",
      }}
    />
  );
};

export const getManageBankAccountTableColumns = (
  theme: Theme,
  handleRemoveAccount: (accountNumber: string) => void,
  t: (key: string, options?: any) => string,
): ColumnDef<any, any>[] => {
  return [
    {
      accessorKey: "country",
      header: t("Country"),
      enableResizing: true,
      meta: {},
      cell: props => formatCountry(props.getValue()),
    },
    {
      accessorKey: "currency",
      header: t("Currency"),
      enableResizing: true,
      cell: props => (
        <Typography
          fontSize="inherit"
          sx={{
            maxWidth: "100%",
            [theme.breakpoints.down("sm")]: {
              maxWidth: 90,
              paddingLeft: 1,
            },
          }}
          noWrap
          {...props}>
          {formatCurrency(props.getValue())}
        </Typography>
      ),
    },
    {
      accessorKey: "customName",
      header: t("CustomNameTag"),
      enableResizing: true,
      minSize: 100,
      meta: {},
      cell: props => formatCustomNameTag(props.getValue()),
    },
    {
      accessorKey: "bankName",
      header: t("BankName"),
      enableResizing: true,
      cell: props => (
        <Box
          sx={{
            borderRadius: 10,
            px: 2,
            py: 0.4,
            width: "max-content",
            flex: 1,
          }}>
          {formatBankName(props.getValue())}
        </Box>
      ),
    },
    {
      accessorKey: "accountType",
      header: t("AccountType"),
      enableResizing: true,
      cell: props => formatAccountType(props.getValue() as string),
    },
    {
      accessorKey: "accountNumber",
      header: t("AccountNumber"),
      enableResizing: true,
      cell: props => formatAccountNumber(props.getValue() as string),
    },
    {
      accessorKey: "status",
      header: () => <div style={{ marginLeft: "25px" }}>{t("Status")}</div>,
      enableResizing: true,
      cell: props => <StatusChip status={props.getValue() as string} />,
    },
    {
      accessorKey: "removeAccount",
      header: () => <div style={{ marginLeft: "20px" }}>{t("RemoveAccount")}</div>,
      enableResizing: true,
      cell: props => (
        <RemoveAccountChip
          onClick={() => {
            const accountId = props.row.original.id;
            handleRemoveAccount(accountId);
          }}
        />
      ),
    },
  ];
};
