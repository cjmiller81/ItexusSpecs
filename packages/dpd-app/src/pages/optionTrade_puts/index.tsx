import PutsSection from "@/features/Puts/PutsSection";
import { useTranslation } from "react-i18next";

export default function OptionTrade_putsView() {
  const {t} = useTranslation("OptionTradeCalls");
  return (
    <>   
      <PutsSection />
    </>
  );
}
