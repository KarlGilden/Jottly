import { Route, Routes, useLocation } from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";
import Navbar from "./components/Navbar/Navbar";
import { EntryDetailPage } from "./pages/EntryDetailPage";
import { JournalPage } from "./pages/JournalPage";
import { PublicLandingPage } from "./pages/PublicLandingPage";
import { ReviewPage } from "./pages/ReviewPage";
import { SavedWordsPage } from "./pages/SavedWordsPage";
import { SettingsPage } from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";

function AppContent() {
	const location = useLocation();
	const isHomePage = location.pathname === "/";
	const isLogin = location.pathname === "/login";

	return (
		<div className="w-full flex flex-col items-center min-h-screen bg-background text-foreground">
			{!isHomePage && !isLogin ? <Navbar /> : null}
			<main className="app-content-shell flex flex-1 justify-center">
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
					<Route path="/login" element={<LoginPage />} />
				</Routes>
			</main>
		</div>
	);
}

export function App() {
	return <AppContent />;
}
