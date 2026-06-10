import { HoneyBatch, NectarSource, ShelfStatus } from '../data/types';
import { determineShelfStatus } from '../stats/status';

interface RawBatch {
  batchId: string;
  dateStr: string;
  source: NectarSource;
  acidity: number;
  moisture: number;
  yield: number;
}

const RAW_DATA: RawBatch[] = [
  { batchId: 'HX-2024-001', dateStr: '2024-05-12', source: '槐', acidity: 28.5, moisture: 17.2, yield: 125.5 },
  { batchId: 'HX-2024-002', dateStr: '2024-05-15', source: '槐', acidity: 31.2, moisture: 18.6, yield: 98.3 },
  { batchId: 'HX-2024-003', dateStr: '2024-05-18', source: '槐', acidity: 35.8, moisture: 19.1, yield: 156.0 },
  { batchId: 'HX-2024-004', dateStr: '2024-05-20', source: '槐', acidity: 26.4, moisture: 16.8, yield: 142.7 },
  { batchId: 'HX-2024-005', dateStr: '2024-05-22', source: '槐', acidity: 33.1, moisture: 18.3, yield: 110.2 },
  { batchId: 'HX-2024-006', dateStr: '2024-05-25', source: '槐', acidity: 42.3, moisture: 21.5, yield: 88.6 },
  { batchId: 'HX-2024-007', dateStr: '2024-05-28', source: '槐', acidity: 38.7, moisture: 19.8, yield: 133.4 },
  { batchId: 'HX-2024-008', dateStr: '2024-05-30', source: '槐', acidity: 29.6, moisture: 17.5, yield: 105.8 },
  { batchId: 'HX-2024-009', dateStr: '2024-06-02', source: '槐', acidity: 27.8, moisture: 16.9, yield: 118.0 },
  { batchId: 'HX-2024-010', dateStr: '2024-06-05', source: '槐', acidity: 36.2, moisture: 20.1, yield: 141.5 },
  { batchId: 'HX-2024-011', dateStr: '2024-06-08', source: '槐', acidity: 25.3, moisture: 15.8, yield: 95.6 },
  { batchId: 'HX-2024-012', dateStr: '2024-06-10', source: '槐', acidity: 30.5, moisture: 18.2, yield: 129.3 },
  { batchId: 'HX-2024-013', dateStr: '2024-06-15', source: '槐', acidity: 45.1, moisture: 22.3, yield: 76.8 },
  { batchId: 'HX-2024-014', dateStr: '2024-06-18', source: '槐', acidity: 32.4, moisture: 19.0, yield: 112.7 },
  { batchId: 'HX-2024-015', dateStr: '2024-06-20', source: '槐', acidity: 34.7, moisture: 18.7, yield: 135.2 },
  { batchId: 'HX-2024-016', dateStr: '2024-07-05', source: '枣', acidity: 22.1, moisture: 14.5, yield: 210.5 },
  { batchId: 'HX-2024-017', dateStr: '2024-07-08', source: '枣', acidity: 25.6, moisture: 15.8, yield: 185.3 },
  { batchId: 'HX-2024-018', dateStr: '2024-07-10', source: '枣', acidity: 28.3, moisture: 16.9, yield: 230.0 },
  { batchId: 'HX-2024-019', dateStr: '2024-07-12', source: '枣', acidity: 31.5, moisture: 18.2, yield: 195.6 },
  { batchId: 'HX-2024-020', dateStr: '2024-07-15', source: '枣', acidity: 27.4, moisture: 16.3, yield: 225.8 },
  { batchId: 'HX-2024-021', dateStr: '2024-07-18', source: '枣', acidity: 35.2, moisture: 20.5, yield: 168.4 },
  { batchId: 'HX-2024-022', dateStr: '2024-07-20', source: '枣', acidity: 24.8, moisture: 15.2, yield: 240.0 },
  { batchId: 'HX-2024-023', dateStr: '2024-07-22', source: '枣', acidity: 29.7, moisture: 17.6, yield: 205.2 },
  { batchId: 'HX-2024-024', dateStr: '2024-07-25', source: '枣', acidity: 33.6, moisture: 19.5, yield: 175.5 },
  { batchId: 'HX-2024-025', dateStr: '2024-07-28', source: '枣', acidity: 26.9, moisture: 16.0, yield: 218.7 },
  { batchId: 'HX-2024-026', dateStr: '2024-08-02', source: '枣', acidity: 41.8, moisture: 23.1, yield: 145.0 },
  { batchId: 'HX-2024-027', dateStr: '2024-08-05', source: '枣', acidity: 30.2, moisture: 17.8, yield: 198.3 },
  { batchId: 'HX-2024-028', dateStr: '2024-08-08', source: '枣', acidity: 28.5, moisture: 16.7, yield: 220.6 },
  { batchId: 'HX-2024-029', dateStr: '2024-08-10', source: '枣', acidity: 34.1, moisture: 19.2, yield: 180.4 },
  { batchId: 'HX-2024-030', dateStr: '2024-08-15', source: '枣', acidity: 23.7, moisture: 14.8, yield: 255.0 },
  { batchId: 'HX-2024-031', dateStr: '2024-04-20', source: '杂花', acidity: 38.5, moisture: 21.2, yield: 65.8 },
  { batchId: 'HX-2024-032', dateStr: '2024-04-25', source: '杂花', acidity: 42.3, moisture: 23.5, yield: 52.4 },
  { batchId: 'HX-2024-033', dateStr: '2024-05-02', source: '杂花', acidity: 35.6, moisture: 19.8, yield: 78.5 },
  { batchId: 'HX-2024-034', dateStr: '2024-05-08', source: '杂花', acidity: 31.2, moisture: 18.5, yield: 92.3 },
  { batchId: 'HX-2024-035', dateStr: '2024-05-15', source: '杂花', acidity: 37.8, moisture: 20.1, yield: 72.6 },
  { batchId: 'HX-2024-036', dateStr: '2024-06-10', source: '杂花', acidity: 45.5, moisture: 24.8, yield: 45.0 },
  { batchId: 'HX-2024-037', dateStr: '2024-06-18', source: '杂花', acidity: 33.4, moisture: 18.9, yield: 85.7 },
  { batchId: 'HX-2024-038', dateStr: '2024-06-25', source: '杂花', acidity: 39.1, moisture: 21.5, yield: 68.2 },
  { batchId: 'HX-2024-039', dateStr: '2024-07-05', source: '杂花', acidity: 36.7, moisture: 20.0, yield: 75.5 },
  { batchId: 'HX-2024-040', dateStr: '2024-07-12', source: '杂花', acidity: 41.0, moisture: 22.7, yield: 58.3 },
  { batchId: 'HX-2024-041', dateStr: '2024-07-20', source: '杂花', acidity: 34.2, moisture: 19.2, yield: 88.9 },
  { batchId: 'HX-2024-042', dateStr: '2024-08-05', source: '杂花', acidity: 38.9, moisture: 21.0, yield: 70.4 },
  { batchId: 'HX-2024-043', dateStr: '2024-08-15', source: '杂花', acidity: 47.2, moisture: 25.6, yield: 38.5 },
  { batchId: 'HX-2024-044', dateStr: '2024-08-20', source: '杂花', acidity: 32.5, moisture: 18.3, yield: 95.1 },
  { batchId: 'HX-2024-045', dateStr: '2024-09-05', source: '杂花', acidity: 36.8, moisture: 20.3, yield: 62.0 },
];

export function generateSampleBatches(): HoneyBatch[] {
  return RAW_DATA.map(raw => {
    const { shelfStatus, rejectReason } = determineShelfStatus(raw.acidity, raw.moisture);
    return {
      batchId: raw.batchId,
      harvestDate: new Date(raw.dateStr),
      nectarSource: raw.source,
      acidity: raw.acidity,
      moisture: raw.moisture,
      yield: raw.yield,
      shelfStatus: shelfStatus as ShelfStatus,
      rejectReason,
    };
  });
}

export function generateSampleCsv(): string {
  const headers = '批次号,采蜜日期,蜜源标注,实测酸度,含水量,产量';
  const lines = RAW_DATA.map(r =>
    `${r.batchId},${r.dateStr},${r.source},${r.acidity},${r.moisture},${r.yield}`
  );
  return [headers, ...lines].join('\n');
}
