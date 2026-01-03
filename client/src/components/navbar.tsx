import React, { useState, useRef, useEffect, useCallback } from "react";

const Navbar = () => {
    const navRef = useRef<HTMLDivElement>(null);
    const pillRef = useRef<HTMLDivElement>(null);
    const lastScrollY = useRef(0);

    const [isVisible, setIsVisible] = useState(true);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const navbar = [
        { name: "Headshots", href: "#" },
        { name: "Free Headshot", href: "#" },
        { name: "Portraits", href: "#" },
        { name: "Pricing", href: "#" },
        { name: "Personal Branding", href: "#" },
        { name: "Affiliate", href: "#" },
    ];

    useEffect(() => {
        let ticking = false;

        const onScroll = () => {
            if (ticking) return;

            ticking = true;
            requestAnimationFrame(() => {
                const currentY = window.scrollY;
                console.log(currentY)
                if (currentY > lastScrollY.current && currentY > 120) {
                    setIsVisible(false);
                } else {
                    setIsVisible(true);
                }

                lastScrollY.current = currentY;
                ticking = false;
            });
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleMouseEnter = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
            if (!navRef.current || !pillRef.current) return;

            const itemRect = e.currentTarget.getBoundingClientRect();
            const navRect = navRef.current.getBoundingClientRect();

            pillRef.current.style.width = `${itemRect.width}px`;
            pillRef.current.style.height = `${itemRect.height}px`;
            pillRef.current.style.transform = `translateX(${itemRect.left - navRect.left}px)`;
            pillRef.current.style.opacity = "1";

            setHoveredIndex(index);
        },
        []
    );

    const handleMouseLeave = () => {
        if (pillRef.current) {
            pillRef.current.style.opacity = "0";
        }
        setHoveredIndex(null);
    };

    return (
        <div className="relative z-50">
            <nav
                className={`fixed top-8 w-[95%] md:mx-8 max-md:left-3 
        transition-transform duration-300 
        ${isVisible ? "translate-y-0" : "-translate-y-[200%]"}
        bg-white shadow-[0_4px_16px_-1px_rgba(0,0,0,0.15)]
        h-[40px] rounded-[22px] flex items-center justify-between px-8`}
            >
                {/* Logo */}
                <a href="/" className="flex items-center">
                    <img
                        src="https://r1.gostudio.ai/public/final_Logo.svg"
                        alt="Studio.ai logo"
                        className="h-[40px] w-[120px]"
                    />
                </a>

                {/* Nav Items */}
                <div
                    ref={navRef}
                    className="hidden max-lg:text-[8px]  md:flex relative items-center gap-1 text-sm font-semibold text-gray-800"
                    onMouseLeave={handleMouseLeave}
                >
                    <div
                        ref={pillRef}
                        className="absolute left-0 bg-gradient-to-r from-rose-200 to-rose-300 rounded-full 
            transition-all duration-300 ease-out pointer-events-none opacity-0"
                    />

                    {navbar.map((nav, index) => (
                        <a
                            key={nav.name}
                            href={nav.href}
                            onMouseEnter={(e) => handleMouseEnter(e, index)}
                            className={`relative  z-10 px-4 py-2 rounded-full transition-colors duration-200
                ${hoveredIndex === index ? "text-black" : ""}`}
                        >
                            {nav.name}
                        </a>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-6">
                    <a href="#" className="text-sm font-bold text-gray-900 hover:text-gray-600">
                        Log in
                    </a>
                    <button className="bg-black text-white px-5 h-[38px] rounded-full text-sm font-semibold">
                        Sign up
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
