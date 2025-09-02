import { getCurrentWindow } from "@tauri-apps/api/window";
import { IoMdClose } from "react-icons/io";
import { VscChromeMinimize } from "react-icons/vsc";

export default function Navbar() {
	const appWindow = getCurrentWindow();

	return (
		<nav className="w-full">
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
