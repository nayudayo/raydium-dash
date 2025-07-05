// Raw data interface from the API
export interface RawFeesProtocol {
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

export interface FeesProtocol {
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
  latestFetchIsOk: boolean;
  parentProtocol?: string;
  slug?: string;
}

export interface FeesData {
  protocols: FeesProtocol[];
  totalFees24h: number;
  totalFees7d: number;
  totalFees30d: number;
  totalFees1y: number;
} 