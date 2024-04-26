import { getNodeLabel } from "@ory/integrations/ui"

import { Checkbox, FormControlLabel } from "@mui/material"
import { NodeInputProps } from "./helpers"

export function NodeInputCheckbox({ node, attributes, setValue, disabled }: NodeInputProps) {
  // Render a checkbox.s
  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            name={attributes.name}
            defaultChecked={attributes.value}
            onChange={e => setValue(e.target.checked)}
            disabled={attributes.disabled || disabled}
            title={node.messages.map(({ text }) => text).join("\n")}
          />
        }
        label={getNodeLabel(node)}
      />
    </>
  )
}
