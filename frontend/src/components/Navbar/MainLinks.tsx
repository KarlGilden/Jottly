import { routes } from "../../constants/routes";
import { NavLink } from "react-router-dom";

const MainLinks = () => {
	const currentRoute = window.location.pathname;

	const navigationClassName = (route: string) =>
		[
			"rounded-md px-3 py-2 text-sm font-semibold transition-colors",
			currentRoute === route
				? "text-primary"
				: "text-main-text hover:text-primary",
		].join(" ");

	return (
		<>
			<NavLink
				to={routes.JOURNAL}
				className={() => navigationClassName(routes.JOURNAL)}
			>
				Journal
			</NavLink>
			<NavLink
				to={routes.REVIEW}
				className={() => navigationClassName(routes.REVIEW)}
			>
				Review
			</NavLink>
			<NavLink
				to={routes.SETTINGS}
				className={() => navigationClassName(routes.SETTINGS)}
			>
				Settings
			</NavLink>
		</>
	);
};

export default MainLinks;
