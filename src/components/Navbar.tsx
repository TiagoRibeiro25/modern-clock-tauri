import { getCurrentWindow } from "@tauri-apps/api/window";
import { IoMdClose } from "react-icons/io";
import { VscChromeMaximize, VscChromeMinimize } from "react-icons/vsc";

export default function Navbar() {
	const appWindow = getCurrentWindow();

	const handleMaximize = async () => {
		const isMaximized = await appWindow.isMaximized();
		console.log("isMaximized:", isMaximized);

		if (isMaximized) {
			appWindow.unmaximize();
		} else {
			appWindow.maximize();
		}
	};

	return (
		<nav className="fixed top-0 left-0 z-10 w-full bg-transparent">
			<div
				className="flex items-center justify-end p-2 space-x-2"
				data-tauri-drag-region
			>
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
