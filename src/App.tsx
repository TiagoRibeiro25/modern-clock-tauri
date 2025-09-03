import { TrayIcon } from "@tauri-apps/api/tray";
import { useEffect, useRef, useState } from "react";
import Clock from "./components/Clock";
import Navbar from "./components/Navbar";
import ResetButton from "./components/ResetButton";
import StartStopButton from "./components/StartStopButton";
import { config, PLAY_ICON, STOP_ICON } from "./config/tray";
import { formatTime } from "./utils/time";


export default function App() {
	const [time, setTime] = useState<string>("00:00:00");
	const [running, setRunning] = useState<boolean>(false);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const elapsedRef = useRef<number>(0);
	const trayRef = useRef<TrayIcon | null>(null);

	const updateTrayIcon = async (iconPath: string) => {
		if (trayRef.current) {
			await trayRef.current.setIcon(iconPath);
		}
	};

	const toggleClock = async () => {
		if (!running) {
			intervalRef.current = setInterval(() => {
				elapsedRef.current += 1;
				setTime(formatTime(elapsedRef.current));
			}, 1000);

			await updateTrayIcon(STOP_ICON);
		} else {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;

				await updateTrayIcon(PLAY_ICON);
			}
		}
		setRunning(!running);
	};

	const resetClock = async () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		elapsedRef.current = 0;
		setTime("00:00:00");
		setRunning(false);

		await updateTrayIcon(PLAY_ICON);
	};

	useEffect(() => {
		async function initTray() {
			if (trayRef.current) {
				console.warn("Tray icon already initialized");
				return;
			}

			trayRef.current = await TrayIcon.new(config);
		}

		initTray();

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);

	return (
		<div className="min-h-screen bg-gray-950">
			<Navbar />

			<div className="flex flex-col items-center justify-center mt-22">
				<Clock time={time} />
				<div className="flex gap-4 mt-8">
					<StartStopButton running={running} onClick={toggleClock} />
					<ResetButton onClick={resetClock} />
				</div>
			</div>
		</div>
	);
}
