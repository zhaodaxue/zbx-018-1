import { create } from 'zustand';
import { HoneyBatch, FilterState, NectarSource, NECTAR_SOURCES, StatusFilter } from '../data/types';
import { filterBatches, groupBySource, computeSummary, getAvailableMonths, SummaryStats } from '../stats/stats';
import { GroupStats } from '../data/types';

interface DataState {
  allBatches: HoneyBatch[];
  filter: FilterState;
  hasData: boolean;
  error: string | null;
  filteredBatches: HoneyBatch[];
  focusedBatchId: string | null;
  relatedBatches: HoneyBatch[];
  visibleBatches: HoneyBatch[];
  groupStats: GroupStats[];
  summary: SummaryStats;
  availableMonths: number[];
  isFocusMode: boolean;
  setBatches: (batches: HoneyBatch[]) => void;
  setError: (error: string | null) => void;
  setStartMonth: (month: number | null) => void;
  setEndMonth: (month: number | null) => void;
  toggleSource: (source: NectarSource) => void;
  setStatusFilter: (status: StatusFilter) => void;
  setFocusedBatch: (batchId: string | null) => void;
  clearFocus: () => void;
  clearData: () => void;
}

const initialFilter: FilterState = {
  startMonth: null,
  endMonth: null,
  selectedSources: [],
  statusFilter: 'all',
};

const emptySummary: SummaryStats = {
  totalBatches: 0,
  passCount: 0,
  failCount: 0,
  passRate: 0,
  totalYield: 0,
  avgAcidity: 0,
  avgMoisture: 0,
};

function computeDerived(batches: HoneyBatch[]) {
  return {
    groupStats: groupBySource(batches),
    summary: computeSummary(batches),
  };
}

export const useDataStore = create<DataState>((set, get) => ({
  allBatches: [],
  filter: initialFilter,
  hasData: false,
  error: null,
  filteredBatches: [],
  focusedBatchId: null,
  relatedBatches: [],
  visibleBatches: [],
  groupStats: [],
  summary: emptySummary,
  availableMonths: [],
  isFocusMode: false,

  setBatches: (batches: HoneyBatch[]) => {
    const availableMonths = getAvailableMonths(batches);
    const startMonth = availableMonths.length > 0 ? availableMonths[0] : null;
    const endMonth = availableMonths.length > 0 ? availableMonths[availableMonths.length - 1] : null;
    const newFilter: FilterState = {
      startMonth,
      endMonth,
      selectedSources: [...NECTAR_SOURCES],
      statusFilter: 'all',
    };

    const filteredBatches = filterBatches(batches, newFilter);
    const derived = computeDerived(filteredBatches);

    set({
      allBatches: batches,
      filter: newFilter,
      hasData: batches.length > 0,
      error: null,
      filteredBatches,
      focusedBatchId: null,
      relatedBatches: [],
      visibleBatches: filteredBatches,
      ...derived,
      availableMonths,
      isFocusMode: false,
    });
  },

  setError: (error: string | null) => set({ error }),

  setStartMonth: (month: number | null) => {
    const state = get();
    const newFilter = { ...state.filter, startMonth: month };
    const filtered = filterBatches(state.allBatches, newFilter);
    const derived = computeDerived(filtered);

    let visible = filtered;
    let related = state.relatedBatches;
    let isFocusMode = state.isFocusMode;
    let focusedBatchId = state.focusedBatchId;

    if (state.isFocusMode && state.focusedBatchId) {
      const focused = state.allBatches.find(b => b.batchId === state.focusedBatchId);
      if (focused && filtered.some(b => b.batchId === state.focusedBatchId)) {
        related = filtered.filter(b =>
          b.nectarSource === focused.nectarSource && b.shelfStatus === focused.shelfStatus
        );
        visible = related;
        const relatedDerived = computeDerived(related);
        set({
          filter: newFilter,
          filteredBatches: filtered,
          relatedBatches: related,
          visibleBatches: visible,
          groupStats: relatedDerived.groupStats,
          summary: relatedDerived.summary,
        });
        return;
      } else {
        isFocusMode = false;
        focusedBatchId = null;
        related = [];
      }
    }

    set({
      filter: newFilter,
      filteredBatches: filtered,
      visibleBatches: visible,
      relatedBatches: related,
      focusedBatchId,
      isFocusMode,
      ...derived,
    });
  },

  setEndMonth: (month: number | null) => {
    const state = get();
    const newFilter = { ...state.filter, endMonth: month };
    const filtered = filterBatches(state.allBatches, newFilter);
    const derived = computeDerived(filtered);

    let visible = filtered;
    let related = state.relatedBatches;
    let isFocusMode = state.isFocusMode;
    let focusedBatchId = state.focusedBatchId;

    if (state.isFocusMode && state.focusedBatchId) {
      const focused = state.allBatches.find(b => b.batchId === state.focusedBatchId);
      if (focused && filtered.some(b => b.batchId === state.focusedBatchId)) {
        related = filtered.filter(b =>
          b.nectarSource === focused.nectarSource && b.shelfStatus === focused.shelfStatus
        );
        visible = related;
        const relatedDerived = computeDerived(related);
        set({
          filter: newFilter,
          filteredBatches: filtered,
          relatedBatches: related,
          visibleBatches: visible,
          groupStats: relatedDerived.groupStats,
          summary: relatedDerived.summary,
        });
        return;
      } else {
        isFocusMode = false;
        focusedBatchId = null;
        related = [];
      }
    }

    set({
      filter: newFilter,
      filteredBatches: filtered,
      visibleBatches: visible,
      relatedBatches: related,
      focusedBatchId,
      isFocusMode,
      ...derived,
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
    const derived = computeDerived(filtered);

    let visible = filtered;
    let related = state.relatedBatches;
    let isFocusMode = state.isFocusMode;
    let focusedBatchId = state.focusedBatchId;

    if (state.isFocusMode && state.focusedBatchId) {
      const focused = state.allBatches.find(b => b.batchId === state.focusedBatchId);
      if (focused && filtered.some(b => b.batchId === state.focusedBatchId)) {
        related = filtered.filter(b =>
          b.nectarSource === focused.nectarSource && b.shelfStatus === focused.shelfStatus
        );
        visible = related;
        const relatedDerived = computeDerived(related);
        set({
          filter: newFilter,
          filteredBatches: filtered,
          relatedBatches: related,
          visibleBatches: visible,
          groupStats: relatedDerived.groupStats,
          summary: relatedDerived.summary,
        });
        return;
      } else {
        isFocusMode = false;
        focusedBatchId = null;
        related = [];
      }
    }

    set({
      filter: newFilter,
      filteredBatches: filtered,
      visibleBatches: visible,
      relatedBatches: related,
      focusedBatchId,
      isFocusMode,
      ...derived,
    });
  },

  setStatusFilter: (status: StatusFilter) => {
    const state = get();
    const newFilter = { ...state.filter, statusFilter: status };
    const filtered = filterBatches(state.allBatches, newFilter);
    const derived = computeDerived(filtered);

    let visible = filtered;
    let related = state.relatedBatches;
    let isFocusMode = state.isFocusMode;
    let focusedBatchId = state.focusedBatchId;

    if (state.isFocusMode && state.focusedBatchId) {
      const focused = state.allBatches.find(b => b.batchId === state.focusedBatchId);
      if (focused && filtered.some(b => b.batchId === state.focusedBatchId)) {
        related = filtered.filter(b =>
          b.nectarSource === focused.nectarSource && b.shelfStatus === focused.shelfStatus
        );
        visible = related;
        const relatedDerived = computeDerived(related);
        set({
          filter: newFilter,
          filteredBatches: filtered,
          relatedBatches: related,
          visibleBatches: visible,
          groupStats: relatedDerived.groupStats,
          summary: relatedDerived.summary,
        });
        return;
      } else {
        isFocusMode = false;
        focusedBatchId = null;
        related = [];
      }
    }

    set({
      filter: newFilter,
      filteredBatches: filtered,
      visibleBatches: visible,
      relatedBatches: related,
      focusedBatchId,
      isFocusMode,
      ...derived,
    });
  },

  setFocusedBatch: (batchId: string | null) => {
    const state = get();

    if (batchId === null) {
      const derived = computeDerived(state.filteredBatches);
      set({
        focusedBatchId: null,
        relatedBatches: [],
        visibleBatches: state.filteredBatches,
        isFocusMode: false,
        ...derived,
      });
      return;
    }

    const focused = state.allBatches.find(b => b.batchId === batchId);
    if (!focused) return;

    const related = state.filteredBatches.filter(b =>
      b.nectarSource === focused.nectarSource && b.shelfStatus === focused.shelfStatus
    );

    const derived = computeDerived(related);

    set({
      focusedBatchId: batchId,
      relatedBatches: related,
      visibleBatches: related,
      isFocusMode: true,
      ...derived,
    });
  },

  clearFocus: () => {
    const state = get();
    const derived = computeDerived(state.filteredBatches);
    set({
      focusedBatchId: null,
      relatedBatches: [],
      visibleBatches: state.filteredBatches,
      isFocusMode: false,
      ...derived,
    });
  },

  clearData: () => {
    set({
      allBatches: [],
      filter: initialFilter,
      hasData: false,
      error: null,
      filteredBatches: [],
      focusedBatchId: null,
      relatedBatches: [],
      visibleBatches: [],
      groupStats: [],
      summary: emptySummary,
      availableMonths: [],
      isFocusMode: false,
    });
  },
}));
