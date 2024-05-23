import { PageTitle, useOry } from "components"

export default function HomePage() {
  const { session } = useOry()
  const firstName = session?.identity?.traits.name.first

  return (
    <>
      <PageTitle sx={{ textWrap: "nowrap", minWidth: "300px" }}>Welcome, {firstName}</PageTitle>
    </>
  )
}
