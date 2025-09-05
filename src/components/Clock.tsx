type Props = {
	time: string;
};

export default function Clock({ time }: Props) {
	return (
		<div className="sm:p-6 p-3 border shadow-lg rounded-2xl bg-white/10 backdrop-blur-xl border-white/20">
			<h1
				className="font-mono text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-10xl tracking-widest text-white drop-shadow-md"
			>
				{time}
			</h1>
		</div>
	);
}
