import {
  SettingsContentCard,
  SettingsList,
} from "@/components/settings/settings-list"

export default function SettingsPage() {
  return (
    <SettingsContentCard title="Settings" className="p-0">
      <SettingsList />
    </SettingsContentCard>
  )
}
