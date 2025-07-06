'use client';

import React from 'react';
import Link from 'next/link';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useTVL } from '../hooks/useTVL';

// Helper function to format large numbers properly
const formatTVL = (value: number) => {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(2)}B`;
  } else if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
};

export const TVLCard: React.FC = () => {
  const { data, loading, error, getTopProtocols } = useTVL();

  if (loading) {
    return (
      <div className="grid grid-cols-3 grid-rows-3 gap-3 h-full">
        <div className="col-span-3 row-span-2 bg-gradient-to-tr from-[#5AC4BE]/20 via-[#C200FB]/20 to-[#3772FF]/20 border border-[#5AC4BE]/50 p-6 flex items-center justify-center">
          <div className="text-white">Loading TVL data...</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="grid grid-cols-3 grid-rows-3 gap-3 h-full">
        <div className="col-span-3 row-span-2 bg-gradient-to-tr from-[#5AC4BE]/20 via-[#C200FB]/20 to-[#3772FF]/20 border border-[#5AC4BE]/50 p-6 flex items-center justify-center">
          <div className="text-red-400">Error loading TVL data</div>
        </div>
      </div>
    );
  }

  const topProtocols = getTopProtocols(10);
  const solanaPercentage = ((data.solanaTVL / data.totalTVL) * 100).toFixed(1);

  // Prepare chart data
  const chartData = topProtocols.map(protocol => ({
    name: protocol.name.length > 8 ? protocol.name.substring(0, 8) + '...' : protocol.name,
    tvl: protocol.tvl,
    solana: protocol.chainTvls.Solana || 0,
    other: Math.max(0, protocol.tvl - (protocol.chainTvls.Solana || 0))
  }));

  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-3 h-full">
      {/* Main TVL Overview */}
      <Link href="/tvl" className="col-span-3 row-span-2 bg-gradient-to-tr from-[#5AC4BE]/20 via-[#C200FB]/20 to-[#3772FF]/20 border border-[#5AC4BE]/50 p-4 hover:from-[#5AC4BE]/30 hover:via-[#C200FB]/30 hover:to-[#3772FF]/30 transition-all duration-300 cursor-pointer group flex flex-col">
        <div className="flex-shrink-0 mb-3">
          <div className="text-lg text-[#F7F3E9] font-bold tracking-wide group-hover:text-white transition-colors">TVL OVERVIEW</div>
          <div className="text-xs text-[#5AC4BE] mt-1 uppercase tracking-wider group-hover:text-[#4A90E2] transition-colors">
            {formatTVL(data.totalTVL)} Total Value Locked
          </div>
          <div className="text-2xl text-[#F7F3E9] font-bold mt-2 group-hover:text-white transition-colors">
            {solanaPercentage}% Solana
          </div>
        </div>
        
        {/* Mini Bar Chart */}
        <div className="flex-1 min-h-0 opacity-80 group-hover:opacity-100 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={40}
              />
              <YAxis hide />
              <Bar 
                dataKey="tvl" 
                fill="#5AC4BE" 
                radius={[2, 2, 0, 0]}
                opacity={0.8}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Link>
      
      {/* TVL Performance Metrics */}
      <div className="row-start-3 bg-[#1A1A2E] border border-[#5AC4BE]/30 p-3 hover:bg-[#16213E] transition-all duration-300 flex flex-col justify-between">
        <div className="text-xs text-gray-400 uppercase tracking-wider">Total TVL</div>
        <div className="text-lg text-white font-bold mt-1">
          {formatTVL(data.totalTVL)}
        </div>
        <div className="text-xs text-[#5AC4BE] mt-1">All Chains</div>
      </div>
      
      <div className="row-start-3 bg-[#1A1A2E] border border-[#5AC4BE]/30 p-3 hover:bg-[#16213E] transition-all duration-300 flex flex-col justify-between">
        <div className="text-xs text-gray-400 uppercase tracking-wider">Solana TVL</div>
        <div className="text-lg text-white font-bold mt-1">
          {formatTVL(data.solanaTVL)}
        </div>
        <div className="text-xs text-[#5AC4BE] mt-1">Solana Only</div>
      </div>
      
      <div className="row-start-3 bg-[#1A1A2E] border border-[#5AC4BE]/30 p-3 hover:bg-[#16213E] transition-all duration-300 flex flex-col justify-between">
        <div className="text-xs text-gray-400 uppercase tracking-wider">Solana Share</div>
        <div className="text-lg text-white font-bold mt-1">
          {solanaPercentage}%
        </div>
        <div className="text-xs text-[#5AC4BE] mt-1">Dominance</div>
      </div>
    </div>
  );
}; 