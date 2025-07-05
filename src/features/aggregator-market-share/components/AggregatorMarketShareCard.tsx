'use client';

import React from 'react';
import Link from 'next/link';
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { useAggregatorData } from '../hooks/useAggregatorData';

export const AggregatorMarketShareCard: React.FC = () => {
  const { data, loading, error, getTopProtocols } = useAggregatorData();

  if (loading) {
    return (
      <div className="grid grid-cols-3 grid-rows-2 gap-3 h-full">
        <div className="col-span-3 row-span-2 bg-gradient-to-tl from-[#C200FB]/20 via-[#5AC4BE]/20 to-[#3772FF]/20 border border-[#C200FB]/50 p-6 flex items-center justify-center">
          <div className="text-white">Loading aggregator data...</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="grid grid-cols-3 grid-rows-2 gap-3 h-full">
        <div className="col-span-3 row-span-2 bg-gradient-to-tl from-[#C200FB]/20 via-[#5AC4BE]/20 to-[#3772FF]/20 border border-[#C200FB]/50 p-6 flex items-center justify-center">
          <div className="text-red-400">Error loading aggregator data</div>
        </div>
      </div>
    );
  }

  const topProtocols = getTopProtocols(17);
  
  // Prepare chart data
  const chartData = topProtocols.map((protocol) => ({
    name: protocol.displayName,
    volume: protocol.volume,
    percentage: ((protocol.volume / data.totalVolume) * 100).toFixed(1),
    isRaydium: protocol.isRaydium
  }));

  // Get bar color based on protocol
  const getBarColor = (entry: typeof chartData[0]) => {
    if (entry.isRaydium) {
      return "#F7F3E9"; // Cream color for Raydium
    }
    return "#3772FF"; // Blue for others
  };

  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-3 h-full">
      <Link href="/aggregator-market-share" className="col-span-3 row-span-2 bg-gradient-to-tl from-[#C200FB]/20 via-[#5AC4BE]/20 to-[#3772FF]/20 border border-[#C200FB]/50 p-4 hover:from-[#C200FB]/30 hover:via-[#5AC4BE]/30 hover:to-[#3772FF]/30 transition-all duration-300 cursor-pointer group flex">
        {/* Left side - Mini Bar Chart */}
        <div className="w-50 h-full opacity-80 group-hover:opacity-100 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 5,
                left: 5,
                bottom: 10,
              }}
            >
              <XAxis hide />
              <YAxis hide />
              <Bar
                dataKey="volume"
                radius={[2, 2, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getBarColor(entry)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Right side - Text and Protocol List */}
        <div className="flex-1 flex flex-col justify-between ml-4">
          <div>
            <div className="text-lg text-[#F7F3E9] font-bold tracking-wide group-hover:text-white transition-colors">MARKET SHARE</div>
            <div className="text-xs text-[#C200FB] mt-1 uppercase tracking-wider group-hover:text-[#E74C3C] transition-colors">Aggregator Performance</div>
          </div>
          
          <div className="space-y-1.5">
            {topProtocols.slice(0, 10).map((protocol) => (
              <div key={protocol.name} className="flex items-center justify-between max-w-[140px]">
                <span className={`text-xs font-semibold ${protocol.isRaydium ? 'text-[#F7F3E9]' : 'text-[#F7F3E9]'} group-hover:text-white transition-colors truncate`}>
                  {protocol.displayName}
                </span>
                <span className="text-[#C200FB] text-xs font-bold group-hover:text-[#E74C3C] transition-colors ml-2 shrink-0">
                  {((protocol.volume / data.totalVolume) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}; 