import { useEffect, useRef, useState } from "react";
import { Language, languageOptions } from "../constants/languages";
import { useLanguage } from "../contexts/LanguageContext";
import { RiArrowDropDownLine } from "react-icons/ri";
import { fileRoutes } from "../constants/routes";

const LanguageSelector = () => {
	const { language, setLanguage } = useLanguage();
	const dropdown = useRef<HTMLDivElement>(null);
	const [showDropdown, setShowDropdown] = useState(false);

	const handleClickOption = (iso: Language) => {
		setLanguage(iso);
		setShowDropdown(false);
	};

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (dropdown.current && !dropdown.current.contains(e.target as Node)) {
				setShowDropdown(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [dropdown]);

	return (
		<div
			ref={dropdown}
			className="relative w-fit flex flex-col items-center gap-2 text-sm text-main-text "
		>
			<div
				onClick={() => setShowDropdown(!showDropdown)}
				className="flex items-center gap-1 rounded-md cursor-pointer text-sm text-main-text outline-none transition focus:border-primary"
			>
				<img className="h-6" src={fileRoutes.FLAGS(language)} alt="flag" />
				<RiArrowDropDownLine
					className={`text-3xl transition-all ease-in-out duration-300 ${showDropdown ? "rotate-90" : ""}`}
				/>
			</div>
			{showDropdown && (
				<div className="z-100 bg-foreground absolute left-0 top-[100%] shadow-border rounded-[0.25rem] overflow-hidden">
					{languageOptions.map((lang) => (
						<div
							onClick={() => handleClickOption(lang.code)}
							key={lang.code}
							className={`p-2 flex gap-2 items-center w-full hover:bg-foreground-dark cursor-pointer ${lang.code === language ? "bg-foreground-dark" : "bg-foreground"}`}
						>
							<div className="w-6">
								<img
									className="w-5"
									src={fileRoutes.FLAGS(lang.code)}
									alt="flag"
								/>
							</div>

							<small className="font-semibold">{lang.label}</small>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default LanguageSelector;
