import Button from "@mui/material/Button";
import { StackProps } from "@mui/system";
import Stack from "@mui/system/Stack";
import { FC } from "react";
import { useTranslation } from "react-i18next";

export type SaveChancelButtonsProps = StackProps & {
  disableSaveButton?: boolean;
  onCancel: () => void;
  onSave?: () => void;
};

export const SaveChancelButtons: FC<SaveChancelButtonsProps> = ({ onSave, onCancel, disableSaveButton, ...props }) => {
  const { t } = useTranslation("CardPaymentForm");
  return (
    <Stack
      direction="row"
      justifyContent="flex-end"
      alignItems="center"
      spacing={2}
      {...props}>
      <Button
        variant="outlined"
        onClick={onCancel}>
        {t("Cancel", { ns: "Common" })}
      </Button>
      <Button
        disabled={disableSaveButton}
        onClick={() => {
          if (onSave) onSave();
        }}
        type="submit"
        variant="contained">
        {t("Save", { ns: "Common" })}
      </Button>
    </Stack>
  );
};
