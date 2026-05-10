interface IProps {
	text: string;
	type?: "h1" | "h2" | "h3";
}

const HeaderText = ({ text, type = "h1" }: IProps) => {
	switch (type) {
		case "h1":
			return <h1 className="text-3xl font-black">{text}</h1>;
		case "h2":
			return <h2 className="text-xl font-bold">{text}</h2>;
		case "h3":
			return <h3 className="text-lg font-bold">{text}</h3>;
	}
};

export default HeaderText;
