import CallsSection from "@/features/Calls/CallsSection";
import { useTranslation } from "react-i18next";

export default function OptionTrade_callsView() {
  const {t} = useTranslation("OptionTradeCalls");
  return (
    <>   
      <CallsSection />
    </>
  );
}
