export type NectarSource = '槐' | '枣' | '杂花';

export type ShelfStatus = '可上架' | '待复检';

export type StatusFilter = 'all' | ShelfStatus;

export interface HoneyBatch {
  batchId: string;
  harvestDate: Date;
  nectarSource: NectarSource;
  acidity: number;
  moisture: number;
  yield: number;
  shelfStatus: ShelfStatus;
  rejectReason: string;
}

export interface OutlierItem {
  value: number;
  batchId: string;
}

export interface QuantileStats {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  iqr: number;
  lowerFence: number;
  upperFence: number;
  outliers: number[];
  outlierItems: OutlierItem[];
  count: number;
}

export interface GroupStats {
  source: NectarSource;
  count: number;
  acidityStats: QuantileStats;
  moistureStats: QuantileStats;
  totalYield: number;
  passCount: number;
  failCount: number;
}

export interface FilterState {
  startMonth: number | null;
  endMonth: number | null;
  selectedSources: NectarSource[];
  statusFilter: StatusFilter;
}

export const NECTAR_SOURCES: NectarSource[] = ['槐', '枣', '杂花'];

export const SOURCE_COLORS: Record<NectarSource, string> = {
  '槐': '#F0EAD0',
  '枣': '#8B4513',
  '杂花': '#E8B830',
};

export const SHELF_THRESHOLDS = {
  maxAcidity: 40,
  maxMoisture: 20,
};
