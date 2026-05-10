import { Link } from "react-router-dom";

interface IProps {
	id: number;
	link: string;
	heading: string;
	subHeading: string;
	rightInfo: string;
}
const ListItem = ({ id, link, heading, subHeading, rightInfo }: IProps) => {
	return (
		<Link key={id} to={link} className="">
			<div className="shadow-border bg-foreground text-main-text p-5 transition-colors hover:text-primary rounded-[20px]">
				<div className="mb-1 flex items-center justify-between gap-4 ">
					<p className="font-black">{heading}</p>
					<p className="text-xs text-muted-foreground/80">{rightInfo}</p>
				</div>
				<p className="truncate text-sm text-muted-foreground font-semibold">
					{subHeading}
				</p>
			</div>
		</Link>
	);
};

export default ListItem;
