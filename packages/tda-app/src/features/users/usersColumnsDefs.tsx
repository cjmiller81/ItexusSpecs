import i18next from "@/libs/i18n/i18n"
import { GridColDef } from "@mui/x-data-grid"
import RolesCell from "./rolesCell"

export function getColumns(handleDeleteRole, fetchPermissions, permissions, setIsRoleModalOpen, isRoleModalOpen, handleRoleModalSave): GridColDef[] {
  return [
    {
      field: "AvatarUrl",
      headerName: i18next.t("AvatarUrl", { ns: "ColumnsDefs" }),
      minWidth: 200,
      editable: true,
      type: "string",
      flex: 1,
    },
    {
      field: "FirstName",
      headerName: i18next.t("FirstName", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: true,
      type: "string",
      flex: 1,
      width: 100,
    },
    {
      field: "LastName",
      headerName: i18next.t("LastName", { ns: "ColumnsDefs" }),
      minWidth: 200,
      editable: true,
      type: "string",
      flex: 1,
      width: 100,
    },
    {
      field: "Email",
      headerName: i18next.t("Email", { ns: "ColumnsDefs" }),
      minWidth: 200,
      editable: true,
      type: "string",
      flex: 1,
      width: 200,
    },
    {
      field: "Newsletter",
      headerName: i18next.t("Newsletter", { ns: "ColumnsDefs" }),
      editable: true,
      type: "boolean",
      flex: 1,
      width: 100,
    },
    {
      field: "roles",
      headerName: i18next.t("Roles", { ns: "ColumnsDefs" }),
      minWidth: 100,
      editable: false,
      flex: 2,
      renderCell: (params) => (
        <RolesCell
          {...params}
          handleDeleteRole={handleDeleteRole}
          fetchPermissions={fetchPermissions}
          permissions={permissions}
          setIsRoleModalOpen={setIsRoleModalOpen}
          isRoleModalOpen={isRoleModalOpen}
          handleRoleModalSave={handleRoleModalSave}
        />
      ),
    },
  ]
}
