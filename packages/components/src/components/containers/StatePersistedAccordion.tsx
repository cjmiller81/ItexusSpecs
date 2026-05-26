import { useEffect } from "react";
import { Accordion, AccordionProps } from "@mui/material";
import { setAccordionState, useAppDispatch, useAppSelector } from "../../slices";

export type StatePersistedAccordionProps = Omit<AccordionProps, "expanded" | "onChange"> & {
  persistKey: string;
};
export function StatePersistedAccordion({ persistKey, defaultExpanded, ...props }: StatePersistedAccordionProps) {
  const storedExpanded = useAppSelector(state => state.ui.accordions[persistKey]);
  const dispatch = useAppDispatch();
  const expanded = storedExpanded ?? Boolean(defaultExpanded);

  useEffect(() => {
    if (storedExpanded === undefined) {
      dispatch(
        setAccordionState({
          key: persistKey,
          open: Boolean(defaultExpanded),
        }),
      );
    }
  }, [persistKey, storedExpanded, defaultExpanded, dispatch]);

  const onExpandedChange = () => {
    dispatch(
      setAccordionState({
        key: persistKey,
        open: !expanded,
      }),
    );
  };
  return (
    <Accordion
      {...props}
      onChange={onExpandedChange}
      expanded={expanded}
    />
  );
}
