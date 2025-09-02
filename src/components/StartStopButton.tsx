import { FaPause, FaPlay } from "react-icons/fa";

type Props = {
  running: boolean;
  onClick: () => void;
};

export default function StartStopButton({ running, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-3 rounded-xl bg-white/20 backdrop-blur-xl text-white
                 shadow-lg border border-white/30 hover:bg-white/30 active:scale-[0.98]
                 transition-[background,transform] duration-200 flex items-center justify-center"
    >
      {running ? <FaPause size={20} /> : <FaPlay size={20} />}
    </button>
  );
}
