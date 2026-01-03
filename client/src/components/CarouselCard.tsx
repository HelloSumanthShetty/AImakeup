import { motion } from "framer-motion";

const CARD_WIDTH =280;
const CARD_HEIGHT =420;

interface CarouselCardProps {
  index: number;
  src: string;
  activeIndex: number;
  isSelected: boolean;
  onClick: () => void;
}

const variants = {
  center: {
    x: 0,
    z: 0,
    rotateY: 0,
    rotateZ: 0,
    scale: 1.4,
    opacity: 1,
    zIndex: 100,
  },
  left: {
    x: -200,
    z: -150,
    rotateY: 30,
    rotateZ: 2,
    scale: 0.9,
    opacity: 0.6,
    zIndex: 50,
  },
  right: {
    x: 200,
    z: -150,
    rotateY: -30,
    rotateZ: -2,
    scale: 0.9,
    opacity: 0.6,
    zIndex: 50,
  },
  hidden: {
    opacity: 0,
    scale: 0.8,
    zIndex: 0,
  },
};

const CarouselCard = ({
  index,
  src,
  activeIndex,
  isSelected,
  onClick,
}: CarouselCardProps) => {
  const offset = index - activeIndex;

  let variant: keyof typeof variants = "hidden";
  if (offset === 0) variant = "center";
  else if (offset === -1) variant = "left";
  else if (offset === 1) variant = "right";

  return (
    <motion.div
      variants={variants}
      animate={variant}
      transition={{ type: "spring", stiffness: 140, damping: 22 }}
      onClick={onClick}
      style={{
        position: "absolute",
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        transformPerspective: 1000,
      }}
    >
      <motion.div
        className={`w-full h-full rounded-2xl overflow-hidden bg-white shadow-2xl
        ${isSelected ? "ring-2 ring-zinc-400/90" : ""}`}
        whileHover={{ scale: 1.03 }}
      >
        <img
          src={src}
          alt="Model"
          className="w-full h-full object-cover pointer-events-none"
        />
      </motion.div>
    </motion.div>
  );
};

export default CarouselCard;
