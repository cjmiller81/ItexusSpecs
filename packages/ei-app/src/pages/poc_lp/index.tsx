import DefiTokensSectionTest from "@/features/Income/DefiTokensSectionTest";
import { PoolData } from "@/features/Income/Models/PoolData";
import pocLpPools from "@/mocks/data/pocLpPools.json";
import pocLpDexs from "@/mocks/data/pocLpDexs.json";

const ACCORDION_KEY = "DefiTokensSectionPOC";

export default function PocLpPage() {
  const poolsData = pocLpPools as PoolData[];
  const dexsData = pocLpDexs as string[];

  return (
    <DefiTokensSectionTest
      persisKey={ACCORDION_KEY}
      exportFileName="POC LP Mock"
      overrides={{
        pools: poolsData,
        dexs: dexsData,
        title: "POC LP"
      }}
    />
  );
}

