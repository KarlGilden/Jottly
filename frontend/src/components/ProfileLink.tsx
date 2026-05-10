import { useAuth, useClerk, useUser } from "@clerk/react";
import { NavLink } from "react-router-dom";

const ProfileLink = () => {
	const { isSignedIn } = useAuth();
	const { openSignIn } = useClerk();
	const { user } = useUser();

	return isSignedIn ? (
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
};

export default ProfileLink;
