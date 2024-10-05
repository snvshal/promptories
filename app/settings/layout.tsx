import SettingsTabs from "@/components/settings/settings-tabs";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="main-content">
      <div className="max-md:p-4">
        <h1 className="mb-6 text-3xl font-bold">Settings</h1>
        <SettingsTabs />
        {children}
      </div>
    </main>
  );
}
