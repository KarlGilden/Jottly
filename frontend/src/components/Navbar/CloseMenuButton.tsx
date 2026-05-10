import { FiX } from "react-icons/fi";

interface IProps {
	closeFn: () => void;
}

const CloseMenuButton = ({ closeFn }: IProps) => {
	return (
		<button
			type="button"
			className="rounded-md p-2 text-main-text transition-colors hover:bg-muted hover:text-foreground"
			onClick={closeFn}
			aria-label="Close navigation menu"
		>
			<FiX className="h-5 w-5" />
		</button>
	);
};

export default CloseMenuButton;
