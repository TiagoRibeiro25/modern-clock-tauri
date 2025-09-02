type Props = {
	time: string;
};

export default function Clock({ time }: Props) {
	return (
		<div className="p-6 border shadow-lg rounded-2xl bg-white/10 backdrop-blur-xl border-white/20">
			<h1 className="font-mono text-6xl tracking-widest text-white drop-shadow-md">
				{time}
			</h1>
		</div>
	);
}
