'use client';

import React from 'react';
import { Protocols } from './Protocols';
import { AggregatorMarketShareCard } from '../../features/aggregator-market-share/components/AggregatorMarketShareCard';
import { TVLCard } from '../../features/tvl/components/TVLCard';
import { RevenueCard } from '../../features/revenue/components/RevenueCard';
import { FeesCard } from '../../features/fees/components/FeesCard';
import { DexVolumeCard } from '../../features/dex-volume/components/DexVolumeCard';
import { useDexData } from '../../features/dex-volume/hooks/useDexData';
import { useTVL } from '../../features/tvl/hooks/useTVL';
import { useRevenueData } from '../../features/revenue/hooks/useRevenueData';
import { useFeesData } from '../../features/fees/hooks/useFeesData';
import { useAggregatorData } from '../../features/aggregator-market-share/hooks/useAggregatorData';

const GridLayout: React.FC = () => {
  // Get data from all hooks
  const { totalVolume: dexVolume, /*topProtocols: dexProtocols */ } = useDexData();
  const { data: tvlData } = useTVL();
  const { data: revenueData } = useRevenueData();
  const { data: feesData } = useFeesData();
  const { data: aggregatorData } = useAggregatorData();

  // Calculate overview metrics
  const totalTVL = tvlData?.totalTVL || 0;
  const totalRevenue24h = revenueData?.totalRevenue24h || 0;
  const totalFees24h = feesData?.totalFees24h || 0;
  const totalAggregatorVolume = aggregatorData?.totalVolume || 0;

  // Calculate total ecosystem volume (DEX + Aggregator)
  const totalEcosystemVolume = dexVolume + totalAggregatorVolume;

  // Calculate active protocols count
  /*const activeProtocolsCount = (dexProtocols.length || 0) + 
                              (tvlData?.protocols.length || 0) + 
                              (revenueData?.protocols.length || 0) + 
                              (feesData?.protocols.length || 0) + 
                              (aggregatorData?.protocols.length || 0);
  // Calculate health score based on data availability and positive trends
  const dataSourcesActive = [dexVolume > 0, totalTVL > 0, totalRevenue24h > 0, totalFees24h > 0].filter(Boolean).length;
  const healthScore = dataSourcesActive >= 3 ? 'Excellent' : dataSourcesActive >= 2 ? 'Good' : 'Fair';
*/
  return (
    <div className="w-full min-h-screen bg-black p-8 space-y-3">
      
      {/* Main Layout - Overview left, Treemap center, TVL+Aggregator right */}
      <div className="grid grid-cols-16 gap-3 h-[calc(80vh-4rem)] opacity-0 animate-[fadeIn_0.8s_ease-out_0.2s_forwards]">
        
        {/* Left Column - DEX Analytics Overview */}
        <div className="col-span-2 opacity-0 animate-[fadeIn_0.8s_ease-out_0.4s_forwards]">
          <div className="grid grid-cols-1 grid-rows-5 gap-3 h-full">
            <div className="bg-gradient-to-br from-[#C200FB]/20 via-[#3772FF]/20 to-[#5AC4BE]/20 border border-[#5AC4BE]/50 p-5 hover:from-[#C200FB]/30 hover:via-[#3772FF]/30 hover:to-[#5AC4BE]/30 transition-all duration-300">
              <div className="text-lg text-[#F7F3E9] font-semibold tracking-wide">DEX ANALYTICS</div>
              <div className="text-xs text-[#5AC4BE] mt-1 uppercase tracking-wider">Solana Ecosystem Overview</div>
            </div>
            <div className="bg-gray-900 border border-gray-700 p-4 hover:bg-gray-800 transition-all duration-300">
              <div className="text-sm text-white font-medium">Total Volume</div>
              <div className="text-xs text-gray-400 mt-1">${(totalEcosystemVolume / 1000000).toFixed(1)}M</div>
            </div>
            <div className="bg-gray-900 border border-gray-700 p-4 hover:bg-gray-800 transition-all duration-300">
              <div className="text-sm text-white font-medium">Total TVL</div>
              <div className="text-xs text-gray-400 mt-1">${(totalTVL / 1000000000).toFixed(2)}B</div>
            </div>
            <div className="bg-gray-900 border border-gray-700 p-4 hover:bg-gray-800 transition-all duration-300">
              <div className="text-sm text-white font-medium">Revenue 24h</div>
              <div className="text-xs text-gray-400 mt-1">${(totalRevenue24h / 1000000).toFixed(2)}M</div>
            </div>
            <div className="bg-gray-900 border border-gray-700 p-4 hover:bg-gray-800 transition-all duration-300">
              <div className="text-sm text-white font-medium">Fees 24h</div>
              <div className="text-xs text-gray-400 mt-1">${(totalFees24h / 1000000).toFixed(2)}M</div>
            </div>
          </div>
        </div>

        {/* Center Column - DEX Volume Treemap */}
        <div className="col-span-10 opacity-0 animate-[fadeIn_0.8s_ease-out_0.6s_forwards]">
          <DexVolumeCard />
        </div>

        {/* Right Column - TVL and Aggregator Market Share stacked */}
        <div className="col-span-4 flex flex-col gap-3 opacity-0 animate-[fadeIn_0.8s_ease-out_0.8s_forwards]">
          
          {/* TVL Section (Top) */}
          <div className="flex-1">
            <TVLCard />
          </div>

          {/* Aggregator Market Share Section (Bottom) */}
          <div className="flex-1">
            <AggregatorMarketShareCard />
          </div>
        </div>
      </div>

      {/* Bottom Section - Revenue & Fees */}
      <div className="mt-20 grid grid-cols-2 gap-3 h-[calc(55vh-4rem)] opacity-0 animate-[fadeIn_0.8s_ease-out_1.0s_forwards]">
        
        {/* Revenue Section */}
        <div className="opacity-0 animate-[fadeIn_0.8s_ease-out_1.2s_forwards]">
          <RevenueCard />
        </div>

        {/* Fees Section */}
        <div className="opacity-0 animate-[fadeIn_0.8s_ease-out_1.4s_forwards]">
          <FeesCard />
        </div>
      </div>

      {/* Protocols Section */}
      <div className="opacity-0 animate-[fadeIn_0.8s_ease-out_1.6s_forwards]">
        <Protocols />
      </div>
    </div>
  );
};

export default GridLayout;
