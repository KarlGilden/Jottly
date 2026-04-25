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
import Navbar from "./components/Navbar/Navbar";

function AppContent() {
	const location = useLocation();

	const isHomePage = location.pathname === "/";

	return (
		<div className="min-h-screen bg-background text-foreground">
			<div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
				{!isHomePage ? <Navbar /> : null}
				<main className="flex-1">
					<Routes>
						<Route path="/" element={<PublicLandingPage />} />
						<Route
							path="/journal"
							element={
								<ProtectedRoute>
									<JournalPage />
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
									<EntryDetailPage />
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
									<SettingsPage />
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
