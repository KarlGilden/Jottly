const Notebook = () => {
	return (
		<svg width="160" height="160" viewBox="0 0 160 160" fill="none">
			{/* Notebook */}
			<rect x="30" y="20" width="100" height="120" rx="12" fill="#58CC02" />
			<rect x="30" y="20" width="15" height="120" fill="#4CAD02" />
			{/* Lines */}
			<line
				x1="55"
				y1="45"
				x2="110"
				y2="45"
				stroke="white"
				strokeWidth="4"
				strokeLinecap="round"
			/>
			<line
				x1="55"
				y1="65"
				x2="115"
				y2="65"
				stroke="white"
				strokeWidth="4"
				strokeLinecap="round"
			/>
			<line
				x1="55"
				y1="85"
				x2="100"
				y2="85"
				stroke="white"
				strokeWidth="4"
				strokeLinecap="round"
			/>
			<line
				x1="55"
				y1="105"
				x2="110"
				y2="105"
				stroke="white"
				strokeWidth="4"
				strokeLinecap="round"
			/>
			{/* Pen writing */}
			<g transform="rotate(-30 120 120)">
				<rect x="110" y="100" width="35" height="10" rx="5" fill="#1CB0F6" />
				<polygon points="145,105 155,100 155,110" fill="#FFD700" />
			</g>
		</svg>
	);
};

export default Notebook;
