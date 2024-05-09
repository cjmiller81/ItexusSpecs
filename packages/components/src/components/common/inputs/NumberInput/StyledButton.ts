import { numberInputClasses } from "@mui/base/Unstable_NumberInput"
import { styled } from "@mui/system"

export const StyledButton = styled("button")(
  ({ theme }) => `
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    appearance: none;
    padding: 0;
    width: 19px;
    height: 19px;
    font-family: system-ui, sans-serif;
    font-size: 0.875rem;
    line-height: 1;
    box-sizing: border-box;
    background: ${theme.palette.background.paper};
    border: 0;
    border-color: ${theme.palette.divider};
    color: ${theme.palette.text.primary};
   
    &:hover {
      background: ${theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[50]};
      border-color: ${theme.palette.divider};
      cursor: pointer;
    }
  
    &.${numberInputClasses.incrementButton} {
      grid-column: 2/3;
      grid-row: 1/2;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      border: 1px solid;
      border-bottom: 0;
      border-color: ${theme.palette.divider};
      background: ${theme.palette.background.paper};
      color: ${theme.palette.text.main};
  
      &:hover {
        cursor: pointer;
        color: #FFF;
        background: ${theme.palette.primary.main};
        border-color: ${theme.palette.primary.main};
      }
    }
  
    &.${numberInputClasses.decrementButton} {
      grid-column: 2/3;
      grid-row: 2/3;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      border: 1px solid;
      border-color: ${theme.palette.divider};
      background: ${theme.palette.background.paper};
      color: ${theme.palette.text.main};
    }
  
    &:hover {
      cursor: pointer;
      color: #FFF;
      background: ${theme.palette.primary.main};
      border-color: ${theme.palette.primary.main};
    }
  
    & .arrow {
      transform: translateY(-1px);
    }
  
    & .arrow {
      transform: translateY(-1px);
    }
  `,
)
