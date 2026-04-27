import {
	LuBookOpen,
	LuChevronDown,
	LuLanguages,
	LuPencilLine,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export function PublicLandingPage() {
	const navigate = useNavigate();

	const scrollToSteps = () => {
		document
			.getElementById("how-it-works")
			?.scrollIntoView({ behavior: "smooth" });
	};
	return (
		<div className="w-full">
			<section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
				<div className="absolute inset-0 opacity-5">
					<svg className="w-full h-full" viewBox="0 0 800 800" fill="none">
						<path
							d="M100,400 Q200,200 400,400 T700,400"
							stroke="#8b7355"
							strokeWidth="2"
							strokeLinecap="round"
							className="animate-[dash_3s_ease-in-out_infinite]"
							style={{
								strokeDasharray: "1000",
								strokeDashoffset: "1000",
							}}
						/>
					</svg>
				</div>

				<div className="relative z-10 max-w-4xl mx-auto text-center">
					{/* Minimalist pen icon */}
					<div className="mb-8 flex justify-center">
						<div className="relative">
							<LuPencilLine
								className="w-16 h-16 text-[#8b7355]"
								strokeWidth={1.5}
							/>
							<div className="absolute -bottom-1 left-1/2 w-24 h-[2px] bg-gradient-to-r from-transparent via-[#8b7355] to-transparent" />
						</div>
					</div>

					<h1
						className="text-5xl md:text-7xl mb-6 text-[#5a4a3a]"
						style={{ fontFamily: "Georgia, serif" }}
					>
						Write. Translate. Learn.
					</h1>

					<p className="text-xl md:text-2xl text-[#8b7355] mb-4 leading-relaxed max-w-2xl mx-auto">
						A journaling app that helps you learn languages through your own
						words
					</p>

					<button
						onClick={() => navigate("/journal")}
						className="px-12 py-4 bg-[#8b7355] text-white rounded-lg hover:bg-[#6d5a43] transition-all text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
					>
						Start Writing
					</button>
				</div>

				<button
					onClick={scrollToSteps}
					className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#8b7355]/60 hover:text-[#8b7355] transition-colors cursor-pointer group"
				>
					<span className="text-sm">See how it works</span>
					<LuChevronDown className="w-6 h-6 animate-bounce group-hover:animate-none" />
				</button>
			</section>

			<section
				id="how-it-works"
				className="min-h-screen py-24 px-6 bg-gradient-to-b from-transparent to-[#fdfcfb]"
			>
				<div className="max-w-6xl mx-auto">
					<h2
						className="text-4xl md:text-5xl text-center mb-20 text-[#5a4a3a]"
						style={{ fontFamily: "Georgia, serif" }}
					>
						How It Works
					</h2>

					<div className="grid md:grid-cols-3 gap-12 md:gap-8">
						<div className="relative">
							<div className="flex flex-col items-center text-center">
								<div className="w-20 h-20 rounded-full bg-[#8b7355]/10 flex items-center justify-center mb-6">
									<LuPencilLine
										className="w-10 h-10 text-[#8b7355]"
										strokeWidth={1.5}
									/>
								</div>
								<div className="absolute top-8 left-1/2 w-full h-[2px] bg-gradient-to-r from-[#8b7355]/20 to-transparent hidden md:block" />

								<div
									className="text-6xl text-[#8b7355]/20 mb-4"
									style={{ fontFamily: "Georgia, serif" }}
								>
									1
								</div>
								<h3
									className="text-2xl mb-4 text-[#5a4a3a]"
									style={{ fontFamily: "Georgia, serif" }}
								>
									Write Your Entry
								</h3>
								<p className="text-[#8b7355]/80 leading-relaxed">
									Express yourself naturally in your native language. Journal
									your thoughts, experiences, or stories.
								</p>
							</div>
						</div>

						<div className="relative">
							<div className="flex flex-col items-center text-center">
								<div className="w-20 h-20 rounded-full bg-[#8b7355]/10 flex items-center justify-center mb-6">
									<LuLanguages
										className="w-10 h-10 text-[#8b7355]"
										strokeWidth={1.5}
									/>
								</div>
								<div className="absolute top-8 left-1/2 w-full h-[2px] bg-gradient-to-r from-[#8b7355]/20 to-transparent hidden md:block" />

								<div
									className="text-6xl text-[#8b7355]/20 mb-4"
									style={{ fontFamily: "Georgia, serif" }}
								>
									2
								</div>
								<h3
									className="text-2xl mb-4 text-[#5a4a3a]"
									style={{ fontFamily: "Georgia, serif" }}
								>
									Review Translation
								</h3>
								<p className="text-[#8b7355]/80 leading-relaxed">
									See your words translated accurately. Swipe through
									sentence-by-sentence with audio support.
								</p>
							</div>
						</div>

						<div className="relative">
							<div className="flex flex-col items-center text-center">
								<div className="w-20 h-20 rounded-full bg-[#8b7355]/10 flex items-center justify-center mb-6">
									<LuBookOpen
										className="w-10 h-10 text-[#8b7355]"
										strokeWidth={1.5}
									/>
								</div>

								<div
									className="text-6xl text-[#8b7355]/20 mb-4"
									style={{ fontFamily: "Georgia, serif" }}
								>
									3
								</div>
								<h3
									className="text-2xl mb-4 text-[#5a4a3a]"
									style={{ fontFamily: "Georgia, serif" }}
								>
									Learn & Export
								</h3>
								<p className="text-[#8b7355]/80 leading-relaxed">
									Use our interactive reader or export to LingQ. Learn from
									content that's personally meaningful.
								</p>
							</div>
						</div>
					</div>

					<div className="text-center mt-20">
						<button
							onClick={() => "/create"}
							className="px-12 py-4 bg-[#8b7355] text-white rounded-lg hover:bg-[#6d5a43] transition-all text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
						>
							Get Started
						</button>
					</div>
				</div>
			</section>
		</div>
	);
}
