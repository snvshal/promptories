import SettingsTabs from "@/components/settings/settings-tabs";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container p-10">
      <h1 className="mb-6 text-3xl font-bold">Settings</h1>
      <SettingsTabs />
      {children}
    </div>
  );
}
