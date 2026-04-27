import { useAuth } from "@clerk/react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
	children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { isSignedIn, isLoaded } = useAuth();

	if (!isSignedIn && isLoaded) {
		return <Navigate to="/login" replace />;
	}

	return <>{children}</>;
}
