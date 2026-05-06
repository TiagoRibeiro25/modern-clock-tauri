import { FaRedo } from "react-icons/fa";
import { useSettings } from "../hooks/useSettings";

type Props = {
	onClick: () => void;
};

export default function ResetButton({ onClick }: Props) {
	const { buttonColor } = useSettings();

	return (
		<button
			onClick={onClick}
			style={{ backgroundColor: buttonColor }}
			className="px-4 py-3 rounded-xl shadow-lg border border-white/10 hover:brightness-110 active:scale-[0.98] transition-all duration-200 flex items-center justify-center text-white"
		>
			<FaRedo size={20} />
		</button>
	);
}
