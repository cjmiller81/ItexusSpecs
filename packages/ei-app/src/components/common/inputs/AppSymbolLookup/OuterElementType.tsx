import * as React from "react"
import { OuterElementContext } from "./ListBoxComponent"

export const OuterElementType = React.forwardRef<HTMLDivElement>(function MyComponent(props, ref) {
  const outerProps = React.useContext(OuterElementContext)
  return (
    <div
      ref={ref}
      {...props}
      {...outerProps}
    />
  )
})
