import { getSchwabAccountList, getSchwabConnectUrl } from "@/features/strategies/userProfileSlice";
import { PageTitle, useAppDispatch } from "components"
import { useEffect } from "react";

export default function HomePage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getSchwabAccountList());
  }, [dispatch]);
  
  return (
    <>
      <PageTitle sx={{ textWrap: "nowrap", minWidth: "300px" }}>Home Page</PageTitle>
    </>
  )
}