import {
	createContext,
	ReactElement,
	ReactNode,
	useContext,
	useState,
} from "react";

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
	createAlert: (alert: Alert) => {},
});

export const AlertProvider = ({ children }: Props) => {
	const [alerts, setAlerts] = useState<Alert[]>([]);

	const createAlert = (alert: Alert) => {
		setAlerts([...alerts, alert]);
		const timeoutId = setTimeout(() => {
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
							className={`${alert.type === "success" ? "border-green-500" : "border-red-500"} border-t-2 border-solid w-[200px] h-[50px] bg-white`}
						>
							<h1>{alert?.title}</h1>
							<p>{alert?.message}</p>
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
