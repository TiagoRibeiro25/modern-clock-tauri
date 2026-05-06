import { FaPause, FaPlay } from "react-icons/fa";
import { useSettings } from "../hooks/useSettings";

type Props = {
	running: boolean;
	onClick: () => void;
};

export default function StartStopButton({ running, onClick }: Props) {
	const { buttonColor } = useSettings();

	return (
		<button
			onClick={onClick}
			style={{ backgroundColor: buttonColor }}
			className="px-4 py-3 rounded-xl shadow-lg border border-white/10 hover:brightness-110 active:scale-[0.98] transition-all duration-200 flex items-center justify-center text-white"
		>
			{running ? <FaPause size={20} /> : <FaPlay size={20} />}
		</button>
	);
}
