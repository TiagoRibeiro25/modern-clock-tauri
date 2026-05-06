import { VscClose } from "react-icons/vsc";
import { HexColorPicker } from "react-colorful";
import { useSettings } from "../hooks/useSettings";

interface SettingsProps {
	onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
	const { buttonColor, backgroundColor, updateSettings, resetSettings } = useSettings();

	return (
		<div className="flex-1 flex flex-col p-8 bg-stone-900/50 text-white w-full h-full relative max-w-2xl mx-auto mt-10 rounded-xl overflow-y-auto">
			<div className="flex justify-between items-center mb-8 border-b border-stone-700 pb-4 shrink-0">
				<h2 className="text-2xl font-light text-stone-300">Settings</h2>
				<button
					onClick={onClose}
					className="p-2 hover:bg-stone-800 rounded text-stone-400 hover:text-white transition-colors"
					title="Close Settings"
				>
					<VscClose className="w-6 h-6" />
				</button>
			</div>
			<div className="flex-1 flex flex-col gap-6">
				<div className="bg-stone-800 p-6 rounded-lg border border-stone-700 flex flex-col gap-6">
					<div>
						<h3 className="text-lg font-medium text-white mb-2">Appearance</h3>
						<p className="text-stone-400 text-sm mb-4">
							Customize the colors of your clock interface.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="flex flex-col items-center gap-4">
							<span className="text-stone-300 text-sm">Background Color</span>
							<HexColorPicker 
								color={backgroundColor} 
								onChange={(color) => updateSettings({ backgroundColor: color })} 
							/>
							<div className="flex items-center gap-2 mt-2">
								<div 
									className="w-6 h-6 rounded-md border border-stone-600" 
									style={{ backgroundColor }}
								></div>
								<span className="text-stone-400 font-mono text-sm">{backgroundColor}</span>
							</div>
						</div>

						<div className="flex flex-col items-center gap-4">
							<span className="text-stone-300 text-sm">Button Color</span>
							<HexColorPicker 
								color={buttonColor} 
								onChange={(color) => updateSettings({ buttonColor: color })} 
							/>
							<div className="flex items-center gap-2 mt-2">
								<div 
									className="w-6 h-6 rounded-md border border-stone-600" 
									style={{ backgroundColor: buttonColor }}
								></div>
								<span className="text-stone-400 font-mono text-sm">{buttonColor}</span>
							</div>
						</div>
					</div>

					<div className="flex justify-end pt-4 border-t border-stone-700 mt-4">
						<button 
							onClick={resetSettings}
							className="px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded transition-colors text-sm font-medium"
						>
							Reset to Defaults
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
