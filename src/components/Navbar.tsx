import { getCurrentWindow } from "@tauri-apps/api/window";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { VscChromeMaximize, VscChromeMinimize, VscPin } from "react-icons/vsc";

export default function Navbar() {
	const appWindow = getCurrentWindow();
	const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);

	const handleMaximize = async () => {
		const isMaximized = await appWindow.isMaximized();
		console.log("isMaximized:", isMaximized);

		if (isMaximized) {
			appWindow.unmaximize();
		} else {
			appWindow.maximize();
		}
	};

	const toggleAlwaysOnTop = async () => {
		const newValue = !isAlwaysOnTop;
		await appWindow.setAlwaysOnTop(newValue);
		setIsAlwaysOnTop(newValue);
	};

	return (
		<nav className="fixed top-0 left-0 z-10 w-full bg-transparent">
			<div
				className="flex items-center justify-end p-2 space-x-2"
				data-tauri-drag-region
			>
				{/* Pin Button */}
				<button
					className={`flex items-center justify-center w-6 h-6 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
						isAlwaysOnTop ? "bg-gray-300 dark:bg-gray-600" : ""
					}`}
					onClick={toggleAlwaysOnTop}
					title="Always on Top"
				>
					<VscPin className={`w-4 h-4 ${isAlwaysOnTop ? "text-blue-500" : "text-gray-600 dark:text-gray-300"}`} />
				</button>

				{/* Minimize Button */}
				<button
					className="flex items-center justify-center w-6 h-6 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
					onClick={() => appWindow.minimize()}
				>
					<VscChromeMinimize className="w-4 h-4 text-gray-600 dark:text-gray-300" />
				</button>

				{/* Maximize Button */}
				<button
					className="flex items-center justify-center w-6 h-6 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
					onClick={handleMaximize}
				>
					<VscChromeMaximize className="w-4 h-4 text-gray-600 dark:text-gray-300" />
				</button>

				{/* Close Button */}
				<button
					className="flex items-center justify-center w-6 h-6 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
					onClick={() => appWindow.close()}
				>
					<IoMdClose className="w-4 h-4 text-gray-600 dark:text-gray-300" />
				</button>
			</div>
		</nav>
	);
}
