import { useState } from "react";

import { ApiKeyStatus, useLingqStatus, useSetLingqApiKey } from "../api/lingq";
import { useTheme } from "../contexts/ThemeContext";
import Card from "../components/common/Card";
import HeaderText from "../components/common/HeaderText";
import SubheaderText from "../components/common/SubheaderText";
import Button from "../components/common/Button";
import Page from "../components/common/Page";

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
		<Page>
			<div className="flex flex-col gap-5">
				<div>
					<HeaderText text={"Settings"} />
					<SubheaderText
						text={"Manage your display mode and LingQ integration."}
					/>
				</div>

				<Card>
					<div className="flex flex-col gap-5">
						<div>
							<HeaderText text="Appearance" type="h2" />
							<SubheaderText text="Choose a display mode" />
						</div>

						<div className="inline-flex rounded-md bg-muted">
							<Button
								onClick={() => setThemeMode("light")}
								content="Light mode"
								color={themeMode === "light" ? "primary" : "secondary"}
								size="sm"
							/>
							<Button
								onClick={() => setThemeMode("dark")}
								content="Dark mode"
								color={themeMode === "dark" ? "primary" : "none"}
								size="sm"
							/>
						</div>
					</div>
				</Card>

				<Card>
					<div className="flex flex-col gap-5">
						<div>
							<HeaderText text="LingQ Integration" type="h2" />
							<SubheaderText
								text="Save your LingQ API key securely on the backend. The key is never
						returned to the browser."
							/>
						</div>

						<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
							<div className="w-full">
								<p className="w-full text-sm text-muted-foreground">
									Status:{" "}
									<span className="font-medium text-mute-text">
										{isLingqStatusLoading ? "Checking..." : status}
									</span>
								</p>
								<div className="flex flex-col sm:flex-row gap-2 sm:items-center">
									<input
										type={showApiKey ? "text" : "password"}
										value={apiKey}
										onChange={(event) => setApiKey(event.target.value)}
										placeholder="Enter LingQ API key"
										className="w-full rounded-md border border-border bg-input-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
										autoComplete="off"
									/>
									<Button
										onClick={() =>
											setShowApiKey((currentValue) => !currentValue)
										}
										content={showApiKey ? "Hide" : "Show"}
										color="primary"
										size="sm"
									/>
								</div>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<Button
								onClick={handleSubmit}
								color="primary"
								disabled={
									setLingqApiKeyMutation.isPending || apiKey.trim().length === 0
								}
								content={
									setLingqApiKeyMutation.isPending
										? "Saving..."
										: lingqStatus?.connected
											? "Update Key"
											: "Connect"
								}
								size="sm"
							/>
							{setLingqApiKeyMutation.isSuccess ? (
								<p className="text-sm text-foreground">Saved.</p>
							) : null}

							{setLingqApiKeyMutation.isError ? (
								<p className="text-sm text-destructive">
									{setLingqApiKeyMutation.error.message}
								</p>
							) : null}
						</div>
					</div>
				</Card>
			</div>
		</Page>
	);
}
