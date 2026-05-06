import { useState } from "react";
import Clock from "./components/Clock";
import Navbar from "./components/Navbar";
import ResetButton from "./components/ResetButton";
import Sidebar from "./components/Sidebar";
import Settings from "./components/Settings";
import StartStopButton from "./components/StartStopButton";
import { useTimers } from "./hooks/useTimer";
import { useSettings } from "./hooks/useSettings";

export default function App() {
	const {
		timers,
		activeTimerId,
		activeTimeStr,
		activeTimer,
		addTimer,
		renameTimer,
		deleteTimer,
		selectTimer,
		toggleActiveClock,
		resetActiveClock,
	} = useTimers();

	const { backgroundColor } = useSettings();

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<>
			<Navbar
				onToggleSidebar={toggleSidebar}
				isSidebarOpen={isSidebarOpen}
			/>
			<div 
				className="flex h-screen text-white pt-10 overflow-hidden transition-colors duration-300"
				style={{ backgroundColor }}
			>
				<Sidebar
					timers={timers}
					activeTimerId={activeTimerId}
					isSidebarOpen={isSidebarOpen}
					onSelectTimer={selectTimer}
					onAddTimer={addTimer}
					onRenameTimer={renameTimer}
					onDeleteTimer={deleteTimer}
					onOpenSettings={() => setIsSettingsOpen(true)}
				/>
				<div className="flex-1 flex flex-col items-center justify-center relative transition-all duration-300">
					{isSettingsOpen ? (
						<Settings onClose={() => setIsSettingsOpen(false)} />
					) : activeTimer ? (
						<>
							<h1 className="absolute top-10 text-3xl font-light text-stone-400 text-center px-4 w-full truncate">
								{activeTimer.name}
							</h1>
							<Clock time={activeTimeStr} />
							<div className="flex gap-4 mt-8">
								<StartStopButton
									running={activeTimer.running}
									onClick={toggleActiveClock}
								/>
								<ResetButton onClick={resetActiveClock} />
							</div>
						</>
					) : (
						<p className="text-stone-500">
							Select or create a clock to begin.
						</p>
					)}
				</div>
			</div>
		</>
	);
}
