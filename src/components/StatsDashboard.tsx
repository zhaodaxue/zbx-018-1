import { Droplets, Weight, TrendingUp, Archive } from 'lucide-react';
import { useDataStore } from '../store/useDataStore';

export function StatsDashboard() {
  const { summary, hasData } = useDataStore();

  if (!hasData) return null;

  const stats = [
    {
      label: '总批次',
      value: summary.totalBatches,
      unit: '批',
      icon: Archive,
      gradient: 'from-honey-400 to-honey-600',
      bgColor: 'bg-honey-50',
      iconColor: 'text-honey-600',
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
    },
    {
      label: '待复检',
      value: summary.failCount,
      unit: '批',
      icon: Droplets,
      gradient: 'from-red-400 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-500',
    },
    {
      label: '总产量',
      value: summary.totalYield.toFixed(1),
      unit: 'kg',
      icon: Weight,
      gradient: 'from-amber-400 to-amber-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="relative overflow-hidden rounded-2xl bg-white shadow-sm border border-honey-100 p-6 hover:shadow-md transition-shadow"
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
            </div>
          </div>
        );
      })}
    </div>
  );
}
