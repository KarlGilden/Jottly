import { FiMenu } from "react-icons/fi";

interface IProps {
	closeFn: () => void;
}

const OpenMenuButton = ({ closeFn }: IProps) => {
	return (
		<button
			type="button"
			className="rounded-md p-2 text-main-text transition-colors hover:bg-muted hover:text-foreground"
			onClick={closeFn}
			aria-label="Open navigation menu"
		>
			<FiMenu className="h-6 w-6" />
		</button>
	);
};

export default OpenMenuButton;
