const Books = () => {
	return (
		<svg width="160" height="160" viewBox="0 0 160 160" fill="none">
			{/* Book */}
			<rect x="35" y="25" width="90" height="110" rx="8" fill="#58CC02" />
			<rect x="35" y="25" width="45" height="110" fill="#4CAD02" />
			<line x1="80" y1="25" x2="80" y2="135" stroke="#3A9902" strokeWidth="3" />
			{/* Pages */}
			<line
				x1="50"
				y1="50"
				x2="70"
				y2="50"
				stroke="white"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<line
				x1="50"
				y1="65"
				x2="70"
				y2="65"
				stroke="white"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<line
				x1="90"
				y1="50"
				x2="110"
				y2="50"
				stroke="white"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<line
				x1="90"
				y1="65"
				x2="110"
				y2="65"
				stroke="white"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			{/* Star badge */}
			<circle cx="130" cy="40" r="20" fill="#FFD700" />
			<path
				d="M130 28 L133 37 L142 37 L135 43 L138 52 L130 46 L122 52 L125 43 L118 37 L127 37 Z"
				fill="white"
			/>
		</svg>
	);
};

export default Books;
