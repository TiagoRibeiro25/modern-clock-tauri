import Clock from "./components/Clock";
import Navbar from "./components/Navbar";
import ResetButton from "./components/ResetButton";
import StartStopButton from "./components/StartStopButton";
import { useTimer } from "./hooks/useTimer";

export default function App() {
	const { time, running, toggleClock, resetClock } = useTimer();

	return (
		<>
			<Navbar />
			<div className="flex flex-col items-center justify-center min-h-screen text-white bg-stone-900">
				<Clock time={time} />
				<div className="flex gap-4 mt-8">
					<StartStopButton running={running} onClick={toggleClock} />
					<ResetButton onClick={resetClock} />
				</div>
			</div>
		</>
	);
}
