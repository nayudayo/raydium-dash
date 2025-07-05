'use client';

import React from 'react';
import Link from 'next/link';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useFeesData } from '../hooks/useFeesData';

export const FeesCard: React.FC = () => {
  const { data, loading, error, getTopProtocols } = useFeesData();

  if (loading) {
    return (
      <div className="grid grid-cols-4 grid-rows-3 gap-3 h-full">
        <div className="col-span-4 row-span-2 bg-gradient-to-l from-[#5AC4BE]/20 via-[#3772FF]/20 to-[#C200FB]/20 border border-[#5AC4BE]/50 p-6 flex items-center justify-center">
          <div className="text-white">Loading fees data...</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="grid grid-cols-4 grid-rows-3 gap-3 h-full">
        <div className="col-span-4 row-span-2 bg-gradient-to-l from-[#5AC4BE]/20 via-[#3772FF]/20 to-[#C200FB]/20 border border-[#5AC4BE]/50 p-6 flex items-center justify-center">
          <div className="text-red-400">Error loading fees data</div>
        </div>
      </div>
    );
  }

  const topProtocols = getTopProtocols(10);
  
  // Create trend data for line chart
  const trendData = [
    { period: '24h', value: data.totalFees24h },
    { period: '7d', value: data.totalFees7d },
    { period: '30d', value: data.totalFees30d }
  ];

  // Calculate analytics
  const avgDailyFees7d = data.totalFees7d / 7;
  const avgDailyFees30d = data.totalFees30d / 30;
  const growth7dVs24h = ((data.totalFees7d / 7) / data.totalFees24h - 1) * 100;
  const growth30dVs7d = ((data.totalFees30d / 30) / (data.totalFees7d / 7) - 1) * 100;
  const topProtocolShare = topProtocols.length > 0 ? (topProtocols[0].total24h / data.totalFees24h) * 100 : 0;

  return (
    <div className="grid grid-cols-4 grid-rows-3 gap-3 h-full">
      {/* Main Fee Structure */}
      <Link href="/fees" className="col-span-3 row-span-2 bg-gradient-to-l from-[#5AC4BE]/20 via-[#3772FF]/20 to-[#C200FB]/20 border border-[#5AC4BE]/50 p-4 hover:from-[#5AC4BE]/30 hover:via-[#3772FF]/30 hover:to-[#C200FB]/30 transition-all duration-300 cursor-pointer group flex">
        
        {/* Left side - Main metrics */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="text-lg text-[#F7F3E9] font-bold tracking-wide group-hover:text-white transition-colors">FEE STRUCTURE</div>
            <div className="text-xs text-[#5AC4BE] mt-1 uppercase tracking-wider group-hover:text-[#4A90E2] transition-colors">Protocol Fee Analytics</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-2xl text-[#F7F3E9] font-bold group-hover:text-white transition-colors">
              ${(data.totalFees24h / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-[#5AC4BE]/80 group-hover:text-[#4A90E2]/80 transition-colors">24H TOTAL FEES</div>
          </div>
        </div>
        
        {/* Center - Analytics */}
        <div className="flex-1 flex flex-col justify-center space-y-3 px-4">
          <div className="text-center">
            <div className="text-sm text-[#F7F3E9] font-semibold group-hover:text-white transition-colors">
              ${(avgDailyFees7d / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-[#5AC4BE]/70 group-hover:text-[#4A90E2]/70 transition-colors">AVG DAILY (7D)</div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-[#F7F3E9] font-semibold group-hover:text-white transition-colors">
              {topProtocolShare.toFixed(1)}%
            </div>
            <div className="text-xs text-[#5AC4BE]/70 group-hover:text-[#4A90E2]/70 transition-colors">TOP PROTOCOL</div>
          </div>
          
          <div className="text-center">
            <div className={`text-sm font-semibold transition-colors ${growth7dVs24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {growth7dVs24h >= 0 ? '+' : ''}{growth7dVs24h.toFixed(1)}%
            </div>
            <div className="text-xs text-[#5AC4BE]/70 group-hover:text-[#4A90E2]/70 transition-colors">7D TREND</div>
          </div>
        </div>
        
        {/* Right side - Mini Line Chart */}
        <div className="w-24 h-full opacity-80 group-hover:opacity-100 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <XAxis hide />
              <YAxis hide />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#5AC4BE" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3, stroke: '#5AC4BE', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Link>
      
      {/* Top Protocol Card */}
      <div className="col-start-4 row-span-1 bg-gray-900 border border-gray-700 p-3 hover:bg-gray-800 transition-all duration-300">
        <div className="text-xs text-[#5AC4BE] font-semibold uppercase tracking-wider">TOP PROTOCOL</div>
        <div className="text-sm text-white font-bold mt-1 truncate">
          {topProtocols[0]?.displayName || 'N/A'}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          ${(topProtocols[0]?.total24h / 1000000).toFixed(1)}M
        </div>
      </div>
      
      {/* Active Protocols Card */}
      <div className="col-start-4 row-start-2 bg-gray-900 border border-gray-700 p-3 hover:bg-gray-800 transition-all duration-300">
        <div className="text-xs text-[#5AC4BE] font-semibold uppercase tracking-wider">ACTIVE PROTOCOLS</div>
        <div className="text-lg text-white font-bold mt-1">
          {data.protocols.length}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Generating fees
        </div>
      </div>
      
      {/* 7D Fees Card */}
      <div className="col-span-2 row-start-3 bg-gray-900 border border-gray-700 p-3 hover:bg-gray-800 transition-all duration-300">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs text-[#5AC4BE] font-semibold uppercase tracking-wider">7D FEES</div>
            <div className="text-lg text-white font-bold mt-1">
              ${(data.totalFees7d / 1000000).toFixed(1)}M
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">vs 30D avg</div>
            <div className={`text-sm font-semibold ${growth30dVs7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {growth30dVs7d >= 0 ? '+' : ''}{growth30dVs7d.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
      
      {/* 30D Fees Card */}
      <div className="col-span-2 row-start-3 bg-gray-900 border border-gray-700 p-3 hover:bg-gray-800 transition-all duration-300">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs text-[#5AC4BE] font-semibold uppercase tracking-wider">30D FEES</div>
            <div className="text-lg text-white font-bold mt-1">
              ${(data.totalFees30d / 1000000).toFixed(1)}M
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">Daily avg</div>
            <div className="text-sm text-white font-semibold">
              ${(avgDailyFees30d / 1000000).toFixed(1)}M
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 