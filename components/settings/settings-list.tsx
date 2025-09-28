"use client"

import { ChevronRight } from "lucide-react"
import { Button } from "../ui/button"
import { NavigateBackHeader } from "../home"
import { useMemo, useState } from "react"
import { Input } from "../ui/input"
import Link from "next/link"
import { cl } from "@/utils/ps"
import { cn } from "@/lib/utils"

const settingsOptions = [
  { id: "profile", label: "Your Profile" },
  { id: "username", label: "Username" },
  { id: "appearance", label: "Appearance" },
  { id: "privacy_and_safety", label: "Privacy & Safety" },
  { id: "account", label: "Your Account" },
]

export function SettingsList() {
  const [search, setSearch] = useState("")

  const filteredSettings = useMemo(() => {
    if (!search) return settingsOptions

    return settingsOptions
      .filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase()),
      )
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [search])

  return (
    <div>
      <div className="w-full px-4 py-6">
        <Input
          placeholder="Search settings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>

      <div>
        {filteredSettings.map((option) => (
          <Link key={option.id} href={cl("settings", option.id)}>
            <Button
              variant="ghost"
              className="h-12 w-full justify-between rounded-none pl-6 text-base"
            >
              <span>{option.label}</span>
              <ChevronRight className="h-6 w-6 text-muted-foreground" />
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}

type SettingsContentCardProps = {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function SettingsContentCard({
  title,
  description,
  children,
  className,
}: SettingsContentCardProps) {
  return (
    <div className="w-full">
      <NavigateBackHeader page={title} />
      <main className="main-content">
        <div className={cn("space-y-6 px-4 py-6", className)}>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          <div className="space-y-6">{children}</div>
        </div>
        <div className="h-20 w-full" />
      </main>
    </div>
  )
}
