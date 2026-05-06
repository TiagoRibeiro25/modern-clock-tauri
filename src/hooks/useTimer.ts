import { TrayIcon } from "@tauri-apps/api/tray";
import { load, type Store } from "@tauri-apps/plugin-store";
import { useEffect, useRef, useState } from "react";
import { config, initIcons, PLAY_ICON, STOP_ICON } from "../config/tray";
import { formatTime } from "../utils/time";

export type TimerData = {
	id: string;
	name: string;
	elapsed: number;
	running: boolean;
	lastStartAt: number | null;
};

let store: Store | null = null;

export function useTimers() {
	const [timers, setTimers] = useState<TimerData[]>([]);
	const [activeTimerId, setActiveTimerId] = useState<string | null>(null);
	const [activeTimeStr, setActiveTimeStr] = useState<string>("00:00:00");

	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const trayRef = useRef<TrayIcon | null>(null);
	const initializedRef = useRef<boolean>(false);

	// To keep React state in sync with our interval without depending on closures
	const timersRef = useRef<TimerData[]>([]);
	const activeTimerIdRef = useRef<string | null>(null);

	useEffect(() => {
		timersRef.current = timers;
	}, [timers]);

	useEffect(() => {
		activeTimerIdRef.current = activeTimerId;
		updateActiveTimeStr();
	}, [activeTimerId]);

	const updateActiveTimeStr = () => {
		const active = timersRef.current.find((t) => t.id === activeTimerIdRef.current);
		if (!active) {
			setActiveTimeStr("00:00:00");
			return;
		}
		
		let currentElapsed = active.elapsed;
		if (active.running && active.lastStartAt) {
			const diffSec = Math.floor((Date.now() - active.lastStartAt) / 1000);
			currentElapsed += Math.max(0, diffSec);
		}
		setActiveTimeStr(formatTime(currentElapsed));
	};

	const updateTrayIcon = async (iconPath: string) => {
		await trayRef.current?.setIcon(iconPath);
	};

	const persistState = async (newTimers: TimerData[], newActiveId: string | null) => {
		if (!store) return;
		await store.set("timers", newTimers);
		await store.set("activeTimerId", newActiveId);
		await store.save();
	};

	const startTicking = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}
		intervalRef.current = setInterval(() => {
			updateActiveTimeStr();
		}, 1000);
	};

	const stopTicking = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	};

	const addTimer = async (name: string) => {
		const newTimer: TimerData = {
			id: Date.now().toString(),
			name,
			elapsed: 0,
			running: false,
			lastStartAt: null,
		};
		const newTimers = [...timers, newTimer];
		setTimers(newTimers);
		
		if (!activeTimerId) {
			setActiveTimerId(newTimer.id);
			await persistState(newTimers, newTimer.id);
		} else {
			await persistState(newTimers, activeTimerId);
		}
	};

	const selectTimer = async (id: string) => {
		setActiveTimerId(id);
		await persistState(timers, id);
	};

	const toggleActiveClock = async () => {
		if (!activeTimerId) return;

		const updatedTimers = timers.map((t) => {
			if (t.id !== activeTimerId) return t;
			if (!t.running) {
				return { ...t, running: true, lastStartAt: Date.now() };
			} else {
				let finalElapsed = t.elapsed;
				if (t.lastStartAt) {
					finalElapsed += Math.floor((Date.now() - t.lastStartAt) / 1000);
				}
				return { ...t, running: false, lastStartAt: null, elapsed: finalElapsed };
			}
		});

		setTimers(updatedTimers);
		timersRef.current = updatedTimers;
		updateActiveTimeStr();
		await persistState(updatedTimers, activeTimerId);

		const activeNow = updatedTimers.find(t => t.id === activeTimerId);
		if (activeNow?.running) {
			await updateTrayIcon(STOP_ICON);
		} else {
			await updateTrayIcon(PLAY_ICON);
		}
	};

	const resetActiveClock = async () => {
		if (!activeTimerId) return;

		const updatedTimers = timers.map((t) => {
			if (t.id !== activeTimerId) return t;
			return { ...t, running: false, lastStartAt: null, elapsed: 0 };
		});

		setTimers(updatedTimers);
		timersRef.current = updatedTimers;
		updateActiveTimeStr();
		await persistState(updatedTimers, activeTimerId);
		await updateTrayIcon(PLAY_ICON);
	};

	useEffect(() => {
		if (initializedRef.current) return;
		initializedRef.current = true;

		async function init() {
			store = await load("timer-state.json", { autoSave: true });

			// Migrating old state or empty state
			let savedTimers = await store.get<TimerData[]>("timers");
			let savedActiveId = await store.get<string | null>("activeTimerId");

			if (!savedTimers || savedTimers.length === 0) {
				const oldElapsed = (await store.get<number>("elapsed")) ?? 0;
				const oldRunning = (await store.get<boolean>("running")) ?? false;
				const oldLastStartAt = (await store.get<number | null>("lastStartAt")) ?? null;

				const defaultTimer: TimerData = {
					id: Date.now().toString(),
					name: "Main Timer",
					elapsed: oldElapsed,
					running: oldRunning,
					lastStartAt: oldLastStartAt,
				};
				savedTimers = [defaultTimer];
				savedActiveId = defaultTimer.id;
			}

			setTimers(savedTimers);
			setActiveTimerId(savedActiveId);
			timersRef.current = savedTimers;
			activeTimerIdRef.current = savedActiveId;

			await initIcons();
			trayRef.current = await TrayIcon.new(config);

			// Check if any timer is running to set correct tray icon
			const anyRunning = savedTimers.some(t => t.running);
			await updateTrayIcon(anyRunning ? STOP_ICON : PLAY_ICON);

			startTicking();
		}

		init().catch(console.error);

		return () => {
			stopTicking();
		};
	}, []);

	return {
		timers,
		activeTimerId,
		activeTimeStr,
		activeTimer: timers.find(t => t.id === activeTimerId),
		addTimer,
		selectTimer,
		toggleActiveClock,
		resetActiveClock
	};
}
