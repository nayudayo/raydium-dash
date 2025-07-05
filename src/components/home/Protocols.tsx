"use client"

import * as React from "react"
import { useAggregatorData } from "../../features/aggregator-market-share/hooks/useAggregatorData"
import { useTVL } from "../../features/tvl/hooks/useTVL"
import { useRevenueData } from "../../features/revenue/hooks/useRevenueData"
import { useFeesData } from "../../features/fees/hooks/useFeesData"
import { useDexData } from "../../features/dex-volume/hooks/useDexData"

interface ProtocolData {
  name: string;
  category: string;
  aggregatorVolume?: number;
  tvl?: number;
  revenue24h?: number;
  fees24h?: number;
  dexVolume?: number;
  isRaydium: boolean;
  logo?: string;
  displayName: string;
}

export const Protocols = () => {
  const { data: aggregatorData, loading: aggregatorLoading } = useAggregatorData()
  const { data: tvlData, loading: tvlLoading } = useTVL()
  const { data: revenueData, loading: revenueLoading } = useRevenueData()
  const { data: feesData, loading: feesLoading } = useFeesData()
  const { rawData: dexData, loading: dexLoading } = useDexData()

  const [selectedProtocol, setSelectedProtocol] = React.useState<string | null>(null)

  // Function to get random Raydium gradient variations
  const getRandomRaydiumGradient = (index: number) => {
    const gradients = [
      'bg-gradient-to-r from-[#C200FB]/5 via-[#3772FF]/5 to-[#5AC4BE]/5',
      'bg-gradient-to-br from-[#3772FF]/5 via-[#5AC4BE]/5 to-[#C200FB]/5',
      'bg-gradient-to-bl from-[#5AC4BE]/5 via-[#C200FB]/5 to-[#3772FF]/5',
      'bg-gradient-to-tr from-[#C200FB]/5 via-[#5AC4BE]/5 to-[#3772FF]/5',
      'bg-gradient-to-tl from-[#3772FF]/5 via-[#C200FB]/5 to-[#5AC4BE]/5',
      'bg-gradient-to-l from-[#5AC4BE]/5 via-[#3772FF]/5 to-[#C200FB]/5'
    ]
    return gradients[index % gradients.length]
  }

  // Combine all protocol data
  const allProtocols = React.useMemo(() => {
    const protocolMap = new Map<string, ProtocolData>()

    // Add aggregator data
    if (aggregatorData) {
      aggregatorData.protocols.forEach(protocol => {
        protocolMap.set(protocol.name, {
          name: protocol.name,
          displayName: protocol.name,
          category: 'Aggregator',
          aggregatorVolume: protocol.volume,
          isRaydium: protocol.isRaydium
        })
      })
    }

    // Add TVL data
    if (tvlData) {
      tvlData.protocols.forEach(protocol => {
        const existing = protocolMap.get(protocol.name) || {
          name: protocol.name,
          displayName: protocol.name,
          category: protocol.category || 'DeFi',
          isRaydium: protocol.name.toLowerCase().includes('raydium')
        }
        protocolMap.set(protocol.name, {
          ...existing,
          tvl: protocol.tvl,
        })
      })
    }

    // Add revenue data
    if (revenueData) {
      revenueData.protocols.forEach(protocol => {
        const existing = protocolMap.get(protocol.name) || {
          name: protocol.name,
          displayName: protocol.displayName || protocol.name,
          category: protocol.category || 'DeFi',
          isRaydium: protocol.isRaydium
        }
        protocolMap.set(protocol.name, {
          ...existing,
          revenue24h: protocol.total24h,
          logo: protocol.logo || existing.logo
        })
      })
    }

    // Add fees data
    if (feesData) {
      feesData.protocols.forEach(protocol => {
        const existing = protocolMap.get(protocol.name) || {
          name: protocol.name,
          displayName: protocol.displayName || protocol.name,
          category: protocol.category || 'DeFi',
          isRaydium: protocol.isRaydium
        }
        protocolMap.set(protocol.name, {
          ...existing,
          fees24h: protocol.total24h,
          logo: protocol.logo || existing.logo
        })
      })
    }

    // Add DEX volume data
    if (dexData) {
      dexData.forEach(protocol => {
        const existing = protocolMap.get(protocol.name) || {
          name: protocol.name,
          displayName: protocol.displayName || protocol.name,
          category: protocol.category || 'DEX',
          isRaydium: protocol.name.toLowerCase().includes('raydium')
        }
        protocolMap.set(protocol.name, {
          ...existing,
          dexVolume: protocol.total24h,
          logo: protocol.logo || existing.logo
        })
      })
    }

    return Array.from(protocolMap.values())
      .sort((a, b) => {
        // Sort by total value (TVL + revenue + fees + volumes)
        const aTotal = (a.tvl || 0) + (a.revenue24h || 0) + (a.fees24h || 0) + (a.aggregatorVolume || 0) + (a.dexVolume || 0)
        const bTotal = (b.tvl || 0) + (b.revenue24h || 0) + (b.fees24h || 0) + (b.aggregatorVolume || 0) + (b.dexVolume || 0)
        return bTotal - aTotal
      })
  }, [aggregatorData, tvlData, revenueData, feesData, dexData])

  const loading = aggregatorLoading || tvlLoading || revenueLoading || feesLoading || dexLoading

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <div className="text-white text-lg">Loading protocol data...</div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Line Separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-8"></div>
      
      {/* Protocols Section */}
      <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">All Protocols</h2>
              <p className="text-gray-400">Comprehensive overview of Solana DeFi protocols</p>
            </div>
            {selectedProtocol && (
              <button
                onClick={() => setSelectedProtocol(null)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 text-sm opacity-0 animate-fade-in"
                style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
              >
                Clear Selection
              </button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allProtocols.map((protocol, index) => (
            <div
              key={protocol.name}
              id={`protocol-${protocol.name}`}
                             className={`
                 p-4 border-gray-800 hover:bg-gray-800/30 transition-all duration-200 cursor-pointer
                 opacity-0 animate-fade-in-up
                 ${index % 4 !== 3 ? 'border-r' : ''}
                 ${index < allProtocols.length - 4 ? 'border-b' : ''}
                 ${selectedProtocol === protocol.name ? 'bg-gradient-to-r from-[#C200FB]/10 via-[#3772FF]/10 to-[#5AC4BE]/10 border-[#5AC4BE]/50' : ''}
                 ${protocol.isRaydium ? getRandomRaydiumGradient(index) : ''}
               `}
              style={{ 
                animationDelay: `${0.1 + (index * 0.02)}s`, 
                animationFillMode: 'forwards' 
              }}
              onClick={() => setSelectedProtocol(selectedProtocol === protocol.name ? null : protocol.name)}
            >
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className={`font-semibold text-sm truncate transition-colors ${
                    selectedProtocol === protocol.name ? 'text-[#5AC4BE]' : 
                    protocol.isRaydium ? 'text-[#F7F3E9]' : 'text-white'
                  }`}>
                    {protocol.displayName}
                  </h3>
                  <div className="flex items-center gap-2">
                    {selectedProtocol === protocol.name && (
                      <div className="w-2 h-2 bg-[#5AC4BE] rounded-full animate-pulse opacity-0 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}></div>
                    )}
                    {protocol.isRaydium && (
                      <div className="w-2 h-2 bg-[#F7F3E9] rounded-full animate-pulse"></div>
                    )}
                    <span className={`text-xs px-2 py-1 rounded transition-colors ${
                      selectedProtocol === protocol.name 
                        ? 'text-[#5AC4BE] bg-[#5AC4BE]/20' 
                        : protocol.isRaydium
                        ? 'text-[#F7F3E9] bg-[#F7F3E9]/20'
                        : 'text-gray-400 bg-gray-800'
                    }`}>
                      #{index + 1}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  {protocol.tvl && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">TVL</span>
                      <span className="text-sm font-medium text-white">
                        ${protocol.tvl >= 1000000 ? `${(protocol.tvl / 1000000).toFixed(1)}M` : `${(protocol.tvl / 1000).toFixed(1)}K`}
                      </span>
                    </div>
                  )}
                  
                  {protocol.revenue24h && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Revenue 24h</span>
                      <span className="text-sm font-medium text-green-400">
                        ${protocol.revenue24h >= 1000000 ? `${(protocol.revenue24h / 1000000).toFixed(1)}M` : `${(protocol.revenue24h / 1000).toFixed(1)}K`}
                      </span>
                    </div>
                  )}
                  
                  {protocol.fees24h && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Fees 24h</span>
                      <span className="text-sm font-medium text-blue-400">
                        ${protocol.fees24h >= 1000000 ? `${(protocol.fees24h / 1000000).toFixed(1)}M` : `${(protocol.fees24h / 1000).toFixed(1)}K`}
                      </span>
                    </div>
                  )}
                  
                  {protocol.dexVolume && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">DEX Volume</span>
                      <span className="text-sm font-medium text-purple-400">
                        ${protocol.dexVolume >= 1000000 ? `${(protocol.dexVolume / 1000000).toFixed(1)}M` : `${(protocol.dexVolume / 1000).toFixed(1)}K`}
                      </span>
                    </div>
                  )}
                  
                  {protocol.aggregatorVolume && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Aggregator Volume</span>
                      <span className="text-sm font-medium text-[#5AC4BE]">
                        ${protocol.aggregatorVolume >= 1000000 ? `${(protocol.aggregatorVolume / 1000000).toFixed(1)}M` : `${(protocol.aggregatorVolume / 1000).toFixed(1)}K`}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    protocol.isRaydium 
                      ? 'text-[#F7F3E9] bg-[#F7F3E9]/20' 
                      : 'text-gray-500 bg-gray-800/50'
                  }`}>
                    {protocol.category}
                  </span>
                  {protocol.isRaydium && (
                    <span className="text-xs px-2 py-1 rounded text-[#F7F3E9] bg-[#F7F3E9]/20">
                      Raydium
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
