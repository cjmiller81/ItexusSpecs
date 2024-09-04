import { DateRange } from "@mui/lab";
import { PickersShortcutsItem } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { getTranslator } from "components";

const T = getTranslator("ShortcutsItems");

export const shortcutsItems: PickersShortcutsItem<DateRange<Dayjs>>[] = [
  {
    label: T("ThisWeek"),
    getValue: () => {
      const today = dayjs();
      return [today.startOf("week"), today.endOf("week")];
    },
  },
  {
    label: T("LastWeek"),
    getValue: () => {
      const today = dayjs();
      const prevWeek = today.subtract(7, "day");
      return [prevWeek.startOf("week"), prevWeek.endOf("week")];
    },
  },
  {
    label: T("Last7Days"),
    getValue: () => {
      const today = dayjs();
      return [today.subtract(7, "day"), today];
    },
  },
  {
    label: T("CurrentMonth"),
    getValue: () => {
      const today = dayjs();
      return [today.startOf("month"), today.endOf("month")];
    },
  },
  { label: T("Reset"), getValue: () => [null, null] },
];
