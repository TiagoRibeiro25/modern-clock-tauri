import { useEffect, useRef, useState } from "react";
import Clock from "./components/Clock";
import ResetButton from "./components/ResetButton";
import StartStopButton from "./components/StartStopButton";

export default function App() {
	const [time, setTime] = useState<string>("00:00:00");
	const [running, setRunning] = useState(false);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const elapsedRef = useRef(0);

	const formatTime = (seconds: number) => {
		const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
		const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
		const secs = String(seconds % 60).padStart(2, "0");
		return `${hrs}:${mins}:${secs}`;
	};

	const toggleClock = () => {
		if (!running) {
			intervalRef.current = setInterval(() => {
				elapsedRef.current += 1;
				setTime(formatTime(elapsedRef.current));
			}, 1000);
		} else {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		}
		setRunning(!running);
	};

	const resetClock = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		elapsedRef.current = 0;
		setTime("00:00:00");
		setRunning(false);
	};

	useEffect(() => {
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, []);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen animated-gradient">
			<Clock time={time} />
			<div className="flex gap-4 mt-8">
				<StartStopButton running={running} onClick={toggleClock} />
				<ResetButton onClick={resetClock} />
			</div>
		</div>
	);
}
