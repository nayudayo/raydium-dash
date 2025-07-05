import { useState, useEffect } from 'react';

export interface TVLProtocol {
  id: string;
  name: string;
  symbol: string;
  category: string;
  tvl: number;
  chainTvls: {
    [key: string]: number;
  };
  mcap: number | null;
  gecko_id: string | null;
  parent?: string;
  deprecated?: boolean;
}

export interface TVLData {
  protocols: TVLProtocol[];
  totalTVL: number;
  solanaTVL: number;
}

export const useTVL = () => {
  const [data, setData] = useState<TVLData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTVLData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/tvl.json');
        if (!response.ok) {
          throw new Error('Failed to fetch TVL data');
        }
        
        const protocols: TVLProtocol[] = await response.json();
        
        // Filter out deprecated protocols and sort by TVL
        const activeProtocols = protocols
          .filter(protocol => !protocol.deprecated)
          .sort((a, b) => b.tvl - a.tvl);
        
        const totalTVL = activeProtocols.reduce((sum, protocol) => sum + protocol.tvl, 0);
        const solanaTVL = activeProtocols.reduce((sum, protocol) => 
          sum + (protocol.chainTvls.Solana || 0), 0
        );
        
        setData({
          protocols: activeProtocols,
          totalTVL,
          solanaTVL
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchTVLData();
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
      tvl: protocol.tvl,
      solanaTvl: protocol.chainTvls.Solana || 0,
      displayName: protocol.name.length > 15 ? protocol.name.substring(0, 15) + '...' : protocol.name
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