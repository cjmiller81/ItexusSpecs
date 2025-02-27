
import CallSetListSection from "@/features/CallSetList/CallSetListSection";
import { useTranslation } from "react-i18next";

export default function CallSetListView() {
  const {t} = useTranslation("OptionTradeCalls");
  return (
    <>   
      <CallSetListSection />
    </>
  );
}
