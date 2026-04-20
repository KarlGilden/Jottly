import { useAuth, useClerk, useUser } from "@clerk/react";
import { useEffect, useState } from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { defaultLanguage, languageOptions } from "./constants/languages";
import { EntryDetailPage } from "./pages/EntryDetailPage";
import { JournalPage } from "./pages/JournalPage";
import { PublicLandingPage } from "./pages/PublicLandingPage";
import { ReviewPage } from "./pages/ReviewPage";
import { SavedWordsPage } from "./pages/SavedWordsPage";
import { SettingsPage } from "./pages/SettingsPage";

const THEME_STORAGE_KEY = "journal-lang-theme";

type ThemeMode = "light" | "dark";

function AppContent() {
	const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);
	const { isLoaded, isSignedIn } = useAuth();
	const { openSignIn } = useClerk();
	const { user } = useUser();
	const location = useLocation();
	const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
		if (typeof window === "undefined") {
			return "light";
		}

		return window.localStorage.getItem(THEME_STORAGE_KEY) === "dark"
			? "dark"
			: "light";
	});
	const navigationClassName = ({ isActive }: { isActive: boolean }) =>
		[
			"rounded-md px-3 py-2 text-sm font-medium transition-colors",
			isActive
				? "bg-primary text-primary-foreground"
				: "text-muted-foreground hover:bg-muted hover:text-foreground",
		].join(" ");

	useEffect(() => {
		document.documentElement.classList.toggle("dark", themeMode === "dark");
		window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
	}, [themeMode]);

  const isHomePage = location.pathname === "/";

	if (!isLoaded) {
		return (
			<div className="min-h-screen bg-background text-foreground">
				<div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
					<p className="text-sm text-muted-foreground">Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background text-foreground">
			<div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        {!isHomePage ? (
          <header className="mb-8 flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <NavLink to="/" className="text-2xl font-semibold">
                Jottly
              </NavLink>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <nav className="flex gap-2">
                <NavLink to="/journal" className={navigationClassName}>
                  Journal
                </NavLink>
                <NavLink to="/review" className={navigationClassName}>
                  Review
                </NavLink>
                <NavLink to="/settings" className={navigationClassName}>
                  Settings
                </NavLink>
                {isSignedIn ? (
                  <>
                    <label className="flex items-center gap-2 text-sm text-muted-foreground">
                      <select
                        className="rounded-md border border-border bg-input-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
                        value={selectedLanguage}
                        onChange={(event) => setSelectedLanguage(event.target.value)}
                      >
                        {languageOptions.map((language) => (
                          <option key={language.code} value={language.code}>
                            {language.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <NavLink to="/settings" className="flex items-center pl-1">
                      {user?.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt={user.firstName ?? "User"}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground">
                          U
                        </span>
                      )}
                    </NavLink>
                  </>
                ) : (
                  <button
                    type="button"
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    onClick={() => openSignIn()}
                  >
                    Sign In
                  </button>
                )}
              </nav>
            </div>
          </header>
        ) : null}
				<main className="flex-1">
					<Routes>
						<Route path="/" element={<PublicLandingPage />} />
						<Route
              path="/journal"
              element={
                <ProtectedRoute>
                  <JournalPage selectedLanguage={selectedLanguage} />
                </ProtectedRoute>
              }
            />
						<Route
              path="/review"
              element={
                <ProtectedRoute>
                  <ReviewPage />
                </ProtectedRoute>
              }
            />
						<Route
							path="/entries/:id"
							element={
                <ProtectedRoute>
                  <EntryDetailPage selectedLanguage={selectedLanguage} />
                </ProtectedRoute>
              }
						/>
						<Route
              path="/saved-words"
              element={
                <ProtectedRoute>
                  <SavedWordsPage />
                </ProtectedRoute>
              }
            />
						<Route
							path="/settings"
							element={
                <ProtectedRoute>
                  <SettingsPage
                    themeMode={themeMode}
                    onThemeChange={setThemeMode}
                  />
                </ProtectedRoute>
							}
						/>
					</Routes>
				</main>
			</div>
		</div>
	);
}

export function App() {
  return <AppContent />;
}
