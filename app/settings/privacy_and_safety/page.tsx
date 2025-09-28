import PrivacyAndSafetyPage from "@/components/settings/privacy-and-safety"
import { getMutedAndBlockedUsers } from "@/utils/get-user"
import { ps } from "@/utils/ps"

export default async function ProfileSettingsPage() {
  const mutedAndBlocked = await getMutedAndBlockedUsers()
  const muted = mutedAndBlocked?.muted ?? []
  const blocked = mutedAndBlocked?.blocked ?? []
  return (
    <PrivacyAndSafetyPage mutedUsers={ps(muted)} blockedUsers={ps(blocked)} />
  )
}
