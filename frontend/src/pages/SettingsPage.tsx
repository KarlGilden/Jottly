interface SettingsPageProps {
  themeMode: "light" | "dark";
  onThemeChange: (themeMode: "light" | "dark") => void;
}

export function SettingsPage({ themeMode, onThemeChange }: SettingsPageProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">Choose a display mode.</p>
      </div>

      <div className="inline-flex rounded-md bg-muted p-1">
        <button
          type="button"
          className={[
            "rounded-md px-3 py-2 text-sm transition-colors",
            themeMode === "light" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          ].join(" ")}
          onClick={() => onThemeChange("light")}
        >
          Light mode
        </button>
        <button
          type="button"
          className={[
            "rounded-md px-3 py-2 text-sm transition-colors",
            themeMode === "dark" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          ].join(" ")}
          onClick={() => onThemeChange("dark")}
        >
          Dark mode
        </button>
      </div>
    </div>
  );
}
