import { useDataStore } from '../store/useDataStore';
import { NectarSource } from '../data/types';
import { BarChart3 } from 'lucide-react';

export function QuantileTable() {
  const { groupStats, hasData } = useDataStore();

  if (!hasData) return null;

  const validGroups = groupStats.filter(g => g.count > 0);

  const rows = [
    { key: 'min', label: '最小值' },
    { key: 'q1', label: 'Q1 (25%)' },
    { key: 'median', label: '中位数' },
    { key: 'q3', label: 'Q3 (75%)' },
    { key: 'max', label: '最大值' },
    { key: 'iqr', label: '四分位距' },
  ];

  const sourceColors: Record<NectarSource, string> = {
    '槐': 'bg-sophora-50',
    '枣': 'bg-jujube-500/10',
    '杂花': 'bg-honey-50',
  };

  const indicators = [
    { key: 'acidity', label: '酸度', unit: 'mmol/kg' },
    { key: 'moisture', label: '含水量', unit: '%' },
  ] as const;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-honey-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-honey-600" />
        <h3 className="font-serif font-bold text-forest-700 text-lg">分位数统计表</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-honey-200">
              <th className="py-3 px-4 text-left font-medium text-gray-500" rowSpan={2}>指标</th>
              {validGroups.map(g => (
                <th
                  key={g.source}
                  colSpan={2}
                  className={`py-3 px-4 text-center font-medium ${sourceColors[g.source]}`}
                >
                  <div className="text-forest-700">{g.source}蜜</div>
                  <div className="text-xs text-gray-400 font-normal">{g.count} 批</div>
                </th>
              ))}
            </tr>
            <tr className="border-b border-honey-100">
              {validGroups.flatMap(g =>
                indicators.map(ind => (
                  <th
                    key={`${g.source}-${ind.key}`}
                    className="py-2 px-4 text-center font-medium text-gray-500 text-xs"
                  >
                    {ind.label} ({ind.unit})
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.key}
                className={idx % 2 === 0 ? 'bg-gray-50/50' : ''}
              >
                <td className="py-2.5 px-4 text-gray-600 font-medium">
                  {row.label}
                </td>
                {validGroups.flatMap(g =>
                  indicators.map(ind => {
                    const stats = ind.key === 'acidity' ? g.acidityStats : g.moistureStats;
                    const value = (stats as unknown as Record<string, number>)[row.key];
                    return (
                      <td key={`${g.source}-${ind.key}`} className="py-2.5 px-4 text-center text-gray-700">
                        {typeof value === 'number' ? value.toFixed(2) : '-'}
                      </td>
                    );
                  })
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-600 mb-2">图例说明</h4>
        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
          <span>📦 箱线图展示数据分布：箱子为 Q1-Q3 区间，中线为中位数</span>
          <span>须线延伸至 1.5×IQR 范围</span>
          <span className="text-red-500">● 离群点</span>
        </div>
      </div>
    </div>
  );
}
