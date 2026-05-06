import { TrayIcon } from "@tauri-apps/api/tray";
import { load, type Store } from "@tauri-apps/plugin-store";
import { useEffect, useRef, useState } from "react";
import { config, initIcons, PLAY_ICON, STOP_ICON } from "../config/tray";
import { formatTime } from "../utils/time";

type TimerState = {
	elapsed: number; // accumulated seconds (not counting current run)
	running: boolean;
	lastStartAt: number | null; // epoch ms when the current run started
};

let store: Store | null = null;

export function useTimer() {
	const [time, setTime] = useState<string>("00:00:00");
	const [running, setRunning] = useState<boolean>(false);

	// Refs for precise control without re-renders
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const trayRef = useRef<TrayIcon | null>(null);
	const baseElapsedRef = useRef<number>(0);
	const lastStartAtRef = useRef<number | null>(null);
	const initializedRef = useRef<boolean>(false);

	const computeElapsedNow = () => {
		if (lastStartAtRef.current == null) return baseElapsedRef.current;
		const diffSec = Math.floor(
			(Date.now() - lastStartAtRef.current) / 1000
		);
		return baseElapsedRef.current + Math.max(0, diffSec);
	};

	const updateTrayIcon = async (iconPath: string) => {
		await trayRef.current?.setIcon(iconPath);
	};

	const persistState = async (patch?: Partial<TimerState>) => {
		if (!store) return;
		const state: TimerState = {
			elapsed: baseElapsedRef.current,
			running,
			lastStartAt: lastStartAtRef.current,
			...patch,
		};
		await store.set("elapsed", state.elapsed);
		await store.set("running", state.running);
		await store.set("lastStartAt", state.lastStartAt);
	};

	const startTicking = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		intervalRef.current = setInterval(() => {
			const nowElapsed = computeElapsedNow();
			setTime(formatTime(nowElapsed));
		}, 1000);
	};

	const stopTicking = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	};

	const toggleClock = async () => {
		if (!running) {
			lastStartAtRef.current = Date.now();
			setRunning(true);
			await persistState({
				running: true,
				lastStartAt: lastStartAtRef.current,
			});

			startTicking();
			setTime(formatTime(computeElapsedNow()));
			await updateTrayIcon(STOP_ICON);
		} else {
			const finalElapsed = computeElapsedNow();
			baseElapsedRef.current = finalElapsed;
			lastStartAtRef.current = null;
			setRunning(false);
			stopTicking();

			await persistState({
				elapsed: baseElapsedRef.current,
				running: false,
				lastStartAt: null,
			});

			setTime(formatTime(baseElapsedRef.current));
			await updateTrayIcon(PLAY_ICON);
		}
	};

	const resetClock = async () => {
		stopTicking();
		baseElapsedRef.current = 0;
		lastStartAtRef.current = null;
		setRunning(false);
		setTime("00:00:00");
		await updateTrayIcon(PLAY_ICON);
		await persistState({ elapsed: 0, running: false, lastStartAt: null });
	};

	useEffect(() => {
		if (initializedRef.current) {
			return;
		}

		initializedRef.current = true;

		async function init() {
			store = await load("timer-state.json", {
				autoSave: true,
				defaults: {
					elapsed: 0,
					running: false,
					lastStartAt: null,
				} as TimerState,
			});

			await initIcons();
			trayRef.current = await TrayIcon.new(config);
			console.log("Tray initialized");

			const savedElapsed = (await store.get<number>("elapsed")) ?? 0;
			const savedRunning = (await store.get<boolean>("running")) ?? false;
			const savedLastStartAt =
				(await store.get<number | null>("lastStartAt")) ?? null;

			baseElapsedRef.current = savedElapsed;
			lastStartAtRef.current = savedRunning ? savedLastStartAt : null;

			const restored = savedRunning
				? baseElapsedRef.current +
				  Math.max(
						0,
						Math.floor(
							(Date.now() - (savedLastStartAt ?? Date.now())) /
								1000
						)
				  )
				: baseElapsedRef.current;

			setRunning(savedRunning);
			setTime(formatTime(restored));

			console.log(
				`State restored: elapsed=${baseElapsedRef.current}, running=${savedRunning}, lastStartAt=${lastStartAtRef.current}`
			);

			if (savedRunning) {
				startTicking();
				await updateTrayIcon(STOP_ICON);
			} else {
				await updateTrayIcon(PLAY_ICON);
			}
		}

		init()
			.then(() => console.log("App initialized"))
			.catch((error) => {
				console.error("Failed to initialize app:", error);
			});

		return () => {
			stopTicking();
			persistState();
		};
	}, []);

	return { time, running, toggleClock, resetClock };
}
