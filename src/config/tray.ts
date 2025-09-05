import { resolveResource } from "@tauri-apps/api/path";
import { TrayIconOptions } from "@tauri-apps/api/tray";
import { openUrl } from "@tauri-apps/plugin-opener";

export let PLAY_ICON: string;
export let STOP_ICON: string;

export const config: TrayIconOptions = {
	tooltip: "Modern Clock",
	action: (event) => {
		if (event.type === "Click") {
			openUrl("https://github.com/TiagoRibeiro25/modern-clock-tauri");
		}
	},
};

export async function initIcons() {
	console.log("Resolving icon paths...");
	PLAY_ICON = await resolveResource("icons/play.png");
	STOP_ICON = await resolveResource("icons/stop.png");
	console.log("Icon paths resolved:", { PLAY_ICON, STOP_ICON });
	config.icon = PLAY_ICON;
}
