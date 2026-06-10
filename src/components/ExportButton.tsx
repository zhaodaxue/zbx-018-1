import { Download } from 'lucide-react';
import { useDataStore } from '../store/useDataStore';
import { exportToCsv, downloadCsv } from '../data/csvParser';

export function ExportButton() {
  const { filteredBatches, hasData } = useDataStore();

  if (!hasData) return null;

  const handleExport = () => {
    const csvContent = exportToCsv(filteredBatches);
    const timestamp = new Date().toISOString().slice(0, 10);
    downloadCsv(csvContent, `槐香谷批次分析_${timestamp}.csv`);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-5 py-2.5 bg-honey-500 text-white rounded-xl hover:bg-honey-600 transition-colors shadow-md hover:shadow-lg font-medium"
    >
      <Download className="w-4.5 h-4.5" />
      导出 CSV
    </button>
  );
}
