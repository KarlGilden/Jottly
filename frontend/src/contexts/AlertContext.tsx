import { createContext, useContext, useState } from "react";
import { IoClose } from "react-icons/io5";
interface Alert {
	type: "success" | "error";
	title: string;
	message: string;
}

interface AlertContextType {
	createAlert: (alert: Alert) => void;
}

interface Props {
	children: React.ReactNode;
}

const AlertContext = createContext<AlertContextType>({
	createAlert: (_alert: Alert) => {},
});

export const AlertProvider = ({ children }: Props) => {
	const [alerts, setAlerts] = useState<Alert[]>([]);

	const createAlert = (alert: Alert) => {
		setAlerts([...alerts, alert]);
		setTimeout(() => {
			setAlerts((prev) => prev.filter((x) => x !== alert));
		}, 3000);
	};

	const value = {
		createAlert,
	};

	return (
		<AlertContext.Provider value={value}>
			{children}
			<div
				className={`${alerts.length > 0 ? "" : "hidden"} absolute right-10 top-10 `}
			>
				{alerts.map((alert) => {
					return (
						<div
							className={`${alert.type === "success" ? "border-green-500" : "border-red-500"} flex border-t-5 border-solid w-[400px] bg-white  rounded-md`}
						>
							<div className="w-full py-2 px-4">
								<h1 className="font-semibold">{alert?.title}</h1>
								<p>{alert?.message}</p>
							</div>
							<div className="py-2 px-4 border-l flex justify-center items-center">
								<IoClose
									className="text-2xl cursor-pointer"
									onClick={() =>
										setAlerts((prev) => prev.filter((x) => x !== alert))
									}
								/>
							</div>
						</div>
					);
				})}
			</div>
		</AlertContext.Provider>
	);
};

export const useAlert = () => {
	return useContext(AlertContext);
};
