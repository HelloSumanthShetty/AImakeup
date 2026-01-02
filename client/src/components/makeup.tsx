

const Makeup = () => {
    return (
        <div className="relative w-full min-h-screen    max-w-[98%] ">
            <div className="absolute z-10 top-1/2 transform -translate-y-1/2 left-0 right-0 bg-white/80 backdrop-blur-xl border border-zinc-700/45 rounded-[32px] shadow-2xl shadow-black/10 p-8 md:p-12 h-[90%] flex gap-8">
                <div className="flex-1 flex flex-col gap-6">
                    <div className="h-full border-2 border-dashed border-gray-100 rounded-2xl flex items-center justify-center text-gray-600">
                        Content Area
                    </div>
                </div>

                <div className="flex-1 hidden md:flex flex-col gap-6">
                    <div className="h-full border-2 border-dashed border-gray-100 rounded-2xl flex items-center justify-center text-gray-600">
                        Controls Area
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Makeup;
