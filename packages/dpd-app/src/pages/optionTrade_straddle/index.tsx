import StraddleSection from "@/features/Straddle/StraddleSection";
import { useTranslation } from "react-i18next";

export default function OptionTrade_stardlleView() {
  const {t} = useTranslation("OptionTradeCalls");
  return (
    <>   
      <StraddleSection />
    </>
  );
}
