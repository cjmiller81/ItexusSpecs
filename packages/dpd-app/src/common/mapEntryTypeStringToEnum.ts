import { EntryTypeProto } from "@/models/EntryTypeProto";

export function mapEntryTypeStringToEnum(entryTypeStr: string): EntryTypeProto {
  const key = entryTypeStr.toUpperCase();
  switch (key) {
    case "BUY_ASK":
      return EntryTypeProto.ENTRY_BUY_ASK;
    case "BUY_BID":
      return EntryTypeProto.ENTRY_BUY_BID;
    case "BUY_MID":
      return EntryTypeProto.ENTRY_BUY_MID;
    case "ENTRY_MARKET":
      return EntryTypeProto.ENTRY_MARKET;
    default:
      return EntryTypeProto.ENTRY_MARKET;
  }
}