import { NavigateBackHeader } from "@/components/home"
import SettingsTabs from "@/components/settings/settings-tabs"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full">
      <NavigateBackHeader page="Settings" />
      <main className="main-content">
        <div className="p-4">
          <SettingsTabs />
          {children}
        </div>
      </main>
    </div>
  )
}
