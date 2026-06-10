import { HoneyBatch, NectarSource, ShelfStatus } from './types';
import { determineShelfStatus } from '../stats/status';

const CSV_HEADERS = [
  '批次号',
  '采蜜日期',
  '蜜源标注',
  '实测酸度',
  '含水量',
  '产量',
];

const VALID_SOURCES = new Set<NectarSource>(['槐', '枣', '杂花']);

function parseDate(dateStr: string): Date {
  const cleaned = dateStr.trim().replace(/\//g, '-');
  const date = new Date(cleaned);
  if (isNaN(date.getTime())) {
    throw new Error(`无效的日期格式: ${dateStr}`);
  }
  return date;
}

function parseNumeric(value: string, fieldName: string): number {
  const num = parseFloat(value.trim());
  if (isNaN(num)) {
    throw new Error(`无效的数值: ${fieldName} = ${value}`);
  }
  if (num < 0) {
    throw new Error(`${fieldName} 不能为负数: ${value}`);
  }
  return num;
}

export function parseCsv(csvText: string): HoneyBatch[] {
  const lines = csvText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) {
    throw new Error('CSV 文件至少需要包含表头和一行数据');
  }

  const headers = lines[0].split(',').map(h => h.trim());
  const missingHeaders = CSV_HEADERS.filter(h => !headers.includes(h));
  if (missingHeaders.length > 0) {
    throw new Error(`CSV 缺少必要列: ${missingHeaders.join(', ')}`);
  }

  const idx = {
    batchId: headers.indexOf('批次号'),
    harvestDate: headers.indexOf('采蜜日期'),
    nectarSource: headers.indexOf('蜜源标注'),
    acidity: headers.indexOf('实测酸度'),
    moisture: headers.indexOf('含水量'),
    yield: headers.indexOf('产量'),
  };

  const batches: HoneyBatch[] = [];
  const batchIdSet = new Set<string>();

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim());
    if (cols.length < headers.length) {
      throw new Error(`第 ${i + 1} 行列数不足`);
    }

    const batchId = cols[idx.batchId];
    if (!batchId) {
      throw new Error(`第 ${i + 1} 行批次号为空`);
    }
    if (batchIdSet.has(batchId)) {
      throw new Error(`批次号重复: ${batchId}`);
    }
    batchIdSet.add(batchId);

    const harvestDate = parseDate(cols[idx.harvestDate]);

    const source = cols[idx.nectarSource] as NectarSource;
    if (!VALID_SOURCES.has(source)) {
      throw new Error(`第 ${i + 1} 行蜜源标注无效: ${source}（应为：槐/枣/杂花）`);
    }

    const acidity = parseNumeric(cols[idx.acidity], '实测酸度');
    const moisture = parseNumeric(cols[idx.moisture], '含水量');
    const yieldAmt = parseNumeric(cols[idx.yield], '产量');

    if (moisture > 100) {
      throw new Error(`第 ${i + 1} 行含水量不能超过 100%`);
    }

    const { shelfStatus, rejectReason } = determineShelfStatus(acidity, moisture);

    batches.push({
      batchId,
      harvestDate,
      nectarSource: source,
      acidity,
      moisture,
      yield: yieldAmt,
      shelfStatus: shelfStatus as ShelfStatus,
      rejectReason,
    });
  }

  return batches;
}

export function exportToCsv(batches: HoneyBatch[]): string {
  const headers = [
    '批次号',
    '采蜜日期',
    '蜜源标注',
    '实测酸度(mmol/kg)',
    '含水量(%)',
    '产量(kg)',
    '可上架',
    '待复检原因',
  ];

  const lines = [headers.join(',')];

  for (const batch of batches) {
    const dateStr = batch.harvestDate.toISOString().split('T')[0];
    const line = [
      batch.batchId,
      dateStr,
      batch.nectarSource,
      batch.acidity.toFixed(2),
      batch.moisture.toFixed(2),
      batch.yield.toFixed(2),
      batch.shelfStatus,
      batch.rejectReason || '-',
    ].join(',');
    lines.push(line);
  }

  return lines.join('\n');
}

export function downloadCsv(content: string, filename: string): void {
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
