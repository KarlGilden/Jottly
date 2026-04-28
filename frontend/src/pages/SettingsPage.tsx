import { useState } from "react";

import { ApiKeyStatus, useLingqStatus, useSetLingqApiKey } from "../api/lingq";
import { useTheme } from "../contexts/ThemeContext";

export function SettingsPage() {
	const { themeMode, setThemeMode } = useTheme();

	const [apiKey, setApiKey] = useState("");
	const [showApiKey, setShowApiKey] = useState(false);

	const { data: lingqStatus, isLoading: isLingqStatusLoading } =
		useLingqStatus();
	const setLingqApiKeyMutation = useSetLingqApiKey();

	const handleSubmit = () => {
		const trimmedApiKey = apiKey.trim();

		if (!trimmedApiKey) {
			return;
		}

		setLingqApiKeyMutation.mutate(trimmedApiKey, {
			onSuccess: () => {
				setApiKey("");
			},
		});
	};

	let status;

	switch (lingqStatus?.connected) {
		case ApiKeyStatus.Connected:
			status = "Connected";
			break;
		case ApiKeyStatus.NotConnected:
			status = "Not connected";
			break;
		case ApiKeyStatus.InvalidKey:
			status = "Invalid API Key";
			break;
	}

	return (
		<div className="w-full max-w-[900px] py-8 space-y-5">
			<div>
				<h2 className="text-2xl font-semibold">Settings</h2>
				<p className="text-sm text-muted-foreground">
					Manage your display mode and LingQ integration.
				</p>
			</div>

			<section className="space-y-3 rounded-xl border border-border p-5">
				<div>
					<h3 className="text-lg font-semibold">Appearance</h3>
					<p className="text-sm text-muted-foreground">
						Choose a display mode.
					</p>
				</div>

				<div className="inline-flex rounded-md bg-muted p-1">
					<button
						type="button"
						className={[
							"rounded-md px-3 py-2 text-sm transition-colors",
							themeMode === "light"
								? "bg-primary text-primary-foreground"
								: "text-muted-foreground hover:text-foreground",
						].join(" ")}
						onClick={() => setThemeMode("light")}
					>
						Light mode
					</button>
					<button
						type="button"
						className={[
							"rounded-md px-3 py-2 text-sm transition-colors",
							themeMode === "dark"
								? "bg-primary text-primary-foreground"
								: "text-muted-foreground hover:text-foreground",
						].join(" ")}
						onClick={() => setThemeMode("dark")}
					>
						Dark mode
					</button>
				</div>
			</section>

			<section className="space-y-4 rounded-xl border border-border p-5">
				<div className="space-y-1">
					<h3 className="text-lg font-semibold">LingQ Integration</h3>
					<p className="text-sm text-muted-foreground">
						Save your LingQ API key securely on the backend. The key is never
						returned to the browser.
					</p>
				</div>

				<p className="text-sm text-muted-foreground">
					Status:{" "}
					<span className="font-medium text-foreground">
						{isLingqStatusLoading ? "Checking..." : status}
					</span>
				</p>

				<div className="flex flex-col gap-3 sm:flex-row">
					<input
						type={showApiKey ? "text" : "password"}
						value={apiKey}
						onChange={(event) => setApiKey(event.target.value)}
						placeholder="Enter LingQ API key"
						className="flex-1 rounded-md border border-border bg-input-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
						autoComplete="off"
					/>
					<button
						type="button"
						className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
						onClick={() => setShowApiKey((currentValue) => !currentValue)}
					>
						{showApiKey ? "Hide" : "Show"}
					</button>
				</div>

				<div className="flex items-center gap-3">
					<button
						type="button"
						disabled={
							setLingqApiKeyMutation.isPending || apiKey.trim().length === 0
						}
						className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
						onClick={handleSubmit}
					>
						{setLingqApiKeyMutation.isPending
							? "Saving..."
							: lingqStatus?.connected
								? "Update Key"
								: "Connect"}
					</button>

					{setLingqApiKeyMutation.isSuccess ? (
						<p className="text-sm text-foreground">Saved.</p>
					) : null}

					{setLingqApiKeyMutation.isError ? (
						<p className="text-sm text-destructive">
							{setLingqApiKeyMutation.error.message}
						</p>
					) : null}
				</div>
			</section>
		</div>
	);
}
