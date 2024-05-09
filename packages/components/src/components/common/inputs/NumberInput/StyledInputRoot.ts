import { numberInputClasses } from "@mui/base/Unstable_NumberInput"
import { styled } from "@mui/system"

export const StyledInputRoot = styled("div")(
  ({ theme }) => `
    font-weight: 400;
    border-radius: ${theme.shape.borderRadius}px;
    color: ${theme.palette.mode === "dark" ? theme.palette.grey[300] : theme.palette.grey[900]};
    background: ${theme.palette.background.paper};
    border: 1px solid ${theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[200]};
  
    display: grid;
    grid-template-columns: 1fr 19px;
    grid-template-rows: 1fr 1fr;
    overflow: hidden;
    column-gap: 8px;
    padding: 4px;
  
    &.${numberInputClasses.focused} {
      border-color: ${theme.palette.primary.main};
    }
  
    &:hover {
      border-color: ${theme.palette.mode === "dark" ? theme.palette.grey[200] : theme.palette.grey[700]};
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `,
)
