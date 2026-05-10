const TranslateBubble = () => {
	return (
		<svg width="160" height="160" viewBox="0 0 160 160" fill="none">
			{/* Left speech bubble */}
			<g>
				<rect x="10" y="30" width="70" height="50" rx="16" fill="#58CC02" />
				<polygon points="25,80 30,95 40,80" fill="#58CC02" />
				<text
					x="45"
					y="60"
					fill="white"
					fontSize="18"
					fontWeight="bold"
					textAnchor="middle"
				>
					Hello
				</text>
			</g>
			{/* Right speech bubble */}
			<g>
				<rect x="80" y="60" width="70" height="50" rx="16" fill="#1CB0F6" />
				<polygon points="130,55 125,50 115,60" fill="#1CB0F6" />
				<text
					x="115"
					y="90"
					fill="white"
					fontSize="18"
					fontWeight="bold"
					textAnchor="middle"
				>
					Hola
				</text>
			</g>
			{/* Translation arrows */}
			<path
				d="M50 55 Q80 40 100 65"
				stroke="#FFD700"
				strokeWidth="4"
				fill="none"
				strokeLinecap="round"
			/>
			<polygon points="98,68 105,65 100,58" fill="#FFD700" />
		</svg>
	);
};

export default TranslateBubble;
