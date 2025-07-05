import { useState, useEffect } from 'react';

export interface DexProtocol {
  total24h: number;
  total48hto24h: number;
  total7d: number;
  total14dto7d: number;
  total60dto30d: number;
  total30d: number;
  total1y: number;
  totalAllTime: number;
  average1y: number;
  change_1d: number;
  change_7d: number;
  change_1m: number;
  change_7dover7d: number;
  change_30dover30d: number;
  total7DaysAgo: number;
  total30DaysAgo: number;
  defillamaId: string;
  name: string;
  displayName: string;
  module: string;
  category: string;
  logo: string;
  chains: string[];
  protocolType: string;
  methodologyURL?: string;
  methodology?: Record<string, string>;
  latestFetchIsOk: boolean;
  parentProtocol?: string;
  slug: string;
  linkedProtocols?: string[];
  id: string;
  disabled?: boolean;
}

export interface TreemapData {
  name: string;
  value?: number;
  children?: TreemapData[];
  category?: string;
  logo?: string;
  change_1d?: number;
  change_7d?: number;
  displayName?: string;
}

interface UseDexDataReturn {
  data: TreemapData | null;
  rawData: DexProtocol[];
  loading: boolean;
  error: string | null;
  totalVolume: number;
  topProtocols: DexProtocol[];
  categories: Record<string, DexProtocol[]>;
}

export function useDexData(): UseDexDataReturn {
  const [rawData, setRawData] = useState<DexProtocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/dex-volume.json');
        if (!response.ok) {
          throw new Error('Failed to fetch DEX volume data');
        }
        const data: DexProtocol[] = await response.json();
        
        // Filter out disabled protocols and those with zero volume
        const activeData = data.filter(protocol => 
          !protocol.disabled && 
          protocol.total24h > 0 && 
          protocol.latestFetchIsOk
        );
        
        setRawData(activeData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Transform data for treemap
  const data: TreemapData | null = rawData.length > 0 ? transformToTreemapData(rawData) : null;
  
  // Calculate total volume
  const totalVolume = rawData.reduce((sum, protocol) => sum + protocol.total24h, 0);
  
  // Get top protocols by volume
  const topProtocols = rawData
    .sort((a, b) => b.total24h - a.total24h)
    .slice(0, 10);
  
  // Group by categories
  const categories = rawData.reduce((acc, protocol) => {
    if (!acc[protocol.category]) {
      acc[protocol.category] = [];
    }
    acc[protocol.category].push(protocol);
    return acc;
  }, {} as Record<string, DexProtocol[]>);

  return {
    data,
    rawData,
    loading,
    error,
    totalVolume,
    topProtocols,
    categories
  };
}

function transformToTreemapData(protocols: DexProtocol[]): TreemapData {
  // Sort protocols by volume and take top 15-20 for better visualization
  const sortedProtocols = protocols
    .sort((a, b) => b.total24h - a.total24h)
    .slice(0, 18);
  
  // Create flat structure - no grouping, just individual protocols
  const children: TreemapData[] = sortedProtocols.map(protocol => ({
    name: protocol.displayName,
    value: protocol.total24h,
    category: protocol.category,
    logo: protocol.logo,
    change_1d: protocol.change_1d,
    change_7d: protocol.change_7d,
    displayName: protocol.displayName
  }));

  return {
    name: 'Solana DEX Ecosystem',
    children: children
  };
}
