// Raw data interface from the API
export interface RawRevenueProtocol {
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
  latestFetchIsOk: boolean;
  parentProtocol?: string;
  slug?: string;
}

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