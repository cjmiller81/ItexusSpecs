import React from "react";
import { Button, ButtonGroup } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export interface TabOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface TabSelectorProps {
  options: TabOption[];
  value: string;
  onChange: (value: string) => void;
  fullWidth?: boolean;
  sx?: object;
}



export const TabSelector: React.FC<TabSelectorProps> = ({
  options,
  value,
  onChange,
  fullWidth = false,
  sx = {},
}) => {
  const theme = useTheme();
  return (
    <ButtonGroup
      variant="contained"
      sx={{
        borderRadius: "8px",
        boxShadow: "none",
        overflow: "hidden",
        ...sx,
      }}
      fullWidth={fullWidth}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <Button
            key={option.value}
            onClick={() => onChange(option.value)}
            startIcon={option.icon}
            sx={{
              backgroundColor: isSelected
                ? "#22D6A6"
                : theme.palette.mode === 'dark' ? "#23242B" : "#f7f5f2",
              color: isSelected
                ? "#fff"
                : theme.palette.mode === 'dark' ? "#bdbdbd" : "#222",
              fontWeight: 700,
              border: "none",
              borderRadius: "8px",
              boxShadow: "none",
              px: 3,
              py: 1.2,
              fontSize: "0.7rem",
              '&:hover': {
                backgroundColor: isSelected
                  ? "#1FC89B"
                  : theme.palette.mode === 'dark' ? "#2C2D34" : "#ececec",
              },
              minWidth: 0,
              transition: "background 0.2s, color 0.2s",
            }}
            disableElevation
          >
            {option.label}
          </Button>
        );
      })}
    </ButtonGroup>
  );
};
