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

export interface UseDexDataReturn {
  data: TreemapData | null;
  rawData: DexProtocol[];
  loading: boolean;
  error: string | null;
  totalVolume: number;
  topProtocols: DexProtocol[];
  categories: Record<string, DexProtocol[]>;
}
