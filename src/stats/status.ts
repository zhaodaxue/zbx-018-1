import { SHELF_THRESHOLDS, ShelfStatus } from '../data/types';

export function determineShelfStatus(
  acidity: number,
  moisture: number
): { shelfStatus: ShelfStatus; rejectReason: string } {
  const acidityOk = acidity <= SHELF_THRESHOLDS.maxAcidity;
  const moistureOk = moisture <= SHELF_THRESHOLDS.maxMoisture;

  if (acidityOk && moistureOk) {
    return { shelfStatus: '可上架', rejectReason: '' };
  }

  const reasons: string[] = [];
  if (!acidityOk) {
    reasons.push('酸度超标');
  }
  if (!moistureOk) {
    reasons.push('含水量超标');
  }

  return {
    shelfStatus: '待复检',
    rejectReason: reasons.join('、'),
  };
}
