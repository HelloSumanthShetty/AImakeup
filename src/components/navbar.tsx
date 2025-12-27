import React, { useState, useRef, useEffect } from 'react';

const Navbar = () => {
    const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const navRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

    const navbar = [
        { name: "Headshots", href: "#" },
        { name: "Free Headshot", href: "#" },
        { name: "Portraits", href: "#" },
        { name: "Pricing", href: "#" },
        { name: "Personal Branding", href: "#" },
        { name: "Affiliate", href: "#" },
    ];

    const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
        const target = e.currentTarget;
        setHoveredRect(target.getBoundingClientRect());
        setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredRect(null);
        setHoveredIndex(null);
    };

    const getPillStyle = () => {
        if (!hoveredRect || !navRef.current) return { opacity: 0 };

        const navRect = navRef.current.getBoundingClientRect();
        return {
            width: hoveredRect.width,
            height: hoveredRect.height,
            transform: `translateX(${hoveredRect.left - navRect.left}px)`,
            opacity: 1,
        };
    };

    return (
        <div className='relative z-50'>
            <nav className="flex absolute w-[95%] top-8 bg-white shadow-[0_4px_16px_-1px_rgba(0,0,0,0.15)] h-[40px] rounded-[22px] mx-8 items-center justify-between px-8 py-4 ">
                <a className="flex items-center" href="/">
                    <img
                        alt="Studio.ai logo"
                        title="Studio.ai - AI Headshot Generator"
                        className="h-[40px] w-[60px] xs:w-[70px] sm:w-[80px] md:w-[100px] lg:w-[120px]"
                        src="https://r1.gostudio.ai/public/final_Logo.svg"
                    />
                </a>

                <div
                    ref={navRef}
                    className="hidden md:flex items-center relative gap-1 text-sm font-semibold text-gray-800"
                    onMouseLeave={handleMouseLeave}
                >
                    <div
                        className="absolute left-0 bg-gradient-to-r from-rose-200 to-rose-300 rounded-full transition-all duration-300 ease-in-out pointer-events-none"
                        style={{
                            ...getPillStyle(),
                            // Position it vertically aligned with items (items are vertically centered in flex row)
                            // We use relative positioning via transform, so top-0 is fine because items are full height in the flex container? 
                            // Actually, explicit top value might be needed if items have margin. 
                            // But usually, putting it at top-0 of the container and using translate works if container is relative.
                            top: hoveredRect && navRef.current ? hoveredRect.top - navRef.current.getBoundingClientRect().top : 0
                        }}
                    ></div>

                    {navbar.map((nav, index) => (
                        <a
                            key={nav.name}
                            href={nav.href}
                            ref={(el) => { itemRefs.current[index] = el }}
                            onMouseEnter={(e) => handleMouseEnter(e, index)}
                            className={`relative z-10 px-4 py-2 rounded-full transition-colors duration-200 ${hoveredIndex === index ? 'text-black' : ''
                                }`}
                        >
                            {nav.name}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-6">
                    <a href="#" className="text-sm font-bold text-gray-900 hover:text-gray-600">Log in</a>
                    <button className="bg-black text-white px-5 h-[40px] rounded-full text-sm font-semibold  transition-all duration-300 ease-in-out">
                        Sign up
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
