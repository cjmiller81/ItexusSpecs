import { InvestingTableAsset } from "@/models/Wallet/InvestingTableAsset"

export function toCsvFile(assets: InvestingTableAsset[]) {
  let csv = "Symbol,Price,Market Cap,Weight,Qty\n"

  assets.forEach(asset => {
    csv += [asset.symbol, asset.price, asset.marcetCap, asset.weight, asset.qty].join(",")
    csv += "\n"
  })

  const file = new File([csv], "assets.csv", {
    type: "text/csv;charset=utf-8",
  })

  return file
}
