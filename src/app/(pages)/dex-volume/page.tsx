'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Treemap from '@/features/dex-volume/components/Treemap';
import { useDexData } from '@/features/dex-volume/hooks/useDexData';

export default function DexVolumePage() {
  const [dimensions, setDimensions] = useState({ width: 840, height: 420 }); // 30% smaller
  const { rawData } = useDexData();

  useEffect(() => {
    const updateDimensions = () => {
      const width = (window.innerWidth - 80) * 0.7; // 30% smaller
      const height = (window.innerHeight - 200) * 0.7; // 30% smaller
      
      setDimensions({
        width: Math.max(560, width), // 30% smaller minimums
        height: Math.max(280, height)
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    window.addEventListener('orientationchange', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
    };
  }, []);

  // Get Raydium AMM data
  const raydiumData = rawData.find(protocol => protocol.name === "Raydium AMM");

  return (
    <div className="min-h-screen bg-[#060010] p-6 flex flex-col">
      {/* Go Back Button */}
      <Link 
        href="/home" 
        className="absolute top-6 left-6 z-50 opacity-0 animate-fade-in-up" 
        style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
      >
        <button className="bg-gradient-to-r from-[#C200FB] via-[#3772FF] to-[#5AC4BE] p-[1px] rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105">
          <div className="bg-[#060010] rounded-lg px-4 py-2 text-white font-semibold hover:bg-[#060010]/90 transition-colors">
            ← Go Back
          </div>
        </button>
      </Link>

      {/* Treemap Container */}
      <div className="flex-1 flex items-center justify-center flex-col">
        {/* Title */}
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-white mb-2 font-serif">DEX Volume</h1>
          <p className="text-gray-400 font-serif">Solana Ecosystem Trading Volume Distribution</p>
        </div>

        <div 
          className="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-4 shadow-2xl"
          style={{ 
            width: dimensions.width + 40, 
            height: dimensions.height + 40 
          }}
        >
          <Treemap 
            width={dimensions.width} 
            height={dimensions.height} 
          />
        </div>

        {/* Raydium Performance Cards */}
        {raydiumData && (
          <div className="mt-2 opacity-0 translate-y-4 animate-fade-in-up" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
            <div 
              className="grid grid-cols-4 gap-1"
              style={{ width: dimensions.width + 40 }}
            >
              {/* 24h Volume Card */}
              <div className="bg-gradient-to-r from-[#C200FB] via-[#3772FF] to-[#5AC4BE] p-[1px] rounded-lg opacity-0 translate-y-4 animate-fade-in-up" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
                <div className="bg-[#060010] rounded-lg p-2 text-center">
                  <div className="text-sm font-semibold text-gray-400 mb-1">24h Volume</div>
                  <div className="text-lg font-bold text-white">
                    ${(raydiumData.total24h / 1000000).toFixed(1)}M
                  </div>
                </div>
              </div>

              {/* 24h Change Card */}
              <div className="bg-gradient-to-r from-[#C200FB] via-[#3772FF] to-[#5AC4BE] p-[1px] rounded-lg opacity-0 translate-y-4 animate-fade-in-up" style={{ animationDelay: '1.3s', animationFillMode: 'forwards' }}>
                <div className="bg-[#060010] rounded-lg p-2 text-center">
                  <div className="text-sm font-semibold text-gray-400 mb-1">24h Change</div>
                  <div className={`text-lg font-bold ${raydiumData.change_1d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {raydiumData.change_1d >= 0 ? '+' : ''}{raydiumData.change_1d.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* 7d Change Card */}
              <div className="bg-gradient-to-r from-[#C200FB] via-[#3772FF] to-[#5AC4BE] p-[1px] rounded-lg opacity-0 translate-y-4 animate-fade-in-up" style={{ animationDelay: '1.4s', animationFillMode: 'forwards' }}>
                <div className="bg-[#060010] rounded-lg p-2 text-center">
                  <div className="text-sm font-semibold text-gray-400 mb-1">7d Change</div>
                  <div className={`text-lg font-bold ${raydiumData.change_7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {raydiumData.change_7d >= 0 ? '+' : ''}{raydiumData.change_7d.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* Market Share Card */}
              <div className="bg-gradient-to-r from-[#C200FB] via-[#3772FF] to-[#5AC4BE] p-[1px] rounded-lg opacity-0 translate-y-4 animate-fade-in-up" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
                <div className="bg-[#060010] rounded-lg p-2 text-center">
                  <div className="text-sm font-semibold text-gray-400 mb-1">Market Share</div>
                  <div className="text-lg font-bold text-white">
                    {((raydiumData.total24h / rawData.reduce((sum, p) => sum + p.total24h, 0)) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
