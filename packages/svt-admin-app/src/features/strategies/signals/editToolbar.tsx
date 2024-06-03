import AddIcon from "@mui/icons-material/Add"
import Button from "@mui/material/Button"
import { GridToolbarContainer } from "@mui/x-data-grid"
import { useTranslation } from "react-i18next"

interface EditToolbarProps {
  onAddClick: () => void
}

export function EditToolbar(props: EditToolbarProps) {
  const { onAddClick } = props
  const { t } = useTranslation("EditToolbar")
  return (
    <GridToolbarContainer>
      <Button
        variant="outlined"
        sx={{ color: "text.primary" }}
        startIcon={<AddIcon />}
        onClick={onAddClick}>
        {t("AddSignal")}
      </Button>
    </GridToolbarContainer>
  )
}
