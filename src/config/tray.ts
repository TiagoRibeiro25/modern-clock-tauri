import { TrayIconOptions } from "@tauri-apps/api/tray";
import { openUrl } from "@tauri-apps/plugin-opener";

export const PLAY_ICON = "icons/play.png";
export const STOP_ICON = "icons/stop.png";

export const config: TrayIconOptions = {
	icon: PLAY_ICON,
	tooltip: "Modern Clock",
    action: (event) => {
        if (event.type === "Click") {
            openUrl("https://github.com/TiagoRibeiro25/modern-clock-tauri");
        }
    }
};
