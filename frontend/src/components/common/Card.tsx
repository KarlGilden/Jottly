import { ReactNode } from "react";

interface IProps {
	children: ReactNode;
}

const Card = ({ children }: IProps) => {
	return (
		<div className="p-5 shadow-border rounded-[20px] bg-foreground">
			{children}
		</div>
	);
};

export default Card;
