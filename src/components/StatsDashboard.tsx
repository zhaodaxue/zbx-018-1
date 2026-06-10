import { Droplets, Weight, TrendingUp, Archive, X, Target } from 'lucide-react';
import { useDataStore } from '../store/useDataStore';
import { StatusFilter } from '../data/types';

export function StatsDashboard() {
  const { summary, hasData, isFocusMode, focusedBatchId, clearFocus, filter, setStatusFilter } = useDataStore();

  if (!hasData) return null;

  const handleCardClick = (statusFilter: StatusFilter) => {
    if (isFocusMode) return;
    if (filter.statusFilter === statusFilter) {
      setStatusFilter('all');
    } else {
      setStatusFilter(statusFilter);
    }
  };

  const stats = [
    {
      label: '总批次',
      value: summary.totalBatches,
      unit: '批',
      icon: Archive,
      gradient: 'from-honey-400 to-honey-600',
      bgColor: 'bg-honey-50',
      iconColor: 'text-honey-600',
      filter: 'all' as StatusFilter,
      isActive: filter.statusFilter === 'all',
      clickable: true,
    },
    {
      label: '可上架',
      value: summary.passCount,
      unit: '批',
      icon: TrendingUp,
      gradient: 'from-forest-400 to-forest-600',
      bgColor: 'bg-forest-50',
      iconColor: 'text-forest-600',
      subtext: `合格率 ${(summary.passRate * 100).toFixed(1)}%`,
      filter: '可上架' as StatusFilter,
      isActive: filter.statusFilter === '可上架',
      clickable: true,
    },
    {
      label: '待复检',
      value: summary.failCount,
      unit: '批',
      icon: Droplets,
      gradient: 'from-red-400 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-500',
      filter: '待复检' as StatusFilter,
      isActive: filter.statusFilter === '待复检',
      clickable: true,
    },
    {
      label: '总产量',
      value: summary.totalYield.toFixed(1),
      unit: 'kg',
      icon: Weight,
      gradient: 'from-amber-400 to-amber-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      clickable: false,
    },
  ];

  return (
    <div className="mb-6">
      {isFocusMode && (
        <div className="flex items-center justify-between mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-medium text-blue-700">
                聚焦 {summary.totalBatches} 批
              </span>
              <span className="text-sm text-blue-500 ml-2">
                （同蜜源、同上架状态的关联批次 · 基于 {focusedBatchId}）
              </span>
            </div>
          </div>
          <button
            onClick={clearFocus}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <X className="w-4 h-4" />
            退出聚焦
          </button>
        </div>
      )}

      {!isFocusMode && filter.statusFilter !== 'all' && (
        <div className="flex items-center justify-between mb-4 p-4 bg-honey-50 border border-honey-200 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-honey-700 font-medium">
              快捷筛选：{filter.statusFilter}
            </span>
          </div>
          <button
            onClick={() => setStatusFilter('all')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white text-honey-600 border border-honey-300 rounded-lg hover:bg-honey-50 transition-colors"
          >
            <X className="w-4 h-4" />
            清除筛选
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const isClickable = stat.clickable && !isFocusMode;
          return (
            <div
              key={idx}
              onClick={() => isClickable && stat.filter && handleCardClick(stat.filter)}
              className={`relative overflow-hidden rounded-2xl bg-white shadow-sm border p-6 transition-all
                ${stat.isActive && stat.clickable
                  ? 'border-honey-500 ring-2 ring-honey-200 shadow-md'
                  : 'border-honey-100 hover:shadow-md'
                }
                ${isClickable ? 'cursor-pointer hover:scale-[1.02]' : ''}
              `}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bgColor} rounded-bl-full opacity-50`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-500 text-sm font-medium">{stat.label}</span>
                  <div className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-serif font-bold text-gray-800">
                    {stat.value}
                  </span>
                  <span className="text-gray-400 text-sm">{stat.unit}</span>
                </div>
                {stat.subtext && (
                  <p className="mt-2 text-xs text-gray-400">{stat.subtext}</p>
                )}
                {isClickable && (
                  <p className="mt-2 text-xs text-honey-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    点击筛选
                  </p>
                )}
              </div>
              {stat.isActive && stat.clickable && (
                <div className="absolute top-3 right-3">
                  <div className="w-2.5 h-2.5 bg-honey-500 rounded-full" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
