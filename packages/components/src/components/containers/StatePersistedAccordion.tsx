import { Accordion, AccordionProps } from "@mui/material"
import { setAccordionState, useAppDispatch, useAppSelector } from "../../slices"

export type StatePersistedAccordionProps = Omit<AccordionProps, "expanded" | "onChange"> & {
  persistKey: string
}
export function StatePersistedAccordion({
  persistKey,
  defaultExpanded,
  ...props
}: StatePersistedAccordionProps) {
  const accordionsState = useAppSelector(state => state.ui.accordions)
  const dispatch = useAppDispatch()
  const expanded = accordionsState[persistKey]
  if (expanded === undefined) {
    dispatch(
      setAccordionState({
        key: persistKey,
        open: Boolean(defaultExpanded),
      }),
    )
  }

  const onExpandedChange = () => {
    dispatch(
      setAccordionState({
        key: persistKey,
        open: !expanded,
      }),
    )
  }
  return (
    <Accordion
      {...props}
      onChange={onExpandedChange}
      defaultExpanded
      expanded={expanded}
    />
  )
}
