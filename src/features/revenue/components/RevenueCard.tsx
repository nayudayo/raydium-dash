'use client';

import React from 'react';
import Link from 'next/link';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useRevenueData } from '../hooks/useRevenueData';

export const RevenueCard: React.FC = () => {
  const { data, loading, error, getTopProtocols } = useRevenueData();

  if (loading) {
    return (
      <div className="grid grid-cols-4 grid-rows-3 gap-3 h-full">
        <div className="col-span-4 row-span-2 bg-gradient-to-r from-[#3772FF]/20 via-[#C200FB]/20 to-[#5AC4BE]/20 border border-[#3772FF]/50 p-6 flex items-center justify-center">
          <div className="text-white">Loading revenue data...</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="grid grid-cols-4 grid-rows-3 gap-3 h-full">
        <div className="col-span-4 row-span-2 bg-gradient-to-r from-[#3772FF]/20 via-[#C200FB]/20 to-[#5AC4BE]/20 border border-[#3772FF]/50 p-6 flex items-center justify-center">
          <div className="text-red-400">Error loading revenue data</div>
        </div>
      </div>
    );
  }

  const topProtocols = getTopProtocols(10);
  
  // Create trend data for area chart
  const trendData = [
    { period: '24h', value: data.totalRevenue24h },
    { period: '7d', value: data.totalRevenue7d },
    { period: '30d', value: data.totalRevenue30d }
  ];

  // Calculate analytics
  const avgDailyRevenue7d = data.totalRevenue7d / 7;
  const avgDailyRevenue30d = data.totalRevenue30d / 30;
  const growth7dVs24h = ((data.totalRevenue7d / 7) / data.totalRevenue24h - 1) * 100;
  const growth30dVs7d = ((data.totalRevenue30d / 30) / (data.totalRevenue7d / 7) - 1) * 100;
  const topProtocolShare = topProtocols.length > 0 ? (topProtocols[0].total24h / data.totalRevenue24h) * 100 : 0;

  return (
    <div className="grid grid-cols-4 grid-rows-3 gap-3 h-full">
      {/* Main Revenue Analytics */}
      <Link href="/revenue" className="col-span-3 row-span-2 bg-gradient-to-r from-[#3772FF]/20 via-[#C200FB]/20 to-[#5AC4BE]/20 border border-[#3772FF]/50 p-4 hover:from-[#3772FF]/30 hover:via-[#C200FB]/30 hover:to-[#5AC4BE]/30 transition-all duration-300 cursor-pointer group flex">
        
        {/* Left side - Main metrics */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="text-lg text-[#F7F3E9] font-bold tracking-wide group-hover:text-white transition-colors">REVENUE ANALYTICS</div>
            <div className="text-xs text-[#3772FF] mt-1 uppercase tracking-wider group-hover:text-[#5AC4BE] transition-colors">Protocol Revenue Insights</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-2xl text-[#F7F3E9] font-bold group-hover:text-white transition-colors">
              ${(data.totalRevenue24h / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-[#3772FF]/80 group-hover:text-[#5AC4BE]/80 transition-colors">24H TOTAL REVENUE</div>
          </div>
        </div>
        
        {/* Center - Analytics */}
        <div className="flex-1 flex flex-col justify-center space-y-3 px-4">
          <div className="text-center">
            <div className="text-sm text-[#F7F3E9] font-semibold group-hover:text-white transition-colors">
              ${(avgDailyRevenue7d / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-[#3772FF]/70 group-hover:text-[#5AC4BE]/70 transition-colors">AVG DAILY (7D)</div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-[#F7F3E9] font-semibold group-hover:text-white transition-colors">
              {topProtocolShare.toFixed(1)}%
            </div>
            <div className="text-xs text-[#3772FF]/70 group-hover:text-[#5AC4BE]/70 transition-colors">TOP PROTOCOL</div>
          </div>
          
          <div className="text-center">
            <div className={`text-sm font-semibold transition-colors ${growth7dVs24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {growth7dVs24h >= 0 ? '+' : ''}{growth7dVs24h.toFixed(1)}%
            </div>
            <div className="text-xs text-[#3772FF]/70 group-hover:text-[#5AC4BE]/70 transition-colors">7D TREND</div>
          </div>
        </div>
        
        {/* Right side - Mini Area Chart */}
        <div className="w-24 h-full opacity-80 group-hover:opacity-100 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3772FF" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3772FF" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis hide />
              <YAxis hide />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3772FF" 
                fillOpacity={1} 
                fill="url(#revenueGradient)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Link>
      
      {/* Top Protocol Card */}
      <div className="col-start-4 row-span-1 bg-gray-900 border border-gray-700 p-3 hover:bg-gray-800 transition-all duration-300">
        <div className="text-xs text-[#3772FF] font-semibold uppercase tracking-wider">TOP PROTOCOL</div>
        <div className="text-sm text-white font-bold mt-1 truncate">
          {topProtocols[0]?.displayName || 'N/A'}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          ${(topProtocols[0]?.total24h / 1000000).toFixed(1)}M
        </div>
      </div>
      
      {/* Active Protocols Card */}
      <div className="col-start-4 row-start-2 bg-gray-900 border border-gray-700 p-3 hover:bg-gray-800 transition-all duration-300">
        <div className="text-xs text-[#3772FF] font-semibold uppercase tracking-wider">ACTIVE PROTOCOLS</div>
        <div className="text-lg text-white font-bold mt-1">
          {data.protocols.length}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Generating revenue
        </div>
      </div>
      
      {/* 7D Revenue Card */}
      <div className="col-span-2 row-start-3 bg-gray-900 border border-gray-700 p-3 hover:bg-gray-800 transition-all duration-300">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs text-[#3772FF] font-semibold uppercase tracking-wider">7D REVENUE</div>
            <div className="text-lg text-white font-bold mt-1">
              ${(data.totalRevenue7d / 1000000).toFixed(1)}M
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
      
      {/* 30D Revenue Card */}
      <div className="col-span-2 row-start-3 bg-gray-900 border border-gray-700 p-3 hover:bg-gray-800 transition-all duration-300">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs text-[#3772FF] font-semibold uppercase tracking-wider">30D REVENUE</div>
            <div className="text-lg text-white font-bold mt-1">
              ${(data.totalRevenue30d / 1000000).toFixed(1)}M
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">Daily avg</div>
            <div className="text-sm text-white font-semibold">
              ${(avgDailyRevenue30d / 1000000).toFixed(1)}M
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 