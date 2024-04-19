import { setAccordionState } from "@/libs/redux/Slices/UiSlice"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import { Accordion, AccordionProps } from "@mui/material"

export type StatePersistedAccordionProps = Omit<AccordionProps, "expanded" | "onChange"> & {
  persistKey: string
}
export default function StatePersistedAccordion({
  persistKey,
  defaultExpanded,
  ...props
}: StatePersistedAccordionProps) {
  const accordionsState = useAppSelector(state => state.walletsReducer.ui.accordions)
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
