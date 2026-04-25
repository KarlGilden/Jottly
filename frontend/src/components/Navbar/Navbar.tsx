import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Language, languageOptions } from "../../constants/languages";
import { useAuth, useClerk, useUser } from "@clerk/react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function Navbar() {
	const { language, setLanguage } = useLanguage();
	const { isLoaded, isSignedIn } = useAuth();
	const { openSignIn } = useClerk();
	const { user } = useUser();

	const navigationClassName = ({ isActive }: { isActive: boolean }) =>
		[
			"rounded-md px-3 py-2 text-sm font-medium transition-colors",
			isActive
				? "bg-primary text-primary-foreground"
				: "text-muted-foreground hover:bg-muted hover:text-foreground",
		].join(" ");

	return (
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
									value={language}
									onChange={(event) =>
										setLanguage(event.target.value as Language)
									}
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
	);
}
