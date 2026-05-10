import { LuPenLine } from "react-icons/lu";
import { NavLink } from "react-router-dom";

const LogoLink = () => {
	return (
		<NavLink
			to="/"
			className="text-2xl text-main-text font-black flex items-center gap-2"
		>
			Jottly <LuPenLine className="text-primary" />
		</NavLink>
	);
};

export default LogoLink;
