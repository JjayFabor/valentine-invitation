export const PhotoSlide = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-6">
            <h2 className="text-2xl font-bold text-pink-400">Memory Lane</h2>
            <div className="w-full aspect-square bg-gray-800 rounded-xl overflow-hidden shadow-2xl skew-y-3 rotate-2 border-4 border-white/10 relative group">
                {/* Placeholder for Photo */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-700 text-gray-500">
                    <span className="text-4xl">📸</span>
                    {/* Replace this div with an <img src="..." /> later */}
                </div>
            </div>
            <p className="text-lg italic text-gray-300">
                "Remember that time we..."
            </p>
        </div>
    );
};
