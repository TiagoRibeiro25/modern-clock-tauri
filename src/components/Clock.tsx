type Props = {
	time: string;
};

export default function Clock({ time }: Props) {
	return (
		<div className="p-3 border shadow-lg sm:p-6 rounded-2xl bg-white/10 backdrop-blur-xl border-white/20">
			<h1 className="text-5xl tracking-widest orbitron-font sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-10xl drop-shadow-md">
				{time}
			</h1>
		</div>
	);
}
