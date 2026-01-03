import { useState, useEffect, useRef } from 'react';
import { Upload, Camera } from 'lucide-react';
import { motion, useMotionValue, animate, useMotionValueEvent } from 'framer-motion';

import CarouselCard from './CarouselCard';
import MakeUpPanel from './MakeUpPanel';

// Import all portrait images
import Colombia from '../assets/Colombia.png';
import Indian from '../assets/Indian.png';
import Venezuela from '../assets/Venezuela.png';
import Vietnam from '../assets/Vietnam.png';
import American from '../assets/american.png';
import Black from '../assets/black.png';
import Brazilian from '../assets/brazilian.png';
import European from '../assets/european.png';
import Korean from '../assets/korean.png';
import Nigerian from '../assets/nigerian.png';
import OfficeLady from '../assets/german.png';
import Russian from '../assets/russian.png';

const portraitImages = [
    Colombia, Indian, Venezuela, Vietnam, American, Black,
    Brazilian, European, Korean, Nigerian, OfficeLady, Russian
];

const Makeup = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [activeBackgroundIndex, setActiveBackgroundIndex] = useState(0);
    const [makeupState, setMakeupState] = useState<Record<string, any>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 0 to total length loop
    const progress = useMotionValue(0);
    const controlsRef = useRef<any>(null);

    // Track active index for background update
    useMotionValueEvent(progress, "change", (latest) => {
        const rounded = Math.round(latest) % portraitImages.length;
        const normalized = rounded < 0 ? rounded + portraitImages.length : rounded;
        if (normalized !== activeBackgroundIndex) {
            setActiveBackgroundIndex(normalized);
        }
    });

    useEffect(() => {
        startAutoScroll();
        return () => stopAutoScroll();
    }, []);

    const startAutoScroll = () => {
        stopAutoScroll();
        controlsRef.current = animate(progress, portraitImages.length, {
            ease: "linear",
            duration: 25,
            repeat: Infinity,
            repeatType: 'loop'
        });
    };

    const stopAutoScroll = () => {
        if (controlsRef.current) {
            controlsRef.current.stop();
        }
    };

    const handleCardClick = (index: number) => {
        if (selectedImage === portraitImages[index]) {
            // Deselect
            setSelectedImage(null);
            startAutoScroll();
        } else {
            // Select logic
            setSelectedImage(portraitImages[index]);
            stopAutoScroll();

            // Calculate shortest path to snap 'index' to current progress position (which effectively centers it)
            // Actually we want to snap progress to 'index'.

            let current = progress.get() % portraitImages.length;
            if (current < 0) current += portraitImages.length;

            let target = index;
            // logic to find shortest wrapping path
            let dist = target - current;
            if (dist > portraitImages.length / 2) target -= portraitImages.length;
            if (dist < -portraitImages.length / 2) target += portraitImages.length;

            // We animate the progress to the target
            // But since 'progress' loops 0-length, we might need to handle the visual jump if we go out of bounds.
            // However, useTransform handles modulo, so we can just animate to 'current + dist'

            animate(progress, current + dist, {
                type: "spring",
                stiffness: 150,
                damping: 20
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setUploadedImage(event.target?.result as string);
                stopAutoScroll();
                setSelectedImage(null); // Clear preset selection if uploading
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="relative w-full min-h-screen max-w-[98%]">
            <div className="absolute z-10 md:top-1/2 transform md:-translate-y-1/2 left-0 right-0 bg-white/80 backdrop-blur-xl max-md:flex-col  border-zinc-200/50 rounded-[32px] shadow-2xl overflow-hidden  flex gap-4 h-[90%]">

                {/* Left Panel - Image Carousel */}
                <div className="flex-1 overflow-hidden  relative flex items-center justify-center perspective-container rounded-2xl">

                    <div className="absolute max-md:hidden inset-0 z-0">
                        {portraitImages.map((src, i) => (
                            <motion.img
                                key={i}
                                src={src}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: i === activeBackgroundIndex ? 0.6 : 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110"
                            />
                        ))}

                        <div className="absolute inset-0 bg-white/30" />
                    </div>

                    <div className="relative z-10 w-full h-full flex overflow-hidden items-center justify-center perspective-[1000px]">
                        {portraitImages.map((src, i) => (
                            <CarouselCard
                                key={i}
                                index={i}
                                src={src}
                                activeIndex={activeBackgroundIndex}
                                isSelected={selectedImage === src}
                                onClick={() => handleCardClick(i)}
                            />
                        ))}
                    </div>

                    <div className="absolute max-md:bottom-2 max-md:text-[12px]  md:bottom-8  left-1/2 transform -translate-x-1/2 flex gap-4 z-50">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md border border-white/40 text-slate-900 rounded-full    shadow-lg hover:bg-white/40 transition-all hover:-translate-y-1 font-medium"
                        >
                            <Upload size={18} />
                            Upload Image
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <button className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md border border-white/40 text-slate-900 rounded-full shadow-lg hover:bg-white/40 transition-all hover:-translate-y-1 font-medium">
                            <Camera size={18} />
                            Take Photo
                        </button>
                    </div>

                    <div className="absolute text-xl  max-md:text-sm top-2  left-0  right-0 text-center pointer-events-none z-20">
                        <h3 className="  font-bold text-slate-800 drop-shadow-sm">Select a Model</h3>
                        <p className="text-sm text-slate-300 font-medium drop-shadow-sm">or upload your own photo below</p>
                    </div>
                </div>

                {/* Right Panel - MakeUp Controls */}
                <div className="flex-1 relative z-10 h-full p-4">
                    <MakeUpPanel
                        selectedImage={selectedImage}
                        uploadedImage={uploadedImage}
                        makeupState={makeupState}
                        setMakeupState={setMakeupState}
                    />
                </div>
            </div>
        </div>
    );
};

export default Makeup;
