import { useState, useEffect } from 'react';
import { RawFeesProtocol, FeesProtocol, FeesData } from '../types';

export const useFeesData = () => {
  const [data, setData] = useState<FeesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeesData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/fees.json');
        if (!response.ok) {
          throw new Error('Failed to fetch fees data');
        }
        
        const rawData = await response.json() as RawFeesProtocol[];
        
        // Process and sort by 24h fees
        const protocols: FeesProtocol[] = rawData
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
                      (protocol.slug?.includes('raydium') ?? false),
            latestFetchIsOk: protocol.latestFetchIsOk
          }))
          .sort((a, b) => b.total24h - a.total24h);
        
        const totalFees24h = protocols.reduce((sum, protocol) => sum + protocol.total24h, 0);
        const totalFees7d = protocols.reduce((sum, protocol) => sum + protocol.total7d, 0);
        const totalFees30d = protocols.reduce((sum, protocol) => sum + protocol.total30d, 0);
        const totalFees1y = protocols.reduce((sum, protocol) => sum + protocol.total1y, 0);
        
        setData({
          protocols,
          totalFees24h,
          totalFees7d,
          totalFees30d,
          totalFees1y
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchFeesData();
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
      fees24h: protocol.total24h,
      fees7d: protocol.total7d,
      fees30d: protocol.total30d,
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