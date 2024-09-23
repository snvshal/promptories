"use client";

import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { NextThemes } from "@/components/ui/theme-provider";

export default function AppearanceSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance Settings</CardTitle>
        <CardDescription>Customize your app experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
          <NextThemes />
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="notifications" />
          <Label htmlFor="notifications">Enable notifications</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="sound" />
          <Label htmlFor="sound">Enable sound effects</Label>
        </div>
        <Button>Save Appearance Settings</Button>
      </CardContent>
    </Card>
  );
}
