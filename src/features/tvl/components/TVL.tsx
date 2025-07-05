"use client"

import * as React from "react"
import Image from "next/image"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useTVL } from "../hooks/useTVL"

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
    payload: {
      name: string;
      solanaTvl: number;
      otherChainsTvl: number;
      totalTvl: number;
      displayName: string;
      isRaydium: boolean;
    };
  }>;
}

export const TVL = () => {
  const { data, loading, error, getTopProtocols } = useTVL()
  const [selectedProtocols, setSelectedProtocols] = React.useState<string[]>([])

  // Transform data for stacked bar chart - sort by highest TVL
  const stackedBarData = React.useMemo(() => {
    if (!data) return []
    
    const allProtocols = getTopProtocols(50) // Get more protocols to filter from
    
    // Take top 15 protocols by TVL (already sorted in the hook)
    const selectedProtocols = allProtocols.slice(0, 15)
    
    const result = selectedProtocols.map(protocol => {
      const solanaTvl = protocol.chainTvls.Solana || 0
      const otherChainsTvl = Math.max(0, protocol.tvl - solanaTvl) // Ensure non-negative
      
      return {
        name: protocol.name,
        displayName: protocol.name.length > 12 ? protocol.name.substring(0, 12) + '...' : protocol.name,
        solanaTvl: solanaTvl,
        otherChainsTvl: otherChainsTvl,
        totalTvl: protocol.tvl,
        isRaydium: protocol.name.toLowerCase().includes('raydium'),
        // Debug info
        hasMultiChain: otherChainsTvl > 1000000
      }
    })
    
    console.log('Stacked bar data:', result) // Debug log
    return result
  }, [data, getTopProtocols])
  
  const topProtocols = React.useMemo(() => data ? getTopProtocols(15) : [], [data, getTopProtocols])

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const isRaydium = data.isRaydium
      
      return (
        <div className={`backdrop-blur-sm rounded-lg p-4 shadow-xl ${
          isRaydium 
            ? 'bg-gradient-to-r from-[#C200FB]/20 via-[#3772FF]/20 to-[#5AC4BE]/20 border-2 border-[#5AC4BE]/50' 
            : 'bg-gray-900/95 border border-gray-700'
        }`}>
          <h3 className={`font-bold mb-2 ${isRaydium ? 'text-[#F7F3E9]' : 'text-white'}`}>
            {data.name}
          </h3>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Total TVL:</span>
              <span className="text-white font-semibold">${(data.totalTvl / 1000000).toFixed(1)}M</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 bg-[#5AC4BE]" />
                Solana TVL:
              </span>
              <span className="text-[#5AC4BE] font-semibold">
                ${(data.solanaTvl / 1000000).toFixed(1)}M
              </span>
            </div>
            {data.otherChainsTvl > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2 bg-[#3772FF]" />
                  Other Chains:
                </span>
                <span className="text-[#3772FF] font-semibold">
                  ${(data.otherChainsTvl / 1000000).toFixed(1)}M
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Solana %:</span>
              <span className="text-gray-300 font-semibold">
                {data.totalTvl > 0 ? ((data.solanaTvl / data.totalTvl) * 100).toFixed(1) : '0.0'}%
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  // Handle bar click
  const handleBarClick = (data: { name?: string }) => {
    const protocolName = data.name
    if (!protocolName) return
    setSelectedProtocols(prev => 
      prev.includes(protocolName) 
        ? prev.filter(p => p !== protocolName)
        : [...prev, protocolName]
    )
  }



  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#060010]">
        <div className="text-white text-lg">Loading TVL data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#060010]">
        <div className="text-red-400 text-lg">Error: {error}</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#060010]">
        <div className="text-white text-lg">No TVL data available</div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-[#060010] text-white">
      {/* Header */}
      <div className="text-center py-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
        <h1 className="text-4xl font-bold text-white mb-2">Total Value Locked</h1>
        <p className="text-gray-400">Solana vs Multi-Chain TVL Distribution</p>
      </div>

      {/* Chart Section */}
      <div className="px-8 mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
        <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 shadow-2xl">
          {/* Chart Header */}
          <div className="flex flex-col items-stretch border-b border-gray-800 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              <h2 className="text-xl font-bold text-white">Stacked TVL Distribution</h2>
              <p className="text-gray-400">Solana TVL vs Other Chains by protocol</p>
            </div>
            <div className="flex opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              <div className="flex flex-col justify-center gap-1 border-t border-gray-800 px-6 py-4 text-left sm:border-t-0 sm:border-l sm:px-8 sm:py-6">
                <span className="text-gray-400 text-xs font-medium">Total TVL</span>
                <span className="text-lg leading-none font-bold text-white sm:text-2xl">
                  ${(data.totalTVL / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="flex flex-col justify-center gap-1 border-t border-gray-800 px-6 py-4 text-left sm:border-t-0 sm:border-l sm:px-8 sm:py-6">
                <span className="text-gray-400 text-xs font-medium">Solana TVL</span>
                <span className="text-lg leading-none font-bold text-white sm:text-2xl">
                  ${(data.solanaTVL / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="flex flex-col justify-center gap-1 border-t border-gray-800 px-6 py-4 text-left sm:border-t-0 sm:border-l sm:px-8 sm:py-6">
                <span className="text-gray-400 text-xs font-medium">Solana %</span>
                <span className="text-lg leading-none font-bold text-white sm:text-2xl">
                  {((data.solanaTVL / data.totalTVL) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Chart Container */}
          <div className="p-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            <div className="h-[500px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stackedBarData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="displayName"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="solanaTvl"
                    stackId="tvl"
                    name="Solana TVL"
                    fill="#5AC4BE"
                    radius={[0, 0, 0, 0]}
                    cursor="pointer"
                    onClick={handleBarClick}
                  />
                  <Bar
                    dataKey="otherChainsTvl"
                    stackId="tvl"
                    name="Other Chains TVL"
                    fill="#3772FF"
                    radius={[4, 4, 0, 0]}
                    cursor="pointer"
                    onClick={handleBarClick}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Section - Remove this after testing */}
      <div className="px-8 mb-4">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-white font-bold mb-2">Debug Info:</h3>
          <div className="text-gray-300 text-sm">
            <p>Protocols with multi-chain TVL: {stackedBarData.filter(p => p.hasMultiChain).length}</p>
            <p>Sample data: {JSON.stringify(stackedBarData.slice(0, 2), null, 2)}</p>
          </div>
        </div>
      </div>

      {/* Protocol Cards */}
      <div className="px-8 pb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {topProtocols.map((protocol) => (
            <div
              key={protocol.id}
              id={`protocol-${protocol.name}`}
              className={`bg-gray-900/50 backdrop-blur-sm rounded-xl border transition-all duration-300 hover:scale-105 cursor-pointer ${
                protocol.name.toLowerCase().includes('raydium')
                  ? 'border-[#5AC4BE]/50 hover:border-[#5AC4BE] hover:shadow-lg hover:shadow-[#5AC4BE]/20' 
                  : 'border-gray-700 hover:border-gray-600'
              } ${
                selectedProtocols.includes(protocol.name) ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleBarClick({ name: protocol.name })}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 rounded-full bg-[#5AC4BE]" />
                      {protocol.tvl > (protocol.chainTvls.Solana || 0) && (
                        <div className="w-3 h-3 rounded-full bg-[#3772FF]" />
                      )}
                    </div>
                    <h3 className={`font-bold text-lg ${
                      protocol.name.toLowerCase().includes('raydium') ? 'text-[#F7F3E9]' : 'text-white'
                    }`}>
                      {protocol.name}
                    </h3>
                  </div>
                  {protocol.name.toLowerCase().includes('raydium') && (
                    <Image 
                      src="/assets/logo/raydium.svg" 
                      alt="Raydium" 
                      width={32}
                      height={32}
                      className="opacity-80"
                    />
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Total TVL:</span>
                    <span className="text-white font-semibold">
                      ${(protocol.tvl / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Solana TVL:</span>
                    <span className="text-[#5AC4BE] font-semibold">
                      ${((protocol.chainTvls.Solana || 0) / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  {protocol.tvl > (protocol.chainTvls.Solana || 0) && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Other Chains:</span>
                      <span className="text-[#3772FF] font-semibold">
                        ${((protocol.tvl - (protocol.chainTvls.Solana || 0)) / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Solana %:</span>
                    <span className="text-gray-300 font-semibold">
                      {(((protocol.chainTvls.Solana || 0) / protocol.tvl) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Category:</span>
                    <span className="text-[#5AC4BE] text-sm font-medium">
                      {protocol.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 