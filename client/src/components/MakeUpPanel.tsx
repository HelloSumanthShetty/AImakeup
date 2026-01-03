import ControlsArea from './ControlsArea';

interface MakeUpPanelProps {
    selectedImage: string | null;
    uploadedImage: string | null;
    makeupState: Record<string, any>;
    setMakeupState: (state: Record<string, any>) => void;
}

const MakeUpPanel = ({ selectedImage, uploadedImage, makeupState, setMakeupState }: MakeUpPanelProps) => {
    const currentBaseImage = uploadedImage || selectedImage;

    return (
        <div className="flex-1 bg-gray-50/50 rounded-2xl border border-gray-100 p-6 flex flex-col relative overflow-hidden h-full">
            {currentBaseImage ? (
                <div className="flex-1 flex gap-6 h-full overflow-hidden">
                    {/* Preview Area (Left Side of Panel) */}
                    <div className="flex-1 relative flex items-center justify-center bg-transparent min-h-0">
                        <img
                            src={currentBaseImage}
                            className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
                            alt="Model Preview"
                        />
                    </div>

                    {/* Controls sidebar (Right Side of Panel) */}
                    <div className="w-[380px] bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-y-auto flex-shrink-0">
                        <ControlsArea makeupState={makeupState} setMakeupState={setMakeupState} />
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-slate-400 flex-col gap-4 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl">
                        🎨
                    </div>
                    <p className="font-medium text-slate-500">Select a model or upload a photo<br />to start editing</p>
                </div>
            )}
        </div>
    );
};

export default MakeUpPanel;
