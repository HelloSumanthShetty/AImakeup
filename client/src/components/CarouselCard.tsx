import { motion, useTransform, MotionValue } from 'framer-motion';

const CARD_WIDTH = 280;
const CARD_HEIGHT = 420;

interface CarouselCardProps {
    index: number;
    src: string;
    progress: MotionValue<number>;
    total: number;
    isSelected: boolean;
    onClick: () => void;
}

const CarouselCard = ({ index, src, progress, total, isSelected, onClick }: CarouselCardProps) => {

    const getDiff = (latest: number) => {
        let diff = (index - latest) % total;
        if (diff < -total / 2) diff += total;
        if (diff > total / 2) diff -= total;
        return diff;
    };

    const x = useTransform(progress, (latest: number) => {
        const diff = getDiff(latest);
        return diff * 200;
    });

    const y = useTransform(progress, () => {
        return -CARD_HEIGHT / 2;
    });

    const z = useTransform(progress, (latest: number) => {
        const diff = getDiff(latest);
        return Math.abs(diff) < 0.5 ? 0 : -Math.abs(diff) * 150;
    });

    const rotateY = useTransform(progress, (latest: number) => {
        const diff = getDiff(latest);
        return Math.abs(diff) < 0.5 ? 0 : (diff > 0 ? -30 : 30);
    });

    const rotateZ = useTransform(progress, (latest: number) => {
        const diff = getDiff(latest);
        return Math.abs(diff) < 0.5 ? 0 : (diff > 0 ? -2 : 2);
    });

    const scale = useTransform(progress, (latest: number) => {
        const diff = getDiff(latest);
        return Math.abs(diff) < 0.5 ? 1.4 : Math.max(0.8, 1 - Math.abs(diff) * 0.15);
    });

    const opacity = useTransform(progress, (latest: number) => {
        const diff = getDiff(latest);
        return Math.abs(diff) > 3.5 ? 0 : Math.max(0.3, 1 - Math.abs(diff) * 0.25);
    });

    const zIndex = useTransform(progress, (latest: number) => {
        const diff = getDiff(latest);
        return 100 - Math.round(Math.abs(diff) * 10);
    });

    const display = useTransform(progress, (latest: number) => {
        const diff = getDiff(latest);
        return Math.abs(diff) > 4 ? "none" : "block";
    });

    return (
        <motion.div
            style={{
                display,
                x,
                y,
                z,
                rotateY,
                rotateZ,
                scale,
                opacity,
                zIndex,
                transformPerspective: 1000,
                position: 'absolute',
                top: '50%',
                width: `${CARD_WIDTH}px`,
                height: `${CARD_HEIGHT}px`,
                transformStyle: "preserve-3d", 
            }}
            onClick={onClick}
        >
            <motion.div
                className={`w-full h-full   rounded-2xl overflow-hidden bg-white shadow-2xl transition-all duration-300 ${isSelected ? 'ring-2 ring-zinc-400/90' : ''}`}
                style={{ willChange: "transform" }}
                whileHover={{ scale: 1.02 }}
            >
                <img
                    src={src}
                    alt="Model"
                    className="w-full h-full object-cover pointer-events-none"
                    loading="eager"
                />
            </motion.div>
        </motion.div>
    );
};

export default CarouselCard;
