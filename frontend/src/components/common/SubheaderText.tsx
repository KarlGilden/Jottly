interface IProps {
	text: string;
}

const SubheaderText = ({ text }: IProps) => {
	return <p className="text-sm font-semibold text-sub-text">{text}</p>;
};

export default SubheaderText;
