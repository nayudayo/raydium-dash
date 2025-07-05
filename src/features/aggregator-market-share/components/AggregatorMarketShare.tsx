"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, LabelList } from "recharts"
import { useAggregatorData } from "../hooks/useAggregatorData"

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      name: string;
      volume: number;
      displayName: string;
      isRaydium: boolean;
    };
  }>;
}

interface ChartData {
  name: string;
  volume: number;
  displayName: string;
  isRaydium: boolean;
}

interface BarClickData {
  name: string;
  volume: number;
  displayName: string;
  isRaydium: boolean;
}

interface LabelProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: {
    name: string;
    volume: number;
    displayName: string;
    isRaydium: boolean;
  };
}

export const AggregatorMarketShare = () => {
  const { data, loading, error, getChartData } = useAggregatorData()
  const [hoveredBar, setHoveredBar] = React.useState<number | null>(null)
  const [selectedProtocol, setSelectedProtocol] = React.useState<string | null>(null)

  // Always call useMemo, even if data is null
  const total = React.useMemo(
    () => ({
      volume: data?.totalVolume || 0,
    }),
    [data]
  )

  const chartData = React.useMemo(
    () => data ? getChartData(20) : [],
    [data, getChartData]
  )

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const value = payload[0].value
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
              <span className="text-gray-400 text-sm">Volume:</span>
              <span className="text-white font-semibold">${(value / 1000000).toFixed(1)}M</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Market Share:</span>
              <span className="text-[#5AC4BE] font-semibold">
                {((value / total.volume) * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  // Handle bar click
  const handleBarClick = (data: BarClickData) => {
    const newSelection = selectedProtocol === data.name ? null : data.name
    setSelectedProtocol(newSelection)
    
    // Scroll to the protocol card if selected
    if (newSelection) {
      setTimeout(() => {
        const element = document.getElementById(`protocol-${data.name}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
    }
  }

  // Get bar color based on state
  const getBarColor = (entry: ChartData, index: number) => {
    // Special styling for Raydium entries
    if (entry.isRaydium) {
      if (selectedProtocol === entry.name) {
        return "#F7F3E9" // Cream color when selected
      }
      if (hoveredBar === index) {
        return "#F5F1E7" // Slightly darker cream on hover
      }
      return "#F7F3E9" // Default cream color for Raydium
    }
    
    // Standard colors for other protocols
    if (selectedProtocol === entry.name) {
      return "#5AC4BE"
    }
    if (hoveredBar === index) {
      return "#4A90E2"
    }
    return "#3772FF"
  }

  // Custom label component for Raydium logo
  const RaydiumLabel = (props: LabelProps) => {
    const { x, y, width, height, payload } = props
    
    // Check if this is a Raydium entry
    if (!payload?.isRaydium) {
      return null
    }
    
    // Ensure we have valid dimensions
    if (!x || !y || !width || !height) {
      return null
    }
    
    const logoSize = Math.min(width * 0.6, height * 0.6, 40)
    const logoX = x + (width - logoSize) / 2
    const logoY = y + (height - logoSize) / 2
    
    return (
      <image
        href="/assets/logo/raydium.svg"
        x={logoX}
        y={logoY}
        width={logoSize}
        height={logoSize}
        opacity={0.8}
        style={{ pointerEvents: 'none' }}
      />
    )
  }

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#060010]">
        <div className="text-white text-lg">Loading aggregator market share data...</div>
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
        <div className="text-white text-lg">No aggregator market share data available</div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-[#060010] text-white">
      {/* Header */}
      <div className="text-center py-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
        <h1 className="text-4xl font-bold text-white mb-2 font-serif">Aggregator Market Share</h1>
        <p className="text-gray-400 font-serif">Solana DEX Aggregator Volume Distribution</p>
      </div>

      {/* Chart Section */}
      <div className="px-8 mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
        <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 shadow-2xl">
          {/* Chart Header */}
          <div className="flex flex-col items-stretch border-b border-gray-800 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              <h2 className="text-xl font-bold text-white">Volume Distribution</h2>
              <p className="text-gray-400">Top aggregators by trading volume</p>
            </div>
            <div className="flex opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t border-gray-800 px-6 py-4 text-left sm:border-t-0 sm:px-8 sm:py-6">
                <span className="text-gray-400 text-xs font-medium">
                  Total Volume
                </span>
                <span className="text-lg leading-none font-bold text-white sm:text-2xl">
                  ${(total.volume / 1000000000).toFixed(2)}B
                </span>
              </div>
            </div>
          </div>

          {/* Chart Container */}
          <div className="p-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  <defs>
                    <linearGradient id="raydiumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#C200FB" />
                      <stop offset="48.97%" stopColor="#3772FF" />
                      <stop offset="100%" stopColor="#5AC4BE" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="displayName"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
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
                  <Bar
                    dataKey="volume"
                    radius={[4, 4, 0, 0]}
                    cursor="pointer"
                    onClick={handleBarClick}
                    onMouseEnter={(data, index) => setHoveredBar(index)}
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getBarColor(entry, index)}
                      />
                    ))}
                    <LabelList content={RaydiumLabel} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Cards Grid */}
      <div className="px-8 pb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
        <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">All Aggregators</h2>
                <p className="text-gray-400">Complete list of DEX aggregators on Solana</p>
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
            {data.protocols.map((protocol, index) => (
              <div
                key={protocol.name}
                id={`protocol-${protocol.name}`}
                className={`
                  p-4 border-gray-800 hover:bg-gray-800/30 transition-all duration-200 cursor-pointer
                  opacity-0 animate-fade-in-up hover:scale-105
                  ${index % 4 !== 3 ? 'border-r' : ''}
                  ${index < data.protocols.length - 4 ? 'border-b' : ''}
                  ${selectedProtocol === protocol.name ? 'bg-gradient-to-r from-[#C200FB]/10 via-[#3772FF]/10 to-[#5AC4BE]/10 border-[#5AC4BE]/50 scale-102' : ''}
                  ${protocol.isRaydium ? 'bg-gradient-to-r from-[#C200FB]/5 via-[#3772FF]/5 to-[#5AC4BE]/5' : ''}
                `}
                style={{ 
                  animationDelay: `${0.7 + (index * 0.05)}s`, 
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
                      {protocol.name}
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
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Volume</span>
                      <span className="text-sm font-medium text-white">
                        ${(protocol.volume / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Market Share</span>
                      <span className="text-sm font-medium text-[#5AC4BE]">
                        {((protocol.volume / data.totalVolume) * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      protocol.isRaydium 
                        ? 'text-[#F7F3E9] bg-[#F7F3E9]/20' 
                        : 'text-gray-500 bg-gray-800/50'
                    }`}>
                      {protocol.isRaydium ? 'Raydium' : 'DEX Aggregator'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 