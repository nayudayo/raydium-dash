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
