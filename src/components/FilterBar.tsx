import { Calendar, Filter } from 'lucide-react';
import { useDataStore } from '../store/useDataStore';
import { NECTAR_SOURCES, NectarSource, StatusFilter } from '../data/types';

export function FilterBar() {
  const {
    filter,
    availableMonths,
    setStartMonth,
    setEndMonth,
    toggleSource,
    setStatusFilter,
    hasData,
    isFocusMode,
  } = useDataStore();

  if (!hasData) return null;

  const monthOptions = availableMonths.map(m => ({
    value: m,
    label: `${m} 月`,
  }));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-honey-100 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-honey-600" />
        <h3 className="font-serif font-bold text-forest-700 text-lg">筛选条件</h3>
      </div>

      <div className="flex flex-wrap items-center gap-8">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <span className="text-gray-600 font-medium">采蜜月份：</span>
          <select
            value={filter.startMonth ?? ''}
            onChange={(e) => setStartMonth(e.target.value ? Number(e.target.value) : null)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-400 bg-white"
          >
            <option value="">起始月</option>
            {monthOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <span className="text-gray-400">—</span>
          <select
            value={filter.endMonth ?? ''}
            onChange={(e) => setEndMonth(e.target.value ? Number(e.target.value) : null)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-400 bg-white"
          >
            <option value="">结束月</option>
            {monthOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-gray-600 font-medium">蜜源：</span>
          <div className="flex gap-2">
            {NECTAR_SOURCES.map((source: NectarSource) => {
              const isSelected = filter.selectedSources.includes(source);
              const colorMap: Record<NectarSource, string> = {
                '槐': isSelected ? 'bg-sophora-100 border-sophora-50 text-forest-700' : 'bg-gray-100 border-gray-200 text-gray-500',
                '枣': isSelected ? 'bg-jujube-500/20 border-jujube-500/40 text-jujube-600' : 'bg-gray-100 border-gray-200 text-gray-500',
                '杂花': isSelected ? 'bg-honey-100 border-honey-300 text-honey-700' : 'bg-gray-100 border-gray-200 text-gray-500',
              };
              return (
                <button
                  key={source}
                  onClick={() => toggleSource(source)}
                  disabled={isFocusMode}
                  className={`px-4 py-2 rounded-lg border transition-all font-medium ${colorMap[source]} ${isFocusMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {source}蜜
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-gray-600 font-medium">状态：</span>
          <div className="flex gap-2">
            {(['all', '可上架', '待复检'] as StatusFilter[]).map((status) => {
              const label = status === 'all' ? '全部' : status;
              const isActive = filter.statusFilter === status;
              const statusColors: Record<StatusFilter, string> = {
                'all': isActive
                  ? 'bg-honey-100 border-honey-300 text-honey-700'
                  : 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-50',
                '可上架': isActive
                  ? 'bg-forest-100 border-forest-300 text-forest-700'
                  : 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-50',
                '待复检': isActive
                  ? 'bg-red-100 border-red-300 text-red-700'
                  : 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-50',
              };
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  disabled={isFocusMode}
                  className={`px-4 py-2 rounded-lg border transition-all font-medium ${statusColors[status]} ${isFocusMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
