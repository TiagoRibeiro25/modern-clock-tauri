import React, { useState } from "react";
import { VscEdit, VscTrash } from "react-icons/vsc";
import type { TimerData } from "../hooks/useTimer";

interface SidebarProps {
	timers: TimerData[];
	activeTimerId: string | null;
	isSidebarOpen: boolean;
	onSelectTimer: (id: string) => void;
	onAddTimer: (name: string) => void;
	onRenameTimer: (id: string, newName: string) => void;
	onDeleteTimer: (id: string) => void;
}

export default function Sidebar({
	timers,
	activeTimerId,
	isSidebarOpen,
	onSelectTimer,
	onAddTimer,
	onRenameTimer,
	onDeleteTimer,
}: SidebarProps) {
	const [newTimerName, setNewTimerName] = useState("");
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingName, setEditingName] = useState("");

	const handleAddTimer = (e: React.FormEvent) => {
		e.preventDefault();
		if (newTimerName.trim()) {
			onAddTimer(newTimerName.trim());
			setNewTimerName("");
		}
	};

	const handleRenameSave = (id: string) => {
		if (editingName.trim()) {
			onRenameTimer(id, editingName.trim());
		}
		setEditingId(null);
	};

	return (
		<div
			className={`bg-stone-800 p-4 flex flex-col border-r border-stone-700 transition-all duration-300 ${
				isSidebarOpen
					? "w-64 translate-x-0"
					: "w-0 p-0 opacity-0 -translate-x-full border-none"
			}`}
		>
			<h2 className="text-xl font-bold mb-4 whitespace-nowrap">Clocks</h2>
			<div className="flex-1 overflow-y-auto space-y-2 pr-1">
				{timers.map((timer) => (
					<div
						key={timer.id}
						className={`w-full flex items-center justify-between px-3 py-2 rounded transition-colors group cursor-pointer ${
							timer.id === activeTimerId
								? "bg-accent text-white"
								: "bg-stone-700 hover:bg-stone-600"
						}`}
						onClick={() => onSelectTimer(timer.id)}
					>
						{editingId === timer.id ? (
							<input
								autoFocus
								value={editingName}
								onClick={(e) => e.stopPropagation()}
								onChange={(e) => setEditingName(e.target.value)}
								onBlur={() => handleRenameSave(timer.id)}
								onKeyDown={(e) => {
									if (e.key === "Enter") handleRenameSave(timer.id);
									if (e.key === "Escape") setEditingId(null);
								}}
								className="bg-stone-800 text-white px-2 py-1 rounded outline-none w-full text-sm focus:ring-2 focus:ring-accent/50"
							/>
						) : (
							<>
								<div className="flex-1 truncate mr-2 flex items-center gap-2">
									<span className="truncate">{timer.name}</span>
									{timer.running && (
										<span className="w-2 h-2 bg-green-500 rounded-full shrink-0"></span>
									)}
								</div>
								<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
									<button
										onClick={(e) => {
											e.stopPropagation();
											setEditingId(timer.id);
											setEditingName(timer.name);
										}}
										className="p-1 hover:bg-black/20 rounded text-stone-300 hover:text-white"
										title="Rename"
									>
										<VscEdit className="w-4 h-4" />
									</button>
									<button
										onClick={(e) => {
											e.stopPropagation();
											onDeleteTimer(timer.id);
										}}
										className="p-1 hover:bg-red-500/80 rounded text-stone-300 hover:text-white"
										title="Delete"
									>
										<VscTrash className="w-4 h-4" />
									</button>
								</div>
							</>
						)}
					</div>
				))}
			</div>

			<form onSubmit={handleAddTimer} className="mt-4 flex flex-col gap-2">
				<input
					type="text"
					placeholder="New clock name..."
					value={newTimerName}
					onChange={(e) => setNewTimerName(e.target.value)}
					className="bg-stone-700 text-white px-3 py-2 rounded outline-none focus:ring-2 focus:ring-accent/50"
				/>
				<button
					type="submit"
					disabled={!newTimerName.trim()}
					className="bg-accent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded transition-colors"
				>
					Add Clock
				</button>
			</form>
		</div>
	);
}
