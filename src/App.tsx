import { useState } from "react";
import Clock from "./components/Clock";
import Navbar from "./components/Navbar";
import ResetButton from "./components/ResetButton";
import StartStopButton from "./components/StartStopButton";
import { useTimers } from "./hooks/useTimer";

export default function App() {
	const {
		timers,
		activeTimerId,
		activeTimeStr,
		activeTimer,
		addTimer,
		selectTimer,
		toggleActiveClock,
		resetActiveClock,
	} = useTimers();

	const [newTimerName, setNewTimerName] = useState("");

	const handleAddTimer = (e: React.FormEvent) => {
		e.preventDefault();
		if (newTimerName.trim()) {
			addTimer(newTimerName.trim());
			setNewTimerName("");
		}
	};

	return (
		<>
			<Navbar />
			<div className="flex h-screen text-white bg-stone-900 pt-10">
				{/* Sidebar for Clocks Menu */}
				<div className="w-64 bg-stone-800 p-4 flex flex-col border-r border-stone-700">
					<h2 className="text-xl font-bold mb-4">Clocks</h2>
					<div className="flex-1 overflow-y-auto space-y-2">
						{timers.map((timer) => (
							<button
								key={timer.id}
								onClick={() => selectTimer(timer.id)}
								className={`w-full text-left px-3 py-2 rounded transition-colors ${
									timer.id === activeTimerId
										? "bg-blue-600 text-white"
										: "bg-stone-700 hover:bg-stone-600"
								}`}
							>
								<div className="flex justify-between items-center">
									<span className="truncate">{timer.name}</span>
									{timer.running && (
										<span className="w-2 h-2 bg-green-500 rounded-full"></span>
									)}
								</div>
							</button>
						))}
					</div>
					
					<form onSubmit={handleAddTimer} className="mt-4 flex flex-col gap-2">
						<input
							type="text"
							placeholder="New clock name..."
							value={newTimerName}
							onChange={(e) => setNewTimerName(e.target.value)}
							className="bg-stone-700 text-white px-3 py-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button
							type="submit"
							disabled={!newTimerName.trim()}
							className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded transition-colors"
						>
							Add Clock
						</button>
					</form>
				</div>

				{/* Main Content Area */}
				<div className="flex-1 flex flex-col items-center justify-center relative">
					{activeTimer ? (
						<>
							<h1 className="absolute top-10 text-3xl font-light text-stone-400">
								{activeTimer.name}
							</h1>
							<Clock time={activeTimeStr} />
							<div className="flex gap-4 mt-8">
								<StartStopButton running={activeTimer.running} onClick={toggleActiveClock} />
								<ResetButton onClick={resetActiveClock} />
							</div>
						</>
					) : (
						<p className="text-stone-500">Select or create a clock to begin.</p>
					)}
				</div>
			</div>
		</>
	);
}
