"use client";

import React, { useState } from "react";
import Image from "next/image";
import "../animations/pulse-gradient.css";
import { useAggregatorData } from "../../features/aggregator-market-share/hooks/useAggregatorData";
import { useTVL } from "../../features/tvl/hooks/useTVL";
import { useRevenueData } from "../../features/revenue/hooks/useRevenueData";
import { useFeesData } from "../../features/fees/hooks/useFeesData";
import { useDexData } from "../../features/dex-volume/hooks/useDexData";

interface MenuItemProps {
  link: string;
  text: string;
  image: string;
}

interface NavbarProps {
  items: MenuItemProps[];
}

interface ProtocolData {
  name: string;
  displayName: string;
  tvl?: number;
  revenue24h?: number;
  fees24h?: number;
  dexVolume?: number;
  aggregatorVolume?: number;
  isRaydium: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ items }) => {
  // Initialize all items as active (true) by default
  const [itemStates, setItemStates] = useState<Record<string, boolean>>(
    items.reduce((acc, item) => {
      acc[item.link] = true; // Default to active
      return acc;
    }, {} as Record<string, boolean>)
  );

  // Get protocol data for marquee
  const { data: aggregatorData } = useAggregatorData();
  const { data: tvlData } = useTVL();
  const { data: revenueData } = useRevenueData();
  const { data: feesData } = useFeesData();
  const { rawData: dexData } = useDexData();

  // Combine protocol data for marquee
  const marqueeProtocols = React.useMemo(() => {
    const protocolMap = new Map<string, ProtocolData>();

    // Add aggregator data
    if (aggregatorData) {
      aggregatorData.protocols.forEach(protocol => {
        protocolMap.set(protocol.name, {
          name: protocol.name,
          displayName: protocol.name,
          aggregatorVolume: protocol.volume,
          isRaydium: protocol.isRaydium
        });
      });
    }

    // Add TVL data
    if (tvlData) {
      tvlData.protocols.forEach(protocol => {
        const existing = protocolMap.get(protocol.name) || {
          name: protocol.name,
          displayName: protocol.name,
          isRaydium: protocol.name.toLowerCase().includes('raydium')
        };
        protocolMap.set(protocol.name, {
          ...existing,
          tvl: protocol.tvl,
        });
      });
    }

    // Add revenue data
    if (revenueData) {
      revenueData.protocols.forEach(protocol => {
        const existing = protocolMap.get(protocol.name) || {
          name: protocol.name,
          displayName: protocol.displayName || protocol.name,
          isRaydium: protocol.isRaydium
        };
        protocolMap.set(protocol.name, {
          ...existing,
          revenue24h: protocol.total24h,
        });
      });
    }

    // Add fees data
    if (feesData) {
      feesData.protocols.forEach(protocol => {
        const existing = protocolMap.get(protocol.name) || {
          name: protocol.name,
          displayName: protocol.displayName || protocol.name,
          isRaydium: protocol.isRaydium
        };
        protocolMap.set(protocol.name, {
          ...existing,
          fees24h: protocol.total24h,
        });
      });
    }

    // Add DEX volume data
    if (dexData) {
      dexData.forEach(protocol => {
        const existing = protocolMap.get(protocol.name) || {
          name: protocol.name,
          displayName: protocol.displayName || protocol.name,
          isRaydium: protocol.name.toLowerCase().includes('raydium')
        };
        protocolMap.set(protocol.name, {
          ...existing,
          dexVolume: protocol.total24h,
        });
      });
    }

    return Array.from(protocolMap.values())
      .sort((a, b) => {
        // Sort by total value (TVL + revenue + fees + volumes)
        const aTotal = (a.tvl || 0) + (a.revenue24h || 0) + (a.fees24h || 0) + (a.aggregatorVolume || 0) + (a.dexVolume || 0);
        const bTotal = (b.tvl || 0) + (b.revenue24h || 0) + (b.fees24h || 0) + (b.aggregatorVolume || 0) + (b.dexVolume || 0);
        return bTotal - aTotal;
      })
      .slice(0, 15); // Take top 15 protocols for marquee
  }, [aggregatorData, tvlData, revenueData, feesData, dexData]);

  const handleToggle = (link: string) => {
    setItemStates(prev => ({
      ...prev,
      [link]: !prev[link]
    }));
  };

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    } else {
      return `$${value.toFixed(0)}`;
    }
  };

  return (
    <nav className="w-full bg-black">
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

          {/* Menu Items - Temporarily Commented Out */}
          {/*
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
          */}

          {/* Placeholder for menu items */}
          <div className="text-gray-400 text-sm">
            Live Protocol Data
          </div>
        </div>
      </div>

      {/* Marquee Section */}
      <div className="overflow-hidden">
        <div className="relative">
          <div className="marquee-container">
            <div className="marquee-content">
              {/* First set of protocols */}
              {marqueeProtocols.map((protocol, index) => (
                <div
                  key={`${protocol.name}-${index}`}
                  className={`inline-flex items-center px-4 py-2 mx-1 rounded-lg border transition-all duration-200 ${
                    protocol.isRaydium
                      ? 'bg-gradient-to-r from-[#C200FB]/10 via-[#3772FF]/10 to-[#5AC4BE]/10 border-[#5AC4BE]/50 text-[#F7F3E9]'
                      : 'bg-gray-800/50 border-gray-700 text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${
                        protocol.isRaydium ? 'text-[#F7F3E9]' : 'text-white'
                      }`}>
                        {protocol.displayName}
                      </span>
                      {protocol.isRaydium && (
                        <div className="w-1.5 h-1.5 bg-[#5AC4BE] rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 text-xs">
                      {protocol.tvl && (
                        <span className="text-gray-300">
                          TVL: <span className="text-white font-medium">{formatValue(protocol.tvl)}</span>
                        </span>
                      )}
                      {protocol.revenue24h && (
                        <span className="text-gray-300">
                          Rev: <span className="text-green-400 font-medium">{formatValue(protocol.revenue24h)}</span>
                        </span>
                      )}
                      {protocol.dexVolume && (
                        <span className="text-gray-300">
                          DEX: <span className="text-purple-400 font-medium">{formatValue(protocol.dexVolume)}</span>
                        </span>
                      )}
                      {protocol.aggregatorVolume && (
                        <span className="text-gray-300">
                          Agg: <span className="text-[#5AC4BE] font-medium">{formatValue(protocol.aggregatorVolume)}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {marqueeProtocols.map((protocol, index) => (
                <div
                  key={`${protocol.name}-${index}-duplicate`}
                  className={`inline-flex items-center px-4 py-2 mx-1 rounded-lg border transition-all duration-200 ${
                    protocol.isRaydium
                      ? 'bg-gradient-to-r from-[#C200FB]/10 via-[#3772FF]/10 to-[#5AC4BE]/10 border-[#5AC4BE]/50 text-[#F7F3E9]'
                      : 'bg-gray-800/50 border-gray-700 text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${
                        protocol.isRaydium ? 'text-[#F7F3E9]' : 'text-white'
                      }`}>
                        {protocol.displayName}
                      </span>
                      {protocol.isRaydium && (
                        <div className="w-1.5 h-1.5 bg-[#5AC4BE] rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 text-xs">
                      {protocol.tvl && (
                        <span className="text-gray-300">
                          TVL: <span className="text-white font-medium">{formatValue(protocol.tvl)}</span>
                        </span>
                      )}
                      {protocol.revenue24h && (
                        <span className="text-gray-300">
                          Rev: <span className="text-green-400 font-medium">{formatValue(protocol.revenue24h)}</span>
                        </span>
                      )}
                      {protocol.dexVolume && (
                        <span className="text-gray-300">
                          DEX: <span className="text-purple-400 font-medium">{formatValue(protocol.dexVolume)}</span>
                        </span>
                      )}
                      {protocol.aggregatorVolume && (
                        <span className="text-gray-300">
                          Agg: <span className="text-[#5AC4BE] font-medium">{formatValue(protocol.aggregatorVolume)}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
