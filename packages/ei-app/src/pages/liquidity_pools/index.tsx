import DefiTokensSection from "@/features/Income/DefiTokensSection";
import { DexSection } from "@/features/tradeAggregator/DexSection";

export default function LiquidityPoolsPage() {
  return (
    <>
      <DefiTokensSection persisKey="DefiTokensSection" />
      <DexSection persisKey="DexSection"></DexSection>
    </>
  );
}
