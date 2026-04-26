import { Link } from "react-router-dom";
import { EntryListItem } from "../api/queries/useEntries";

interface IProps {
	id: number;
	link: string;
	heading: string;
	subHeading: string;
	rightInfo: string;
}
const ListItem = ({ id, link, heading, subHeading, rightInfo }: IProps) => {
	return (
		<Link
			key={id}
			to={link}
			className="block border-b border-border pb-4 transition-colors hover:text-foreground"
		>
			<div className="mb-1 flex items-center justify-between gap-4">
				<p className="text-sm font-medium">{heading}</p>
				<p className="text-xs text-muted-foreground/80">{rightInfo}</p>
			</div>
			<p className="truncate text-sm text-muted-foreground">{subHeading}</p>
		</Link>
	);
};

export default ListItem;
