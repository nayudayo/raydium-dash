'use client';

import React from 'react';
import Link from 'next/link';
import { useDexData } from '../hooks/useDexData';
import Treemap from './Treemap';

// Helper function to format large numbers properly
const formatVolume = (value: number) => {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(2)}B`;
  } else if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
};

export const DexVolumeCard: React.FC = () => {
  const { data, loading, error, totalVolume, topProtocols } = useDexData();

  if (loading) {
    return (
      <div className="grid grid-cols-4 grid-rows-5 gap-3 h-full">
        <div className="col-span-4 row-span-4 bg-[#060010] border border-[#3772FF]/50 p-8 flex items-center justify-center">
          <div className="text-white">Loading DEX volume data...</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="grid grid-cols-4 grid-rows-5 gap-3 h-full">
        <div className="col-span-4 row-span-4 bg-[#060010] border border-[#3772FF]/50 p-8 flex items-center justify-center">
          <div className="text-red-400">Error loading DEX data</div>
        </div>
      </div>
    );
  }

  // Calculate performance metrics
  const topProtocol = topProtocols[0];
  const marketConcentration = topProtocol ? ((topProtocol.total24h / totalVolume) * 100).toFixed(1) : '0';
  
  const protocolsWithChange = topProtocols.filter(p => p.change_1d !== undefined);
  const avgChange = protocolsWithChange.length > 0 
    ? (protocolsWithChange.reduce((sum, p) => sum + (p.change_1d || 0), 0) / protocolsWithChange.length).toFixed(1)
    : '0';
  
  const activeProtocols = topProtocols.length;
  
  const top3Volume = topProtocols.slice(0, 3).reduce((sum, p) => sum + p.total24h, 0);
  const top3Share = ((top3Volume / totalVolume) * 100).toFixed(1);

  return (
    <div className="grid grid-cols-4 grid-rows-5 gap-3 h-full">
      {/* Main Treemap Area */}
      <Link href="/dex-volume" className="col-span-4 row-span-4 bg-[#060010] border border-[#3772FF]/50 hover:border-[#5AC4BE]/50 transition-all duration-300 relative overflow-hidden cursor-pointer group">
        <div className="absolute inset-0 p-6 flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0 mb-4">
            <div className="text-2xl text-white font-bold tracking-wide mb-2 group-hover:text-[#F7F3E9] transition-colors">
              DEX VOLUME TREEMAP
            </div>
            <div className="text-sm text-[#3772FF] uppercase tracking-wider group-hover:text-[#5AC4BE] transition-colors">
              Interactive Volume Visualization
            </div>
            <div className="text-3xl text-white font-bold mt-2 group-hover:text-[#F7F3E9] transition-colors">
              {formatVolume(totalVolume)}
            </div>
            <div className="text-xs text-[#3772FF] uppercase tracking-wider group-hover:text-[#5AC4BE] transition-colors">
              24h Volume
            </div>
          </div>
          
          {/* Treemap Chart - Full container fit */}
          <div className="flex-1 min-h-0 w-full opacity-80 group-hover:opacity-100 transition-opacity">
            <div className="w-full h-full">
              <Treemap width={800} height={300} />
            </div>
          </div>
        </div>
      </Link>
      
      {/* Bottom Performance Metrics Row */}
      <div className="col-span-4 row-start-5 bg-[#1A1A2E] border border-[#3772FF]/30 p-5 hover:bg-[#16213E] transition-all duration-300">
        <div className="text-sm text-white font-semibold mb-3 uppercase tracking-wider">Market Performance</div>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center border-r border-[#3772FF]/30 px-2 flex flex-col justify-between">
            <div className="text-xs text-gray-400 uppercase tracking-wider">Market Leader</div>
            <div className="text-lg text-white font-bold mt-1">{marketConcentration}%</div>
            <div className="text-xs text-[#3772FF] mt-1">Dominance</div>
          </div>
          <div className="text-center border-r border-[#3772FF]/30 px-2 flex flex-col justify-between">
            <div className="text-xs text-gray-400 uppercase tracking-wider">Avg Change</div>
            <div className={`text-lg font-bold mt-1 ${
              parseFloat(avgChange) >= 0 ? 'text-[#4ECDC4]' : 'text-[#FF6B6B]'
            }`}>
              {parseFloat(avgChange) >= 0 ? '+' : ''}{avgChange}%
            </div>
            <div className="text-xs text-[#3772FF] mt-1">24h Trend</div>
          </div>
          <div className="text-center border-r border-[#3772FF]/30 px-2 flex flex-col justify-between">
            <div className="text-xs text-gray-400 uppercase tracking-wider">Active DEXs</div>
            <div className="text-lg text-white font-bold mt-1">{activeProtocols}</div>
            <div className="text-xs text-[#3772FF] mt-1">Protocols</div>
          </div>
          <div className="text-center px-2 flex flex-col justify-between">
            <div className="text-xs text-gray-400 uppercase tracking-wider">Top 3 Share</div>
            <div className="text-lg text-white font-bold mt-1">{top3Share}%</div>
            <div className="text-xs text-[#3772FF] mt-1">Concentration</div>
          </div>
        </div>
      </div>
    </div>
  );
}; 