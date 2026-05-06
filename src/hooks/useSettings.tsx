import React, { createContext, useContext, useEffect, useState } from "react";
import { load } from "@tauri-apps/plugin-store";

export interface Settings {
	buttonColor: string;
	backgroundColor: string;
}

export const DEFAULT_SETTINGS: Settings = {
	buttonColor: "#2563eb", // blue-600
	backgroundColor: "#1c1917", // stone-900
};

interface SettingsContextType extends Settings {
	updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
	resetSettings: () => Promise<void>;
}

async function saveSettings(settings: Settings) {
	const store = await load("settings.json", { autoSave: true, defaults: {} });
	await store.set("settings", settings);
	await store.save();
}

async function loadSettings(): Promise<Settings> {
	const store = await load("settings.json", { autoSave: true, defaults: {} });
	const saved = await store.get<Settings>("settings");
	return { ...DEFAULT_SETTINGS, ...saved };
}

const SettingsContext = createContext<SettingsContextType | undefined>(
	undefined,
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
	const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

	useEffect(() => {
		async function init() {
			const loadedSettings = await loadSettings();
			setSettings(loadedSettings);
		}
		init().catch(console.error);
	}, []);

	const updateSettings = async (newSettings: Partial<Settings>) => {
		const updated = { ...settings, ...newSettings };
		setSettings(updated);
		await saveSettings(updated);
	};

	const resetSettings = async () => {
		setSettings(DEFAULT_SETTINGS);
		await saveSettings(DEFAULT_SETTINGS);
	};

	return (
		<SettingsContext.Provider
			value={{ ...settings, updateSettings, resetSettings }}
		>
			{children}
		</SettingsContext.Provider>
	);
}

export function useSettings() {
	const context = useContext(SettingsContext);
	if (!context)
		throw new Error("useSettings must be used within SettingsProvider");
	return context;
}
