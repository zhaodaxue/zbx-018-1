import { create } from 'zustand';
import { HoneyBatch, FilterState, NectarSource, NECTAR_SOURCES } from '../data/types';
import { filterBatches, groupBySource, computeSummary, getAvailableMonths, SummaryStats } from '../stats/stats';
import { GroupStats } from '../data/types';

interface DataState {
  allBatches: HoneyBatch[];
  filter: FilterState;
  hasData: boolean;
  error: string | null;
  filteredBatches: HoneyBatch[];
  groupStats: GroupStats[];
  summary: SummaryStats;
  availableMonths: number[];
  setBatches: (batches: HoneyBatch[]) => void;
  setError: (error: string | null) => void;
  setStartMonth: (month: number | null) => void;
  setEndMonth: (month: number | null) => void;
  toggleSource: (source: NectarSource) => void;
  clearData: () => void;
}

const initialFilter: FilterState = {
  startMonth: null,
  endMonth: null,
  selectedSources: [],
};

export const useDataStore = create<DataState>((set, get) => ({
  allBatches: [],
  filter: initialFilter,
  hasData: false,
  error: null,
  filteredBatches: [],
  groupStats: [],
  summary: {
    totalBatches: 0,
    passCount: 0,
    failCount: 0,
    passRate: 0,
    totalYield: 0,
    avgAcidity: 0,
    avgMoisture: 0,
  },
  availableMonths: [],

  setBatches: (batches: HoneyBatch[]) => {
    const availableMonths = getAvailableMonths(batches);
    const startMonth = availableMonths.length > 0 ? availableMonths[0] : null;
    const endMonth = availableMonths.length > 0 ? availableMonths[availableMonths.length - 1] : null;
    const newFilter: FilterState = {
      startMonth,
      endMonth,
      selectedSources: [...NECTAR_SOURCES],
    };

    const filteredBatches = filterBatches(batches, newFilter);
    const groupStats = groupBySource(filteredBatches);
    const summary = computeSummary(filteredBatches);

    set({
      allBatches: batches,
      filter: newFilter,
      hasData: batches.length > 0,
      error: null,
      filteredBatches,
      groupStats,
      summary,
      availableMonths,
    });
  },

  setError: (error: string | null) => set({ error }),

  setStartMonth: (month: number | null) => {
    const state = get();
    const newFilter = { ...state.filter, startMonth: month };
    const filtered = filterBatches(state.allBatches, newFilter);
    set({
      filter: newFilter,
      filteredBatches: filtered,
      groupStats: groupBySource(filtered),
      summary: computeSummary(filtered),
    });
  },

  setEndMonth: (month: number | null) => {
    const state = get();
    const newFilter = { ...state.filter, endMonth: month };
    const filtered = filterBatches(state.allBatches, newFilter);
    set({
      filter: newFilter,
      filteredBatches: filtered,
      groupStats: groupBySource(filtered),
      summary: computeSummary(filtered),
    });
  },

  toggleSource: (source: NectarSource) => {
    const state = get();
    const selected = state.filter.selectedSources;
    let newSelected: NectarSource[];

    if (selected.includes(source)) {
      newSelected = selected.filter(s => s !== source);
    } else {
      newSelected = [...selected, source];
    }

    const newFilter = { ...state.filter, selectedSources: newSelected };
    const filtered = filterBatches(state.allBatches, newFilter);
    set({
      filter: newFilter,
      filteredBatches: filtered,
      groupStats: groupBySource(filtered),
      summary: computeSummary(filtered),
    });
  },

  clearData: () => {
    set({
      allBatches: [],
      filter: initialFilter,
      hasData: false,
      error: null,
      filteredBatches: [],
      groupStats: [],
      summary: {
        totalBatches: 0,
        passCount: 0,
        failCount: 0,
        passRate: 0,
        totalYield: 0,
        avgAcidity: 0,
        avgMoisture: 0,
      },
      availableMonths: [],
    });
  },
}));
