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