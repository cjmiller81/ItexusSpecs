import { useTranslation } from "react-i18next";
import { Box, Theme } from "@mui/system";
import { ColumnDef } from "@tanstack/react-table";
import Chip from "@mui/material/Chip";

const formatAddress = (value: string) => value;
const formatAddressTagMemo = (value: string) => value;
const formatBlockchain = (value: string) => value;

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

const RemoveAddressChip = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation("ManageCryptoAddresses");
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

export const getManageCryptoAddressesTableColumns = (
  theme: Theme,
  handleRemoveAddress: (addressId: string) => void,
  t: (key: string, options?: any) => string,
): ColumnDef<any, any>[] => {
  return [
    {
      accessorKey: "walletAddress",
      header: t("Address"),
      enableResizing: true,
      meta: {},
      cell: props => formatAddress(props.getValue()),
    },
    {
      accessorKey: "status",
      header: () => <div style={{ marginLeft: "25px" }}>{t("Status")}</div>,
      enableResizing: true,
      cell: props => <StatusChip status={props.getValue() as string} />,
    },
    {
      accessorKey: "addressTagMemo",
      header: t("AddressTagMemo"),
      enableResizing: true,
      minSize: 100,
      meta: {},
      cell: props => formatAddressTagMemo(props.getValue()),
    },
    {
      accessorKey: "blockchain",
      header: t("Blockchain"),
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
          {formatBlockchain(props.getValue())}
        </Box>
      ),
    },
    {
      accessorKey: "removeAddress",
      header: () => <div style={{ marginLeft: "20px" }}>{t("RemoveAddress")}</div>,
      enableResizing: true,
      cell: props => (
        <RemoveAddressChip
          onClick={() => {
            const addressId = props.row.original.id;
            handleRemoveAddress(addressId);
          }}
        />
      ),
    },
  ];
};
