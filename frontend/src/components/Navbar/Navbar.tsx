import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LanguageSelector from "../LanguageSelector";
import ProfileLink from "../ProfileLink";
import LogoLink from "./LogoLink";
import MainLinks from "./MainLinks";
import CloseMenuButton from "./CloseMenuButton";
import OpenMenuButton from "./OpenMenuButton";

export default function Navbar() {
	const location = useLocation();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		setIsMobileMenuOpen(false);
	}, [location.pathname]);

	useEffect(() => {
		document.body.classList.toggle("overflow-hidden", isMobileMenuOpen);

		return () => {
			document.body.classList.remove("overflow-hidden");
		};
	}, [isMobileMenuOpen]);

	return (
		<>
			<header className="w-full bg-foreground shadow-border z-100">
				<div className="app-navbar-shell">
					<div className="flex items-center justify-between">
						<LogoLink />
						<div className="flex items-center gap-5">
							<div className="hidden md:flex md:items-center md:justify-between">
								<MainLinks />
							</div>

							<LanguageSelector />

							<div className="hidden md:flex">
								<ProfileLink />
							</div>

							<div className="md:hidden">
								<OpenMenuButton closeFn={() => setIsMobileMenuOpen(true)} />
							</div>
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
				className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-border bg-background transition-transform duration-200 md:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
				aria-hidden={!isMobileMenuOpen}
			>
				<div className="flex items-center justify-between border-b border-border px-5 py-4">
					<LogoLink />
					<CloseMenuButton closeFn={() => setIsMobileMenuOpen(false)} />
				</div>

				<nav className="flex flex-1 flex-col gap-2 px-4 py-5">
					<MainLinks />
					<ProfileLink />
				</nav>
			</aside>
		</>
	);
}
