interface IProps {
	type?: "submit" | "button";
	disabled?: boolean;
	content: string;
	onClick?: () => void;
	color?: "primary" | "secondary" | "none";
	isFloating?: boolean;
	size?: "sm" | "md" | "lg";
}

const Button = ({
	disabled = false,
	content,
	type = "submit",
	color = "secondary",
	onClick = () => {},
	isFloating = false,
	size = "md",
}: IProps) => {
	let sizeClass = "";
	switch (size) {
		case "sm":
			sizeClass = "px-4 py-2";
			break;
		case "md":
			sizeClass = "px-6 py-4 font-bold text-xl";
			break;
		case "lg":
			sizeClass = "px-8 py-6 font-black text-2xl";
			break;
	}

	let colorClass = "";

	switch (color) {
		case "primary":
			colorClass = "bg-primary hover:bg-primary/90 text-white ";
			break;
		case "secondary":
			colorClass = "bg-black hover:bg-black/90 text-white ";
			break;
		case "none":
			colorClass = "bg-transparent text-main-text";
			break;
	}
	return (
		<button
			type={type}
			disabled={disabled}
			className={`${isFloating && "fixed bottom-10 right-10"} rounded-full ${colorClass} ${sizeClass} font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50`}
			onClick={onClick}
		>
			{content}
		</button>
	);
};

export default Button;
