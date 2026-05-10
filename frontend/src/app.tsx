import { Route, Routes, useLocation } from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";
import Navbar from "./components/Navbar/Navbar";
import { EntryDetailPage } from "./pages/EntryDetailPage";
import { JournalPage } from "./pages/JournalPage";
import { PublicLandingPage } from "./pages/PublicLandingPage";
import { ReviewPage } from "./pages/ReviewPage";
import { SettingsPage } from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import { routes } from "./constants/routes";

function AppContent() {
	const location = useLocation();
	const isHomePage = location.pathname === "/";
	const isLogin = location.pathname === "/login";

	return (
		<main className="w-full flex flex-col items-center h-screen min-h-screen bg-white text-main-text font-primary font-600">
			{!isHomePage && !isLogin ? <Navbar /> : null}
			<Routes>
				<Route path={routes.HOME} element={<PublicLandingPage />} />
				<Route
					path={routes.JOURNAL}
					element={
						<ProtectedRoute>
							<JournalPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path={routes.REVIEW}
					element={
						<ProtectedRoute>
							<ReviewPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path={routes.ENTRIES(":id")}
					element={
						<ProtectedRoute>
							<EntryDetailPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path={routes.SETTINGS}
					element={
						<ProtectedRoute>
							<SettingsPage />
						</ProtectedRoute>
					}
				/>
				<Route path={routes.LOGIN} element={<LoginPage />} />
			</Routes>
		</main>
	);
}

export function App() {
	return <AppContent />;
}
