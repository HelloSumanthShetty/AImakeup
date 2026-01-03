import { useState } from 'react';
import { MAKEUP_DATA, type MainCategory, type SubCategory, type MakeupFeature } from '../data/makeupConstants';
import { Pipette, Eye, PenTool, Smile, Palette, Brush } from 'lucide-react';

interface ControlsAreaProps {
    makeupState: Record<string, any>;
    setMakeupState: (state: Record<string, any>) => void;
}

// Flattened Tab Configuration
const TABS = [
    { id: 'lipstick', label: 'Lipstick', icon: Pipette, target: { mainId: 'lips', subIds: ['lipstick'] } },
    { id: 'blush', label: 'Blush', icon: Palette, target: { mainId: 'face', subIds: ['blush'] } },
    { id: 'eyeliner', label: 'Eye Liner', icon: PenTool, target: { mainId: 'eyes', subIds: ['eyeliner'] } },
    { id: 'eyeshadow', label: 'Eye Shadow', icon: Eye, target: { mainId: 'eyes', subIds: ['eyeshadow'] } },
    { id: 'lipliner', label: 'Lip Liner', icon: PenTool, target: { mainId: 'lips', subIds: ['lipliner'] } },
    { id: 'mascara', label: 'Mascara', icon: Brush, target: { mainId: 'eyes', subIds: ['mascara'] } },
    { id: 'eyebrows', label: 'Eyebrows', icon: Smile, target: { mainId: 'brows', subIds: ['eyebrow_color', 'eyebrow_shape'] } },
];

const ControlsArea = ({ makeupState, setMakeupState }: ControlsAreaProps) => {
    const [activeTabId, setActiveTabId] = useState<string>('eyebrows'); // Default to eyebrows as in design

    const handleInternalChange = (featureId: string, value: any) => {
        setMakeupState({
            ...makeupState,
            [featureId]: value
        });
    };

    const activeTab = TABS.find(t => t.id === activeTabId) || TABS[0];

    // Helper to gather all relevant features for the active tab
    const getActiveFeatures = () => {
        const { mainId, subIds } = activeTab.target;
        const mainCat = MAKEUP_DATA.find(c => c.id === mainId);
        if (!mainCat) return [];

        // Filter subcategories
        const relevantSubCats = mainCat.subCategories.filter(sc => subIds.includes(sc.id));

        // Flatten features from all relevant subcategories
        return relevantSubCats.flatMap(sc => sc.features);
    };

    const activeFeatures = getActiveFeatures();

    // Group features by type (Colors vs Patterns/Others) to match design layout
    const colorFeatures = activeFeatures.filter(f => f.type === 'color');
    const patternFeatures = activeFeatures.filter(f => f.type === 'pattern' || f.type === 'select'); // Group select with patterns for now
    // We can also have sliders etc.

    return (
        <div className="flex flex-col h-full bg-transparent">
            {/* Top Navigation - Flattened Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTabId === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTabId(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border
                                ${isActive
                                    ? 'bg-transparent border-pink-500 text-slate-800 ring-1 ring-pink-500' // Active state: outline style or filled? Design has outlined pink box for active.
                                    : 'bg-white border-transparent text-slate-400 hover:border-gray-200 hover:text-slate-600 shadow-sm'
                                }`}
                        >
                            {Icon && <Icon size={14} className={isActive ? "text-pink-500" : "text-slate-400"} />}
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">

                {colorFeatures.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Colors</h3>
                        <div className="flex flex-wrap gap-4">
                            {colorFeatures.map(feature => (
                                <div key={feature.id} className="flex gap-3">
                                    <FeatureControl
                                        feature={feature}
                                        value={makeupState[feature.id]}
                                        onChange={(val) => handleInternalChange(feature.id, val)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {patternFeatures.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Patterns</h3>
                        <div className="grid gap-6">
                            {patternFeatures.map(feature => (
                                <FeatureControl
                                    key={feature.id}
                                    feature={feature}
                                    value={makeupState[feature.id]}
                                    onChange={(val) => handleInternalChange(feature.id, val)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Catch-all for other types (sliders) */}
                {activeFeatures.filter(f => !['color', 'pattern', 'select'].includes(f.type)).map(feature => (
                    <div key={feature.id} className="space-y-2 pt-4 border-t border-gray-100">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">{feature.label}</h3>
                        <FeatureControl
                            feature={feature}
                            value={makeupState[feature.id]}
                            onChange={(val) => handleInternalChange(feature.id, val)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Subcomponent ---

const FeatureControl = ({ feature, value, onChange }: { feature: MakeupFeature, value: any, onChange: (val: any) => void }) => {
    const currentValue = value !== undefined ? value : feature.defaultValue;

    // --- COLOR RENDERER ---
    if (feature.type === 'color' && feature.colors) {
        return (
            <div className="flex flex-wrap gap-3">
                {/* "None" Option */}
                <button
                    onClick={() => onChange(null)}
                    className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${currentValue === null ? 'border-pink-500 ring-2 ring-pink-100' : 'border-slate-200 hover:border-slate-300'}`}
                    title="None"
                >
                    <div className="w-5 h-5 text-slate-300 relative">
                        <div className="w-full h-0.5 bg-current absolute top-1/2 left-0 -rotate-45" />
                        <div className="w-full h-full rounded-full border-2 border-current" />
                    </div>
                </button>

                {feature.colors.map((color) => (
                    <button
                        key={color}
                        onClick={() => onChange(color)}
                        className={`w-10 h-10 rounded-full transition-all shadow-sm ${currentValue === color ? 'ring-2 ring-offset-2 ring-pink-500 scale-110' : 'hover:scale-105'}`}
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>
        );
    }

    // --- PATTERN RENDERER ---
    if (feature.type === 'pattern' && feature.options) {
        return (
            <div className="flex flex-wrap gap-3">
                {/* "None" Option - Box Style */}
                {/* Actually design doesn't show a "None" box for patterns clearly, but we need one. */}
                {/* <button
                     onClick={() => onChange(null)}
                     className={`w-16 h-12 rounded-lg border flex items-center justify-center transition-all ${currentValue === null ? 'border-pink-500 bg-pink-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                 >
                     <span className="text-xs text-slate-400 font-medium">None</span>
                 </button> */}

                {feature.options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => onChange(opt.value)}
                        className={`w-16 h-12 rounded-lg border transition-all flex items-center justify-center bg-white p-2
                            ${currentValue === opt.value
                                ? 'border-pink-500 ring-1 ring-pink-500'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                    >
                        {/* 
                           In a real app, we'd use `opt.thumbnail` or render the mask here. 
                           For now, we simulate the "brow shape" visual 
                        */}
                        <div className="w-full h-full relative opacity-80" style={{
                            maskImage: opt.render?.mask ? `url(${opt.render.mask})` : 'none',
                            WebkitMaskImage: opt.render?.mask ? `url(${opt.render.mask})` : 'none',
                            backgroundColor: '#333',
                            maskSize: 'contain',
                            WebkitMaskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            WebkitMaskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            WebkitMaskPosition: 'center',
                        }}>
                            {/* Fallback if mask fails or isn't there */}
                            {!opt.render?.mask && <span className="text-[10px] text-slate-500">{opt.label}</span>}
                        </div>
                    </button>
                ))}
            </div>
        );
    }

    // --- SLIDER RENDERER ---
    if (feature.type === 'slider') {
        return (
            <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100">
                <input
                    type="range"
                    min={feature.min || 0}
                    max={feature.max || 1}
                    step={feature.step || 0.1}
                    value={Number(currentValue) || 0}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
                <span className="text-xs font-mono text-slate-500 w-8 text-right">
                    {Math.round((Number(currentValue) || 0) * 100)}%
                </span>
            </div>
        );
    }

    // --- SELECT RENDERER ---
    if (feature.type === 'select' && feature.options) {
        return (
            <div className="flex flex-wrap gap-2">
                {feature.options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => onChange(opt.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${currentValue === opt.value ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-gray-200 hover:border-gray-300'}`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        );
    }

    return null;
}

export default ControlsArea;
