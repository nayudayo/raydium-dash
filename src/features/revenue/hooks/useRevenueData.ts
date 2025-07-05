import { useState, useEffect } from 'react';

export interface RevenueProtocol {
  id: string;
  name: string;
  displayName: string;
  category: string;
  logo: string;
  total24h: number;
  total7d: number;
  total30d: number;
  total1y: number;
  totalAllTime: number;
  change_1d: number;
  change_7d: number;
  change_1m: number;
  module: string;
  chains: string[];
  isRaydium: boolean;
}

export interface RevenueData {
  protocols: RevenueProtocol[];
  totalRevenue24h: number;
  totalRevenue7d: number;
  totalRevenue30d: number;
  totalRevenue1y: number;
}

export const useRevenueData = () => {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/revenue.json');
        if (!response.ok) {
          throw new Error('Failed to fetch revenue data');
        }
        
        const rawData: any[] = await response.json();
        
        // Process and sort by 24h revenue
        const protocols: RevenueProtocol[] = rawData
          .filter(protocol => protocol.latestFetchIsOk && protocol.total24h > 0)
          .map(protocol => ({
            id: protocol.id,
            name: protocol.name,
            displayName: protocol.displayName,
            category: protocol.category,
            logo: protocol.logo,
            total24h: protocol.total24h,
            total7d: protocol.total7d,
            total30d: protocol.total30d,
            total1y: protocol.total1y,
            totalAllTime: protocol.totalAllTime,
            change_1d: protocol.change_1d,
            change_7d: protocol.change_7d,
            change_1m: protocol.change_1m,
            module: protocol.module,
            chains: protocol.chains,
            isRaydium: protocol.name.toLowerCase().includes('raydium') || 
                      protocol.parentProtocol === 'parent#raydium' ||
                      protocol.slug?.includes('raydium')
          }))
          .sort((a, b) => b.total24h - a.total24h);
        
        const totalRevenue24h = protocols.reduce((sum, protocol) => sum + protocol.total24h, 0);
        const totalRevenue7d = protocols.reduce((sum, protocol) => sum + protocol.total7d, 0);
        const totalRevenue30d = protocols.reduce((sum, protocol) => sum + protocol.total30d, 0);
        const totalRevenue1y = protocols.reduce((sum, protocol) => sum + protocol.total1y, 0);
        
        setData({
          protocols,
          totalRevenue24h,
          totalRevenue7d,
          totalRevenue30d,
          totalRevenue1y
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
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
      revenue24h: protocol.total24h,
      revenue7d: protocol.total7d,
      revenue30d: protocol.total30d,
      displayName: protocol.name.length > 15 ? protocol.name.substring(0, 15) + '...' : protocol.name,
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