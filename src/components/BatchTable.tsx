import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { useDataStore } from '../store/useDataStore';
import { HoneyBatch } from '../data/types';

const PAGE_SIZE = 10;

export function BatchTable() {
  const { visibleBatches, hasData, focusedBatchId, isFocusMode } = useDataStore();
  const [currentPage, setCurrentPage] = useState(1);
  const tableRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});

  useEffect(() => {
    setCurrentPage(1);
  }, [visibleBatches.length]);

  useEffect(() => {
    if (focusedBatchId && visibleBatches.length > 0) {
      const idx = visibleBatches.findIndex(b => b.batchId === focusedBatchId);
      if (idx >= 0) {
        const page = Math.floor(idx / PAGE_SIZE) + 1;
        setCurrentPage(page);
        setTimeout(() => {
          const rowEl = rowRefs.current[focusedBatchId];
          if (rowEl && tableRef.current) {
            rowEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  }, [focusedBatchId, visibleBatches]);

  if (!hasData) return null;

  const totalPages = Math.ceil(visibleBatches.length / PAGE_SIZE);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const pageData = visibleBatches.slice(startIdx, startIdx + PAGE_SIZE);

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const sourceBadge = (source: string) => {
    const colors: Record<string, string> = {
      '槐': 'bg-sophora-50 text-forest-700 border-sophora-100',
      '枣': 'bg-jujube-500/10 text-jujube-600 border-jujube-500/30',
      '杂花': 'bg-honey-50 text-honey-700 border-honey-200',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${colors[source] || 'bg-gray-100 text-gray-600'}`}>
        {source}蜜
      </span>
    );
  };

  const statusBadge = (batch: HoneyBatch) => {
    if (batch.shelfStatus === '可上架') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-forest-50 text-forest-700 border border-forest-200">
          <CheckCircle className="w-3 h-3" />
          可上架
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
        <AlertTriangle className="w-3 h-3" />
        待复检
      </span>
    );
  };

  if (visibleBatches.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-honey-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif font-bold text-forest-700 text-lg">批次明细表</h3>
          <span className="text-sm text-gray-400">
            共 0 条记录
          </span>
        </div>
        <div className="py-12 text-center">
          <p className="text-gray-400">当前筛选条件下无匹配批次</p>
          {isFocusMode && (
            <p className="text-sm text-gray-300 mt-1">聚焦模式下无关联批次</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div ref={tableRef} className="bg-white rounded-2xl shadow-sm border border-honey-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif font-bold text-forest-700 text-lg">批次明细表</h3>
        <span className="text-sm text-gray-400">
          共 {visibleBatches.length} 条记录
          {isFocusMode && <span className="text-blue-500 ml-1">· 聚焦模式</span>}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-sophora-50 text-forest-700">
              <th className="py-3 px-4 text-left font-medium rounded-l-lg">批次号</th>
              <th className="py-3 px-4 text-left font-medium">采蜜日期</th>
              <th className="py-3 px-4 text-left font-medium">蜜源</th>
              <th className="py-3 px-4 text-right font-medium">酸度(mmol/kg)</th>
              <th className="py-3 px-4 text-right font-medium">含水量(%)</th>
              <th className="py-3 px-4 text-right font-medium">产量(kg)</th>
              <th className="py-3 px-4 text-center font-medium">状态</th>
              <th className="py-3 px-4 text-left font-medium rounded-r-lg">待复检原因</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((batch, idx) => {
              const isFocused = batch.batchId === focusedBatchId;
              return (
                <tr
                  key={batch.batchId}
                  ref={el => { rowRefs.current[batch.batchId] = el; }}
                  className={`border-b border-gray-50 hover:bg-honey-50/30 transition-colors
                    ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}
                    ${batch.shelfStatus === '待复检' ? 'bg-red-50/20' : ''}
                    ${isFocused ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200 ring-inset' : ''}
                  `}
                >
                  <td className="py-3 px-4 font-medium text-gray-800">
                    {batch.batchId}
                    {isFocused && <span className="ml-2 text-xs text-blue-500">● 聚焦</span>}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{formatDate(batch.harvestDate)}</td>
                  <td className="py-3 px-4">{sourceBadge(batch.nectarSource)}</td>
                  <td className={`py-3 px-4 text-right font-mono ${batch.acidity > 40 ? 'text-red-600 font-semibold' : 'text-gray-700'}`}>
                    {batch.acidity.toFixed(2)}
                  </td>
                  <td className={`py-3 px-4 text-right font-mono ${batch.moisture > 20 ? 'text-red-600 font-semibold' : 'text-gray-700'}`}>
                    {batch.moisture.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-gray-700">
                    {batch.yield.toFixed(1)}
                  </td>
                  <td className="py-3 px-4 text-center">{statusBadge(batch)}</td>
                  <td className="py-3 px-4 text-gray-500 text-xs">
                    {batch.rejectReason || '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-400">
            第 {currentPage} / {totalPages} 页
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors
                  ${page === currentPage
                    ? 'bg-honey-500 text-white'
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
