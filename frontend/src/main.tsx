import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

import { App } from "./app";
import "./styles/index.css";
import { AlertProvider } from "./contexts/AlertContext";

const queryClient = new QueryClient();
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
	throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ClerkProvider publishableKey={clerkPublishableKey}>
			<QueryClientProvider client={queryClient}>
				<AlertProvider>
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</AlertProvider>
			</QueryClientProvider>
		</ClerkProvider>
	</React.StrictMode>,
);
