import { FaRedo } from "react-icons/fa";

type Props = {
	onClick: () => void;
};

export default function ResetButton({ onClick }: Props) {
	return (
		<button
			onClick={onClick}
			className="px-4 py-3 rounded-xl bg-white/20 backdrop-blur-xl shadow-lg border border-white/30 hover:bg-white/30 active:scale-[0.98] transition-[background,transform] duration-200 flex items-center justify-center"
		>
			<FaRedo size={20} />
		</button>
	);
}
