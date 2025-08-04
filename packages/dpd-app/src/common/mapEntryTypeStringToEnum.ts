import { EntryTypeProto } from "@/models/EntryTypeProto";

export function mapEntryTypeStringToEnum(entryTypeStr: string): EntryTypeProto {
  const key = entryTypeStr.toUpperCase();
  switch (key) {
    case "USE_ASK":
      return EntryTypeProto.ENTRY_USE_ASK;
    case "USE_BID":
      return EntryTypeProto.ENTRY_USE_BID;
    case "USE_MID":
      return EntryTypeProto.ENTRY_USE_MID;
    case "ENTRY_MARKET":
      return EntryTypeProto.ENTRY_MARKET;
    default:
      return EntryTypeProto.ENTRY_MARKET;
  }
}