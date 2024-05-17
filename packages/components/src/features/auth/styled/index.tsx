import { Button, styled } from "@mui/material"
import { Box } from "@mui/system"

import cn from "classnames"

export const MarginCard = styled(Box)`
  margin-top: 70px;
  margin-bottom: 18px;
`

export const ActionCard = styled(Box)`
  margin-bottom: 18px;
`

export const CenterLink:any = styled("a")`
  text-align: center;
  font-size: 15px;
`

export const TextLeftButton = styled(Button)`
  box-sizing: border-box;

  & .linkButton {
    box-sizing: border-box;
  }

  & a {
    &:hover,
    &,
    &:active,
    &:focus,
    &:visited {
      text-align: left;
    }
  }
`

export interface DocsButtonProps {
  title: string
  href?: string
  onClick?: () => void
  testid: string
  disabled?: boolean
  unresponsive?: boolean
}

export const DocsButton = ({
  title,
  href,
  onClick,
  testid,
  disabled,
  unresponsive,
}: DocsButtonProps) => (
  <div className={cn("col-xs-4", { "col-md-12": !unresponsive })}>
    <div className="box">
      <TextLeftButton
        onClick={onClick}
        disabled={disabled}
        data-testid={testid}
        href={href}
      >
        {title}
      </TextLeftButton>
    </div>
  </div>
)
