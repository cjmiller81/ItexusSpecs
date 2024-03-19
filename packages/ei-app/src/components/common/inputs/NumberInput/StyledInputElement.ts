import { styled } from "@mui/system"

export const StyledInputElement = styled("input")(
  ({ theme }) => `
    font-size: 0.875rem;
    font-family: inherit;
    font-weight: 400;
    line-height: 1.5;
    width: 100%;
    min-width: 10px;
    grid-column: 1/2;
    grid-row: 1/3;
    color: ${theme.palette.text.primary};
    background: inherit;
    border: none;
    border-radius: inherit;
    padding: 8px 12px;
    outline: 0;
  `,
)
