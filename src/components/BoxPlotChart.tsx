import { useDataStore } from '../store/useDataStore';
import { QuantileStats, NectarSource } from '../data/types';

interface BoxPlotChartProps {
  metric: 'acidity' | 'moisture';
  title: string;
  unit: string;
  threshold?: number;
}

const COLORS: Record<NectarSource, { fill: string; stroke: string }> = {
  '槐': { fill: '#F0EAD0', stroke: '#A3C39C' },
  '枣': { fill: '#C49570', stroke: '#8B4513' },
  '杂花': { fill: '#F0CC65', stroke: '#D4A017' },
};

export function BoxPlotChart({ metric, title, unit, threshold }: BoxPlotChartProps) {
  const { groupStats, hasData } = useDataStore();

  if (!hasData) return null;

  const validGroups = groupStats.filter(g => g.count > 0);
  if (validGroups.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-honey-100 p-6">
        <h3 className="font-serif font-bold text-forest-700 text-lg mb-4">{title}</h3>
        <p className="text-gray-400 text-center py-12">暂无数据</p>
      </div>
    );
  }

  const allStats = validGroups.map(g =>
    metric === 'acidity' ? g.acidityStats : g.moistureStats
  );

  const allValues = allStats.flatMap(s => [s.min, s.max, ...(threshold ? [threshold] : [])]);
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const padding = (maxVal - minVal) * 0.1 || 1;
  const chartMin = Math.floor(minVal - padding);
  const chartMax = Math.ceil(maxVal + padding);
  const range = chartMax - chartMin;

  const width = 480;
  const height = 280;
  const margin = { top: 30, right: 20, bottom: 50, left: 60 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const yScale = (value: number) => {
    return margin.top + plotHeight - ((value - chartMin) / range) * plotHeight;
  };

  const groupWidth = plotWidth / validGroups.length;
  const boxWidth = Math.min(groupWidth * 0.5, 60);

  const yTicks = 5;
  const tickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
    chartMin + (range * i) / yTicks
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-honey-100 p-6">
      <h3 className="font-serif font-bold text-forest-700 text-lg mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-4">单位：{unit}</p>

      <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="max-w-full">
        {tickValues.map((val, i) => {
          const y = yScale(val);
          return (
            <g key={i}>
              <line
                x1={margin.left}
                y1={y}
                x2={width - margin.right}
                y2={y}
                stroke="#f0f0f0"
                strokeWidth="1"
              />
              <text
                x={margin.left - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-gray-400 text-xs"
              >
                {val.toFixed(1)}
              </text>
            </g>
          );
        })}

        {threshold !== undefined && (
          <g>
            <line
              x1={margin.left}
              y1={yScale(threshold)}
              x2={width - margin.right}
              y2={yScale(threshold)}
              stroke="#B91C1C"
              strokeWidth="2"
              strokeDasharray="6 4"
              opacity="0.7"
            />
            <text
              x={width - margin.right}
              y={yScale(threshold) - 5}
              textAnchor="end"
              fill="#B91C1C"
              fontSize="11"
              fontWeight="500"
            >
              阈值 {threshold}
            </text>
          </g>
        )}

        {validGroups.map((group, idx) => {
          const stats: QuantileStats = metric === 'acidity'
            ? group.acidityStats
            : group.moistureStats;
          const centerX = margin.left + groupWidth * (idx + 0.5);
          const color = COLORS[group.source];

          const q1Y = yScale(stats.q1);
          const q3Y = yScale(stats.q3);
          const medianY = yScale(stats.median);
          const minY = yScale(stats.lowerFence);
          const maxY = yScale(stats.upperFence);
          const boxX = centerX - boxWidth / 2;
          const boxH = Math.abs(q3Y - q1Y) || 2;

          return (
            <g key={group.source}>
              <line
                x1={centerX}
                y1={minY}
                x2={centerX}
                y2={maxY}
                stroke={color.stroke}
                strokeWidth="2"
              />
              <line
                x1={centerX - boxWidth / 3}
                y1={minY}
                x2={centerX + boxWidth / 3}
                y2={minY}
                stroke={color.stroke}
                strokeWidth="2"
              />
              <line
                x1={centerX - boxWidth / 3}
                y1={maxY}
                x2={centerX + boxWidth / 3}
                y2={maxY}
                stroke={color.stroke}
                strokeWidth="2"
              />

              <rect
                x={boxX}
                y={Math.min(q1Y, q3Y)}
                width={boxWidth}
                height={boxH}
                fill={color.fill}
                stroke={color.stroke}
                strokeWidth="2"
                rx="4"
              />

              <line
                x1={boxX}
                y1={medianY}
                x2={boxX + boxWidth}
                y2={medianY}
                stroke={color.stroke}
                strokeWidth="2.5"
              />

              {stats.outliers.map((outlier, oi) => (
                <circle
                  key={oi}
                  cx={centerX}
                  cy={yScale(outlier)}
                  r="4"
                  fill="#B91C1C"
                  opacity="0.8"
                />
              ))}

              <text
                x={centerX}
                y={height - margin.bottom + 25}
                textAnchor="middle"
                fill="#4a5568"
                fontSize="13"
                fontWeight="500"
              >
                {group.source}蜜
              </text>
              <text
                x={centerX}
                y={height - margin.bottom + 42}
                textAnchor="middle"
                fill="#a0aec0"
                fontSize="11"
              >
                ({group.count}批)
              </text>
            </g>
          );
        })}

        <text
          x={margin.left}
          y={18}
          fill="#718096"
          fontSize="12"
        >
          {unit}
        </text>
      </svg>
    </div>
  );
}
