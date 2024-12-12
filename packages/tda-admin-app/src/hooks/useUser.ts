// next
import { useOry } from "components"

export default function useUser() {
  const { session } = useOry()
  if (session) {
    const newUser = {
      name: `${session?.identity?.traits.name.first} ${session?.identity?.traits.name.last}`,
      firstName: session?.identity?.traits.name.first,
      lastName: session?.identity?.traits.name.last,
      email: session?.identity?.traits.email,
      avatar: session?.identity?.traits.avatarUrl,
      thumb: session?.identity?.traits.avatarUrl,
      role: "UI/UX Designer",
    }

    return newUser
  }
  throw new Error("User not found")
}
