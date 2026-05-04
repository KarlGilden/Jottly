import { useAuth, useClerk, useUser } from "@clerk/react";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { NavLink, useLocation } from "react-router-dom";
import LanguageSelector from "../LanguageSelector";

export default function Navbar() {
	const { isSignedIn } = useAuth();
	const { openSignIn } = useClerk();
	const { user } = useUser();
	const location = useLocation();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const navigationClassName = ({ isActive }: { isActive: boolean }) =>
		[
			"rounded-md px-3 py-2 text-sm font-medium transition-colors",
			isActive
				? "bg-primary text-primary-foreground"
				: "text-muted-foreground hover:bg-muted hover:text-foreground",
		].join(" ");

	useEffect(() => {
		setIsMobileMenuOpen(false);
	}, [location.pathname]);

	useEffect(() => {
		document.body.classList.toggle("overflow-hidden", isMobileMenuOpen);

		return () => {
			document.body.classList.remove("overflow-hidden");
		};
	}, [isMobileMenuOpen]);

	const accountControls = isSignedIn ? (
		<>
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
	);

	return (
		<>
			<header className="w-full border-b border-border">
				<div className="app-navbar-shell">
					<div className="flex items-center justify-between md:hidden">
						<NavLink to="/" className="text-2xl font-semibold">
							Jottly
						</NavLink>
						<LanguageSelector />
						<button
							type="button"
							className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
							onClick={() => setIsMobileMenuOpen(true)}
							aria-label="Open navigation menu"
						>
							<FiMenu className="h-6 w-6" />
						</button>
					</div>
					<div className="hidden gap-4 md:flex md:items-center md:justify-between">
						<NavLink to="/" className="text-2xl font-semibold">
							Jottly
						</NavLink>
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
								<LanguageSelector />
								{accountControls}
							</nav>
						</div>
					</div>
				</div>
			</header>

			<div
				className={[
					"fixed inset-0 z-40 bg-foreground/20 transition-opacity duration-200 md:hidden",
					isMobileMenuOpen
						? "pointer-events-auto opacity-100"
						: "pointer-events-none opacity-0",
				].join(" ")}
				onClick={() => setIsMobileMenuOpen(false)}
				aria-hidden="true"
			/>

			<aside
				className={[
					"fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-border bg-background transition-transform duration-200 md:hidden",
					isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
				].join(" ")}
				aria-hidden={!isMobileMenuOpen}
			>
				<div className="flex items-center justify-between border-b border-border px-5 py-4">
					<NavLink to="/" className="text-2xl font-semibold">
						Jottly
					</NavLink>
					<button
						type="button"
						className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
						onClick={() => setIsMobileMenuOpen(false)}
						aria-label="Close navigation menu"
					>
						<FiX className="h-5 w-5" />
					</button>
				</div>

				<nav className="flex flex-1 flex-col gap-2 px-4 py-5">
					<NavLink to="/journal" className={navigationClassName}>
						Journal
					</NavLink>
					<NavLink to="/review" className={navigationClassName}>
						Review
					</NavLink>
					<NavLink to="/settings" className={navigationClassName}>
						Settings
					</NavLink>
					{accountControls}
				</nav>
			</aside>
		</>
	);
}
