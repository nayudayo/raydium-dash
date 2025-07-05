"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts"
import { useRevenueData } from "../hooks/useRevenueData"

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      name: string;
      revenue24h: number;
      revenue7d: number;
      revenue30d: number;
      displayName: string;
      isRaydium: boolean;
    };
  }>;
}

interface ChartData {
  name: string;
  revenue24h: number;
  revenue7d: number;
  revenue30d: number;
  displayName: string;
  isRaydium: boolean;
}

export const Revenue = () => {
  const { data, loading, error, getChartData } = useRevenueData()
  const [activeChart, setActiveChart] = React.useState<"revenue24h" | "revenue7d" | "revenue30d">("revenue24h")
  const [selectedProtocol, setSelectedProtocol] = React.useState<string | null>(null)

  // Always call useMemo, even if data is null
  const total = React.useMemo(
    () => ({
      revenue24h: data?.totalRevenue24h || 0,
      revenue7d: data?.totalRevenue7d || 0,
      revenue30d: data?.totalRevenue30d || 0,
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
              <span className="text-gray-400 text-sm">
                {activeChart === "revenue24h" ? "24h Revenue:" : activeChart === "revenue7d" ? "7d Revenue:" : "30d Revenue:"}
              </span>
              <span className="text-white font-semibold">${(value / 1000000).toFixed(1)}M</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Market Share:</span>
              <span className="text-[#5AC4BE] font-semibold">
                {((value / total[activeChart]) * 100).toFixed(2)}%
              </span>
            </div>
            {data.revenue24h !== data.revenue7d && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">
                  {activeChart === "revenue24h" ? "7d Revenue:" : "24h Revenue:"}
                </span>
                <span className="text-gray-300 font-semibold">
                  ${((activeChart === "revenue24h" ? data.revenue7d : data.revenue24h) / 1000000).toFixed(1)}M
                </span>
              </div>
            )}
          </div>
        </div>
      )
    }
    return null
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
        <p className="text-gray-400">Solana Ecosystem Revenue Distribution</p>
      </div>

      {/* Chart Section */}
      <div className="px-8 mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
        <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 shadow-2xl">
          {/* Chart Header */}
          <div className="flex flex-col items-stretch border-b border-gray-800 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              <h2 className="text-xl font-bold text-white">Revenue Distribution</h2>
              <p className="text-gray-400">Top protocols by revenue generated</p>
            </div>
            <div className="flex opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              {[
                { key: "revenue24h", label: "24h Revenue", value: total.revenue24h },
                { key: "revenue7d", label: "7d Revenue", value: total.revenue7d },
                { key: "revenue30d", label: "30d Revenue", value: total.revenue30d }
              ].map((chart) => (
                <button
                  key={chart.key}
                  data-active={activeChart === chart.key}
                  className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t border-gray-800 px-6 py-4 text-left even:border-l even:border-gray-800 sm:border-t-0 sm:border-l sm:px-8 sm:py-6 hover:bg-gray-800/50 transition-colors"
                  onClick={() => setActiveChart(chart.key as "revenue24h" | "revenue7d" | "revenue30d")}
                >
                  <span className="text-gray-400 text-xs font-medium">
                    {chart.label}
                  </span>
                  <span className="text-lg leading-none font-bold text-white sm:text-2xl">
                    ${(chart.value / 1000000).toFixed(1)}M
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Chart Container */}
          <div className="p-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5AC4BE" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#5AC4BE" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorRaydiumRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F7F3E9" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#F7F3E9" stopOpacity={0.1}/>
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
                  <Area
                    type="monotone"
                    dataKey={activeChart}
                    stroke="#5AC4BE"
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                    fillOpacity={0.6}
                  />
                </AreaChart>
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
                <h2 className="text-xl font-bold text-white">All Protocols</h2>
                <p className="text-gray-400">Complete list of protocols by revenue generated</p>
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
                key={protocol.id}
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
                      <span className="text-xs text-gray-400">24h Revenue</span>
                      <span className="text-sm font-medium text-white">
                        ${(protocol.total24h / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">7d Revenue</span>
                      <span className="text-sm font-medium text-[#5AC4BE]">
                        ${(protocol.total7d / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">30d Revenue</span>
                      <span className="text-sm font-medium text-gray-300">
                        ${(protocol.total30d / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">24h Change</span>
                      <span className={`text-sm font-medium ${
                        protocol.change_1d >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {protocol.change_1d >= 0 ? '+' : ''}{protocol.change_1d.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      protocol.isRaydium 
                        ? 'text-[#F7F3E9] bg-[#F7F3E9]/20' 
                        : 'text-gray-500 bg-gray-800/50'
                    }`}>
                      {protocol.category}
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