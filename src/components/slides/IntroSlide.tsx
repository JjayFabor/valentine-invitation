export const IntroSlide = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-8">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                2025 Wrapped
            </h1>
            <p className="max-w-[600px] text-gray-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                It's been quite a year (or however long it's been).
                <br />
                Ready to see your highlights?
            </p>
            <div className="text-sm text-gray-400 animate-pulse">
                Tap right to continue →
            </div>
        </div>
    );
};
