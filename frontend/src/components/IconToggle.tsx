import { Dispatch, SetStateAction } from "react";
import { IconType } from "react-icons";

interface IProps {
	state: boolean;
	setState: Dispatch<SetStateAction<any>>;
	LeftIcon: IconType;
	RightIcon: IconType;
}

const IconToggle = ({ state, setState, LeftIcon, RightIcon }: IProps) => {
	return (
		<div className="rounded-md bg-muted p-1 sm:w-auto">
			<button
				type="button"
				className={[
					"rounded-md px-3 py-2 text-sm transition-colors sm:flex-none",
					state
						? "bg-primary text-foreground"
						: "text-main-text hover:text-main-text/70",
				].join(" ")}
				onClick={() => setState("text")}
			>
				<LeftIcon className="text-xl" />
			</button>
			<button
				type="button"
				className={[
					"rounded-md px-3 py-2 text-sm transition-colors sm:flex-none",
					!state
						? "bg-primary text-foreground"
						: "text-main-text hover:text-main-text/70",
				].join(" ")}
				onClick={() => setState("sentence")}
			>
				<RightIcon className="text-2xl" />
			</button>
		</div>
	);
};

export default IconToggle;
