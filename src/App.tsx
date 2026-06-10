import { Flower2, RefreshCw } from 'lucide-react';
import { UploadArea } from './components/UploadArea';
import { FilterBar } from './components/FilterBar';
import { StatsDashboard } from './components/StatsDashboard';
import { BoxPlotChart } from './components/BoxPlotChart';
import { QuantileTable } from './components/QuantileTable';
import { BatchTable } from './components/BatchTable';
import { ExportButton } from './components/ExportButton';
import { useDataStore } from './store/useDataStore';

function App() {
  const { hasData, clearData } = useDataStore();

  return (
    <div className="min-h-screen">
      <header className="bg-white/80 backdrop-blur-sm border-b border-honey-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-honey-400 to-honey-600 rounded-xl flex items-center justify-center shadow-md">
              <Flower2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-xl text-forest-700">槐香谷</h1>
              <p className="text-xs text-gray-400">蜂蜜批次质量分析平台</p>
            </div>
          </div>

          {hasData && (
            <div className="flex items-center gap-3">
              <button
                onClick={clearData}
                className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                重新上传
              </button>
              <ExportButton />
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {!hasData ? (
          <UploadArea />
        ) : (
          <>
            <FilterBar />
            <StatsDashboard />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <BoxPlotChart
                metric="acidity"
                title="酸度分布箱线图"
                unit="mmol/kg"
                threshold={40}
              />
              <BoxPlotChart
                metric="moisture"
                title="含水量分布箱线图"
                unit="%"
                threshold={20}
              />
            </div>

            <div className="mb-6">
              <QuantileTable />
            </div>

            <BatchTable />
          </>
        )}
      </main>

      <footer className="py-6 text-center text-gray-400 text-sm">
        <p>槐香谷 · 城郊蜂场质量管控 © 2024</p>
      </footer>
    </div>
  );
}

export default App;
