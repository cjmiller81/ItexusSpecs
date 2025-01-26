import React from "react"
import i18next from "@/libs/i18n/i18n"
import { useTheme } from "@mui/material/styles"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery } from "@mui/material"
import { Box, Stack } from "@mui/system"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3"
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"

import MainCard from "@/components/MainCard"
import ScrollX from "@/components/ScrollX"
import RolesCell from "features/users/rolesCell"
import AdminUserAvatar from "features/users/adminUserAvatar"
import { TableColumnTitles, UsersTableProps } from "features/users/iAdminUser"

export const UsersTable: React.FC<UsersTableProps> = ({
  rows,
  handleDeleteRole,
  fetchPermissions,
  permissions,
  setIsRoleModalOpen,
  isRoleModalOpen,
  handleRoleModalSave,
  id,
  ...props
}) => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"))

  const columns: ColumnDef<TableColumnTitles>[] = [
    {
      accessorKey: "AvatarUrl",
      header: i18next.t("AvatarUrl", { ns: "ColumnsDefs" }),
      cell: info => <AdminUserAvatar id={info.row.original.id} />,
    },
    { accessorKey: "FirstName", header: i18next.t("FirstName", { ns: "ColumnsDefs" }) },
    { accessorKey: "LastName", header: i18next.t("LastName", { ns: "ColumnsDefs" }) },
    { accessorKey: "Email", header: i18next.t("Email", { ns: "ColumnsDefs" }) },
    { accessorKey: "Newsletter", header: i18next.t("Newsletter", { ns: "ColumnsDefs" }) },
    {
      accessorKey: "permissions",
      header: i18next.t("Permissions", { ns: "ColumnsDefs" }),
      cell: info => (
        <RolesCell
          id={info.row.original.id}
          handleDeleteRole={handleDeleteRole}
          fetchPermissions={fetchPermissions}
          setIsRoleModalOpen={setIsRoleModalOpen}
        />
      ),
    },
  ]

  return (
    <Box {...props}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MainCard
          content={false}
          sx={{ bgcolor: "primary.lighter", position: "relative" }}>
          <ReactTable
            data={rows}
            columns={columns}
            isSmallScreen={isSmallScreen}
          />
        </MainCard>
      </LocalizationProvider>
    </Box>
  )
}

function ReactTable({
  data,
  columns,
  isSmallScreen,
}: {
  data: TableColumnTitles[]
  columns: ColumnDef<TableColumnTitles>[]
  isSmallScreen: boolean
}) {
  const theme = useTheme()
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: false,
  })

  if (isSmallScreen) {
    return (
      <Box sx={{ backgroundColor: theme.palette.background.paper }}>
        {table.getRowModel().rows.map(row => (
          <Box
            key={row.id}
            sx={{
              mb: 2,
              p: 2,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
            }}>
            {row.getVisibleCells().map(cell => {
              return (
                <Box
                  key={cell.id}
                  sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  {/* @ts-ignore */}
                  <Box sx={{ fontWeight: "bold" }}>{flexRender(cell.column.columnDef.header, cell.getContext())}</Box>
                  <Box>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Box>
                </Box>
              )
            })}
          </Box>
        ))}
      </Box>
    )
  }

  return (
    <ScrollX>
      <Stack>
        <TableContainer>
          <Table sx={{ backgroundColor: theme.palette.background.paper }}>
            <TableHead>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableCell
                      key={header.id}
                      align="center"
                      sx={{ padding: "8px" }}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      sx={{ padding: "8px" }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </ScrollX>
  )
}
