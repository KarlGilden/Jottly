import { ReactNode } from "react";

interface IProps {
	children: ReactNode;
}

const Page = ({ children }: IProps) => {
	return (
		<div className="w-full flex justify-center bg-background app-content-shell">
			<div className="w-full max-w-[900px] gap-8 py-8">{children}</div>
		</div>
	);
};

export default Page;
