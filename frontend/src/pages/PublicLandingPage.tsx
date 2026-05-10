import HeaderText from "../components/common/HeaderText";
import Button from "../components/common/Button";
import { LuChevronDown } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import SubheaderText from "../components/common/SubheaderText";
import Notebook from "../components/svgs/Notebook";
import TranslateBubble from "../components/svgs/TranslateBubble";
import Books from "../components/svgs/Books";
import Arrow from "../components/svgs/Arrow";
import { languageOptions } from "../constants/languages";
import { fileRoutes, routes } from "../constants/routes";
import { useLanguage } from "../contexts/LanguageContext";

export function PublicLandingPage() {
	const navigate = useNavigate();
	const { setLanguage } = useLanguage();

	const scrollToSteps = () => {
		document
			.getElementById("how-it-works")
			?.scrollIntoView({ behavior: "smooth" });
	};
	return (
		<div className="w-full bg-foreground">
			<section className="relative min-h-screen flex flex-col gap-5 items-center justify-center py-16 px-6 overflow-hidden">
				<div className="flex flex-col gap-5 text-center items-center">
					<h1 className="text-4xl md:text-7xl text-main-text font-black">
						Learn a language through your own words
					</h1>

					<p className="text-lg md:text-2xl font-bold text-sub-text leading-relaxed max-w-2xl">
						A journaling app that helps you express your thoughts in your target
						language
					</p>
				</div>

				<Button
					onClick={() => navigate(routes.JOURNAL)}
					content={"Start Writing"}
					size="lg"
					color="primary"
				/>

				<button
					onClick={scrollToSteps}
					className="flex flex-col items-center gap-2 text-main-text/60 hover:text-main-text font-bold transition-colors cursor-pointer group"
				>
					<span className="">See how it works</span>
					<LuChevronDown className="w-6 h-6 animate-bounce" />
				</button>
			</section>

			<div className="flex justify-evenly border-y-2 border-border border-solid p-5">
				{languageOptions.map((x) => {
					return (
						<img
							className="w-6 cursor-pointer sm:w-10 hover:scale-110 transition-all ease-in-out duration-200"
							src={fileRoutes.FLAGS(x.code)}
							alt=""
							onClick={() => {
								setLanguage(x.code);
								navigate(routes.JOURNAL);
							}}
						/>
					);
				})}
			</div>

			{/* How It Works Section */}
			<section id="how-it-works" className="min-h-screen py-16 px-6 bg-white">
				<div className="flex flex-col items-center gap-10 sm:gap-24 max-w-[900px] mx-auto">
					<h2 className="text-5xl md:text-6xl text-center text-main-text font-black">
						How It Works
					</h2>

					<div className="relative grid md:grid-cols-3 gap-16 md:gap-12">
						{/* Step 1 */}
						<div className="relative">
							<div className="flex flex-col items-center text-center gap-1 sm:gap-5">
								<div className="w-40 h-40 transform hover:scale-105 transition-transform">
									<Notebook />
								</div>

								<HeaderText text="Jot Your Thoughts" />
								<SubheaderText
									text="Write naturally in your native language. No pressure, just jot
									down whatever's on your mind!"
								/>
							</div>
						</div>

						<div className="absolute left-1/3 top-20 transform -translate-x-1/2 hidden md:block">
							<Arrow />
						</div>

						{/* Step 2 */}
						<div className="relative">
							<div className="flex flex-col items-center text-center gap-1 sm:gap-5">
								<div className="w-40 h-40 transform hover:scale-105 transition-transform">
									<TranslateBubble />
								</div>
								<HeaderText text="See It Translated" />
								<SubheaderText
									text="Watch your jottings transform into your target language,
									sentence by sentence with audio!"
								/>
							</div>
						</div>

						{/* Arrow 2 to 3 */}
						<div className="absolute left-2/3 top-20 transform -translate-x-1/2 hidden md:block">
							<Arrow />
						</div>

						{/* Step 3 */}
						<div className="relative">
							<div className="flex flex-col items-center text-center gap-1 sm:gap-5">
								<div className="w-40 h-40 transform hover:scale-105 transition-transform">
									<Books />
								</div>

								<HeaderText text="Learn & Grow" />
								<SubheaderText
									text="Practice with our reader or export to LingQ. Learn from words
									that actually matter to you!"
								/>
							</div>
						</div>
					</div>

					<Button
						onClick={() => navigate(routes.JOURNAL)}
						content={"Start Your Journey"}
						color="primary"
						size="lg"
					/>
				</div>
			</section>
		</div>
	);
}
