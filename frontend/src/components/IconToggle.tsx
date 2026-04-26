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
		<div className="inline-flex w-full rounded-md bg-muted p-1 sm:w-auto">
			<button
				type="button"
				className={[
					"flex-1 rounded-md px-3 py-2 text-sm transition-colors sm:flex-none",
					state
						? "bg-primary text-primary-foreground"
						: "text-muted-foreground hover:text-foreground",
				].join(" ")}
				onClick={() => setState("text")}
			>
				<LeftIcon className="text-xl" />
			</button>
			<button
				type="button"
				className={[
					"flex-1 rounded-md px-3 py-2 text-sm transition-colors sm:flex-none",
					!state
						? "bg-primary text-primary-foreground"
						: "text-muted-foreground hover:text-foreground",
				].join(" ")}
				onClick={() => setState("sentence")}
			>
				<RightIcon className="text-2xl" />
			</button>
		</div>
	);
};

export default IconToggle;
