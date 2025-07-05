"use client";

import React, { useState } from "react";
import Image from "next/image";
import "../animations/pulse-gradient.css";

interface MenuItemProps {
  link: string;
  text: string;
  image: string;
}

interface NavbarProps {
  items: MenuItemProps[];
}

const Navbar: React.FC<NavbarProps> = ({ items }) => {
  // Initialize all items as active (true) by default
  const [itemStates, setItemStates] = useState<Record<string, boolean>>(
    items.reduce((acc, item) => {
      acc[item.link] = true; // Default to active
      return acc;
    }, {} as Record<string, boolean>)
  );

  const handleToggle = (link: string) => {
    setItemStates(prev => ({
      ...prev,
      [link]: !prev[link]
    }));
  };

  return (
    <nav className="w-full bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <Image
              src="/assets/logo/raydium.svg"
              alt="Raydium Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="text-white text-xl font-bold">
              Raydium <span className="pulse-gradient-text">Pulse</span>
            </span>
          </div>

          {/* Menu Items */}
          <div className="flex items-center">
            {items.map((item, index) => {
              const isActive = itemStates[item.link];
              return (
                <React.Fragment key={index}>
                  <button
                    onClick={() => handleToggle(item.link)}
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 overflow-hidden ${
                      isActive
                        ? "text-black shadow-lg hover:opacity-90"
                        : "text-gray-300 shadow-sm hover:opacity-80"
                    }`}
                    style={{
                      backgroundColor: isActive ? '#39d0d8' : '#151b33'
                    }}
                  >
                    {/* Horizontal edge vignette for disabled state */}
                    {!isActive && (
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.8) 100%)'
                        }}
                      />
                    )}
                    <span className="relative z-10">{item.text}</span>
                  </button>
                  {index < items.length - 1 && (
                    <div className="w-px h-8 bg-gray-400"></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
