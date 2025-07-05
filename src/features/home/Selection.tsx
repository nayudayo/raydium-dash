"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { gsap } from "gsap";

// Register GSAP
gsap.registerPlugin();

interface MenuItemProps {
  link: string;
  text: string;
  image: string;
  index?: number;
}

interface FlowingMenuProps {
  items?: MenuItemProps[];
}

const defaultItems: MenuItemProps[] = [
  {
    link: "/dex-volume",
    text: "DEX Volume",
    image: "/globe.svg"
  },
  {
    link: "/tvl",
    text: "Total Value Locked",
    image: "/file.svg"
  },
  {
    link: "/fees",
    text: "Protocol Fees",
    image: "/window.svg"
  },
  {
    link: "/revenue",
    text: "Protocol Revenue",
    image: "/next.svg"
  },
  {
    link: "/aggregator-market-share",
    text: "Aggregator Market Share",
    image: "/vercel.svg"
  }
];

const FlowingMenu: React.FC<FlowingMenuProps> = ({ items = defaultItems }) => {
  return (
    <div className="w-full h-full overflow-hidden relative">
      {/* Raydium logo watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
        <img 
          src="/assets/logo/raydium.svg" 
          alt="Raydium Logo" 
          className="w-128 h-128 object-contain opacity-10"
        />
      </div>
      
      <nav className="flex flex-col h-full m-0 p-0 relative z-10">
        {items.map((item, idx) => (
          <MenuItem key={idx} {...item} index={idx} />
        ))}
      </nav>
    </div>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({ link, text, image, index = 0 }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);

  const animationDefaults = { duration: 0.6, ease: "power2.out" };

  useEffect(() => {
    // Initialize marquee position
    if (marqueeRef.current && marqueeInnerRef.current) {
      gsap.set(marqueeRef.current, { y: "101%" });
      gsap.set(marqueeInnerRef.current, { y: "-101%" });
    }
  }, []);

  const findClosestEdge = (
    mouseX: number,
    mouseY: number,
    width: number,
    height: number
  ): "top" | "bottom" => {
    const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2);
    const bottomEdgeDist =
      Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2);
    return topEdgeDist < bottomEdgeDist ? "top" : "bottom";
  };

  const handleMouseEnter = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current)
      return;
    
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(
      ev.clientX - rect.left,
      ev.clientY - rect.top,
      rect.width,
      rect.height
    );

    const tl = gsap.timeline({ defaults: animationDefaults });
    tl.set(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" })
      .set(marqueeInnerRef.current, { y: edge === "top" ? "101%" : "-101%" })
      .to([marqueeRef.current, marqueeInnerRef.current], { y: "0%" });
  };

  const handleMouseLeave = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current)
      return;
    
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(
      ev.clientX - rect.left,
      ev.clientY - rect.top,
      rect.width,
      rect.height
    );

    const tl = gsap.timeline({ defaults: animationDefaults });
    tl.to(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" })
      .to(marqueeInnerRef.current, { y: edge === "top" ? "101%" : "-101%" }, "<");
  };

  const repeatedMarqueeContent = useMemo(() => {
    return Array.from({ length: 4 }).map((_, idx) => (
      <React.Fragment key={idx}>
        <span className="text-[#060010] uppercase font-normal text-[4vh] leading-[1.2] p-[1vh_1vw_0]">
          {text}
        </span>
        <div
          className="w-[200px] h-[7vh] my-[2em] mx-[2vw] p-[1em_0] rounded-[50px] bg-cover bg-center bg-gray-300"
          style={{ backgroundImage: `url(${image})` }}
        />
      </React.Fragment>
    ));
  }, [text, image]);

  return (
    <div
      className="flex-1 relative overflow-hidden text-center shadow-[0_-1px_0_0_#fff] opacity-0 animate-fade-in-up"
      ref={itemRef}
      style={{ 
        animationDelay: `${index * 0.15 + 1.3}s`, 
        animationFillMode: 'forwards' 
      }}
    >
      <a
        className="flex items-center justify-center h-full relative cursor-pointer uppercase no-underline font-semibold text-white text-[4vh] hover:text-[#060010] focus:text-white focus-visible:text-[#060010] transition-colors duration-300"
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {text}
      </a>
      <div
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none bg-white"
        ref={marqueeRef}
        style={{ transform: 'translateY(101%)' }}
      >
        <div 
          className="h-full w-[200%] flex" 
          ref={marqueeInnerRef}
          style={{ transform: 'translateY(-101%)' }}
        >
          <div className="marquee-container flex items-center relative h-full w-[200%]">
            <div className="marquee-content">
              {repeatedMarqueeContent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowingMenu;

// Note: this is also needed
// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {
//       translate: {
//         '101': '101%',
//       },
//       keyframes: {
//         marquee: {
//           'from': { transform: 'translateX(0%)' },
//           'to': { transform: 'translateX(-50%)' }
//         }
//       },
//       animation: {
//         marquee: 'marquee 15s linear infinite'
//       }
//     }
//   },
//   plugins: [],
// };
