import { HoneyBatch, NectarSource, NECTAR_SOURCES, QuantileStats, GroupStats, FilterState } from '../data/types';

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  if (sorted.length === 1) return sorted[0];
  const idx = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  if (lower === upper) return sorted[lower];
  const weight = idx - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

export function computeQuantileStats(values: number[]): QuantileStats {
  const sorted = [...values].sort((a, b) => a - b);
  const count = sorted.length;

  if (count === 0) {
    return {
      min: 0,
      q1: 0,
      median: 0,
      q3: 0,
      max: 0,
      iqr: 0,
      lowerFence: 0,
      upperFence: 0,
      outliers: [],
      count: 0,
    };
  }

  const q1 = percentile(sorted, 25);
  const median = percentile(sorted, 50);
  const q3 = percentile(sorted, 75);
  const iqr = q3 - q1;

  const lowerFenceRaw = q1 - 1.5 * iqr;
  const upperFenceRaw = q3 + 1.5 * iqr;

  const min = sorted[0];
  const max = sorted[count - 1];
  const lowerFence = Math.max(lowerFenceRaw, min);
  const upperFence = Math.min(upperFenceRaw, max);

  const outliers = sorted.filter(v => v < lowerFenceRaw || v > upperFenceRaw);

  return {
    min,
    q1,
    median,
    q3,
    max,
    iqr,
    lowerFence,
    upperFence,
    outliers,
    count,
  };
}

export function groupBySource(batches: HoneyBatch[]): GroupStats[] {
  return NECTAR_SOURCES.map(source => {
    const sourceBatches = batches.filter(b => b.nectarSource === source);
    const acidityValues = sourceBatches.map(b => b.acidity);
    const moistureValues = sourceBatches.map(b => b.moisture);
    const passCount = sourceBatches.filter(b => b.shelfStatus === '可上架').length;

    return {
      source,
      count: sourceBatches.length,
      acidityStats: computeQuantileStats(acidityValues),
      moistureStats: computeQuantileStats(moistureValues),
      totalYield: sourceBatches.reduce((sum, b) => sum + b.yield, 0),
      passCount,
      failCount: sourceBatches.length - passCount,
    };
  });
}

export function filterBatches(batches: HoneyBatch[], filter: FilterState): HoneyBatch[] {
  return batches.filter(batch => {
    if (filter.startMonth !== null) {
      const batchMonth = batch.harvestDate.getMonth() + 1;
      if (batchMonth < filter.startMonth) return false;
    }
    if (filter.endMonth !== null) {
      const batchMonth = batch.harvestDate.getMonth() + 1;
      if (batchMonth > filter.endMonth) return false;
    }
    if (filter.selectedSources.length === 0) {
      return false;
    }
    if (!filter.selectedSources.includes(batch.nectarSource)) return false;
    return true;
  });
}

export function getAvailableMonths(batches: HoneyBatch[]): number[] {
  const months = new Set<number>();
  for (const batch of batches) {
    months.add(batch.harvestDate.getMonth() + 1);
  }
  return Array.from(months).sort((a, b) => a - b);
}

export interface SummaryStats {
  totalBatches: number;
  passCount: number;
  failCount: number;
  passRate: number;
  totalYield: number;
  avgAcidity: number;
  avgMoisture: number;
}

export function computeSummary(batches: HoneyBatch[]): SummaryStats {
  const totalBatches = batches.length;
  const passCount = batches.filter(b => b.shelfStatus === '可上架').length;
  const totalYield = batches.reduce((sum, b) => sum + b.yield, 0);
  const avgAcidity = totalBatches > 0 ? batches.reduce((sum, b) => sum + b.acidity, 0) / totalBatches : 0;
  const avgMoisture = totalBatches > 0 ? batches.reduce((sum, b) => sum + b.moisture, 0) / totalBatches : 0;

  return {
    totalBatches,
    passCount,
    failCount: totalBatches - passCount,
    passRate: totalBatches > 0 ? passCount / totalBatches : 0,
    totalYield,
    avgAcidity,
    avgMoisture,
  };
}
