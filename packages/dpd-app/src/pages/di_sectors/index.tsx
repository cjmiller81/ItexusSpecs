import { PageTitle } from "components";
import { useTranslation } from "react-i18next";

export default function SingleStockView() {
  const { t } = useTranslation("SideBar");
  return (
    <>
      <PageTitle sx={{ textWrap: "nowrap", minWidth: "300px" }}>{t("SectorsView")}</PageTitle>
    </>
  );
}
