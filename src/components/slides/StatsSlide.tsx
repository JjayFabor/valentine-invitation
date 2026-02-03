export const StatsSlide = () => {
    // Placeholder stats
    const stats = [
        { label: "Days Together", value: "730+" },
        { label: "Coffees Shared", value: "∞" },
        { label: "Arguments Won by You", value: "100%" },
    ];

    return (
        <div className="flex flex-col items-center justify-center h-full w-full p-6 space-y-8">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                The Data
            </h2>

            <div className="flex flex-col gap-6 w-full max-w-xs">
                {stats.map((stat, index) => (
                    <div key={index} className="flex justify-between items-end border-b border-white/20 pb-2">
                        <span className="text-lg text-gray-300">{stat.label}</span>
                        <span className="text-2xl font-bold text-white">{stat.value}</span>
                    </div>
                ))}
            </div>

            <p className="text-sm text-gray-400">
                (Source: My Heart, 2025)
            </p>
        </div>
    );
};
