"use client"

import * as React from "react"
import Image from "next/image"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useRevenueData } from "../hooks/useRevenueData"

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
    payload: {
      period: string;
      [key: string]: number | string;
    };
  }>;
  label?: string;
}

export const Revenue = () => {
  const { data, loading, error, getTopProtocols } = useRevenueData()
  const [selectedProtocols, setSelectedProtocols] = React.useState<string[]>([])

  // Transform data for stacked area chart
  const stackedAreaData = React.useMemo(() => {
    if (!data) return []
    
    const topProtocols = getTopProtocols(6) // Limit to 6 protocols for readability
    
    return [
      {
        period: '24h',
        ...topProtocols.reduce((acc, protocol) => {
          acc[protocol.name] = protocol.total24h
          return acc
        }, {} as Record<string, number>)
      },
      {
        period: '7d',
        ...topProtocols.reduce((acc, protocol) => {
          acc[protocol.name] = protocol.total7d
          return acc
        }, {} as Record<string, number>)
      },
      {
        period: '30d',
        ...topProtocols.reduce((acc, protocol) => {
          acc[protocol.name] = protocol.total30d
          return acc
        }, {} as Record<string, number>)
      }
    ]
  }, [data, getTopProtocols])

  const topProtocols = React.useMemo(() => data ? getTopProtocols(6) : [], [data, getTopProtocols])

  // Generate colors for each protocol
  const getProtocolColor = (protocolName: string, index: number) => {
    if (protocolName.toLowerCase().includes('raydium')) {
      return "#F7F3E9"
    }
    const colors = ["#3772FF", "#5AC4BE", "#C200FB", "#FF6B6B", "#4ECDC4", "#45B7D1"]
    return colors[index % colors.length]
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      // Sort payload by value in descending order
      const sortedPayload = [...payload].sort((a, b) => b.value - a.value)
      
      return (
        <div className="backdrop-blur-sm rounded-lg p-4 shadow-xl bg-gray-900/95 border border-gray-700">
          <h3 className="font-bold mb-2 text-white">{label} Revenue</h3>
          <div className="space-y-1">
            {sortedPayload.map((entry, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-400 text-sm flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: entry.color }}
                  />
                  {entry.name}:
                </span>
                <span className="text-white font-semibold ml-4">
                  ${(entry.value / 1000000).toFixed(1)}M
                </span>
              </div>
            ))}
            <div className="border-t border-gray-600 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm font-medium">Total:</span>
                <span className="text-[#5AC4BE] font-bold">
                  ${(payload.reduce((sum, entry) => sum + entry.value, 0) / 1000000).toFixed(1)}M
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  // Toggle protocol visibility
  const toggleProtocol = (protocolName: string) => {
    setSelectedProtocols(prev => 
      prev.includes(protocolName) 
        ? prev.filter(p => p !== protocolName)
        : [...prev, protocolName]
    )
  }

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#060010]">
        <div className="text-white text-lg">Loading revenue data...</div>
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
        <div className="text-white text-lg">No revenue data available</div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-[#060010] text-white">
      {/* Header */}
      <div className="text-center py-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
        <h1 className="text-4xl font-bold text-white mb-2">Protocol Revenue</h1>
        <p className="text-gray-400">Solana Ecosystem Revenue Stack</p>
      </div>

      {/* Chart Section */}
      <div className="px-8 mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
        <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 shadow-2xl">
          {/* Chart Header */}
          <div className="flex flex-col items-stretch border-b border-gray-800 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              <h2 className="text-xl font-bold text-white">Stacked Revenue</h2>
              <p className="text-gray-400">Cumulative protocol revenue across time periods</p>
            </div>
            <div className="flex opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              <div className="flex flex-col justify-center gap-1 border-t border-gray-800 px-6 py-4 text-left sm:border-t-0 sm:border-l sm:px-8 sm:py-6">
                <span className="text-gray-400 text-xs font-medium">Total 24h Revenue</span>
                <span className="text-lg leading-none font-bold text-white sm:text-2xl">
                  ${(data.totalRevenue24h / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="flex flex-col justify-center gap-1 border-t border-gray-800 px-6 py-4 text-left sm:border-t-0 sm:border-l sm:px-8 sm:py-6">
                <span className="text-gray-400 text-xs font-medium">Total 7d Revenue</span>
                <span className="text-lg leading-none font-bold text-white sm:text-2xl">
                  ${(data.totalRevenue7d / 1000000).toFixed(1)}M
                </span>
              </div>
            </div>
          </div>

          {/* Chart Container */}
          <div className="p-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            <div className="h-[500px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stackedAreaData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <defs>
                    {topProtocols.map((protocol, index) => (
                      <linearGradient 
                        key={protocol.name} 
                        id={`color${protocol.name.replace(/\s+/g, '')}`} 
                        x1="0" 
                        y1="0" 
                        x2="0" 
                        y2="1"
                      >
                        <stop 
                          offset="5%" 
                          stopColor={getProtocolColor(protocol.name, index)} 
                          stopOpacity={0.8}
                        />
                        <stop 
                          offset="95%" 
                          stopColor={getProtocolColor(protocol.name, index)} 
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="period"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  {topProtocols.map((protocol, index) => (
                    <Area
                      key={protocol.name}
                      type="monotone"
                      dataKey={protocol.name}
                      stackId="1"
                      stroke={getProtocolColor(protocol.name, index)}
                      fill={`url(#color${protocol.name.replace(/\s+/g, '')})`}
                      strokeWidth={protocol.isRaydium ? 3 : 2}
                      hide={selectedProtocols.length > 0 && !selectedProtocols.includes(protocol.name)}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Cards */}
      <div className="px-8 pb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {topProtocols.map((protocol, index) => (
            <div
              key={protocol.id}
              id={`protocol-${protocol.name}`}
              className={`bg-gray-900/50 backdrop-blur-sm rounded-xl border transition-all duration-300 hover:scale-105 cursor-pointer ${
                protocol.isRaydium 
                  ? 'border-[#5AC4BE]/50 hover:border-[#5AC4BE] hover:shadow-lg hover:shadow-[#5AC4BE]/20' 
                  : 'border-gray-700 hover:border-gray-600'
              } ${
                selectedProtocols.includes(protocol.name) ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => toggleProtocol(protocol.name)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: getProtocolColor(protocol.name, index) }}
                    />
                    <h3 className={`font-bold text-lg ${protocol.isRaydium ? 'text-[#F7F3E9]' : 'text-white'}`}>
                      {protocol.displayName}
                    </h3>
                  </div>
                  {protocol.isRaydium && (
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
                    <span className="text-gray-400 text-sm">24h Revenue:</span>
                    <span className="text-white font-semibold">
                      ${(protocol.total24h / 1000000).toFixed(2)}M
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">7d Revenue:</span>
                    <span className="text-white font-semibold">
                      ${(protocol.total7d / 1000000).toFixed(2)}M
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">30d Revenue:</span>
                    <span className="text-white font-semibold">
                      ${(protocol.total30d / 1000000).toFixed(2)}M
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