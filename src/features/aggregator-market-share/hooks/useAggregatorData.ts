import { useState, useEffect } from 'react';

export interface AggregatorProtocol {
  name: string;
  volume: number;
  displayName: string;
  isRaydium: boolean;
}

export interface AggregatorData {
  protocols: AggregatorProtocol[];
  totalVolume: number;
}

export const useAggregatorData = () => {
  const [data, setData] = useState<AggregatorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAggregatorData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/aggregator-market-share.json');
        if (!response.ok) {
          throw new Error('Failed to fetch aggregator market share data');
        }
        
        const rawData: Record<string, number> = await response.json();
        
        // Convert to array and sort by volume
        const protocols: AggregatorProtocol[] = Object.entries(rawData)
          .map(([name, volume]) => ({
            name,
            volume,
            displayName: name.length > 15 ? name.substring(0, 15) + '...' : name,
            isRaydium: name.toLowerCase().includes('raydium')
          }))
          .sort((a, b) => b.volume - a.volume);
        
        const totalVolume = protocols.reduce((sum, protocol) => sum + protocol.volume, 0);
        
        setData({
          protocols,
          totalVolume
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchAggregatorData();
  }, []);

  // Get top protocols for chart
  const getTopProtocols = (limit: number = 10) => {
    if (!data) return [];
    return data.protocols.slice(0, limit);
  };

  // Get chart data formatted for Recharts
  const getChartData = (limit: number = 10) => {
    if (!data) return [];
    return data.protocols.slice(0, limit).map(protocol => ({
      name: protocol.name,
      volume: protocol.volume,
      displayName: protocol.displayName,
      isRaydium: protocol.isRaydium
    }));
  };

  return {
    data,
    loading,
    error,
    getTopProtocols,
    getChartData
  };
}; 