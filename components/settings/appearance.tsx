"use client"

import { Label } from "@/components/ui/label"

// import { Button } from "@/components/ui/button"
// import { Switch } from "@/components/ui/switch"

import { NextThemes } from "@/components/ui/theme-provider"
import { SettingsContentCard } from "./settings-list"

export default function AppearanceSettings() {
  return (
    <SettingsContentCard
      title="Appearance"
      description="Customize your app experience."
    >
      <div className="space-y-2">
        <Label htmlFor="theme">Theme</Label>
        <NextThemes />
      </div>
      {/* <div className="flex items-center space-x-2">
          <Switch id="notifications" />
          <Label htmlFor="notifications">Enable notifications</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="sound" />
          <Label htmlFor="sound">Enable sound effects</Label>
        </div>
        <Button>Save Appearance Settings</Button> */}
    </SettingsContentCard>
  )
}
