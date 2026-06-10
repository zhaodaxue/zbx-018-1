import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, AlertCircle, Sparkles } from 'lucide-react';
import { useDataStore } from '../store/useDataStore';
import { parseCsv } from '../data/csvParser';
import { generateSampleBatches, generateSampleCsv } from '../data/sampleData';
import { downloadCsv } from '../data/csvParser';

export function UploadArea() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setBatches = useDataStore(state => state.setBatches);
  const setError = useDataStore(state => state.setError);
  const hasData = useDataStore(state => state.hasData);

  const handleFile = useCallback((file: File) => {
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const batches = parseCsv(text);
        setBatches(batches);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'CSV 解析失败';
        setUploadError(message);
        setError(message);
      }
    };
    reader.onerror = () => {
      setUploadError('文件读取失败');
    };
    reader.readAsText(file, 'UTF-8');
  }, [setBatches, setError]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      handleFile(file);
    } else {
      setUploadError('请上传 CSV 格式的文件');
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleLoadSample = () => {
    const batches = generateSampleBatches();
    setBatches(batches);
    setUploadError(null);
    setError(null);
  };

  const handleDownloadSample = () => {
    const csv = generateSampleCsv();
    downloadCsv(csv, '槐香谷示例批次数据.csv');
  };

  if (hasData) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-12">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer
          ${isDragging
            ? 'border-honey-500 bg-honey-50 scale-[1.02]'
            : 'border-honey-300 bg-sophora-50 hover:border-honey-400 hover:bg-honey-50'
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleInputChange}
          accept=".csv"
          className="hidden"
        />

        <div className="flex flex-col items-center space-y-4">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors
            ${isDragging ? 'bg-honey-200' : 'bg-honey-100'}
          `}>
            <Upload className="w-10 h-10 text-honey-600" />
          </div>

          <div>
            <h3 className="text-xl font-serif font-bold text-forest-700 mb-2">
              拖拽 CSV 文件到此处
            </h3>
            <p className="text-gray-500">
              或点击选择文件 · 支持 UTF-8 编码 CSV
            </p>
          </div>

          <div className="pt-4 space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <FileText className="w-4 h-4" />
              <span>包含字段：批次号、采蜜日期、蜜源标注、实测酸度、含水量、产量</span>
            </div>
          </div>
        </div>

        {uploadError && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-600 text-sm text-left">{uploadError}</p>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={handleLoadSample}
          className="flex items-center gap-2 px-6 py-3 bg-forest-500 text-white rounded-xl hover:bg-forest-600 transition-colors shadow-md hover:shadow-lg"
        >
          <Sparkles className="w-5 h-5" />
          加载示例数据
        </button>
        <button
          onClick={handleDownloadSample}
          className="flex items-center gap-2 px-6 py-3 bg-white text-forest-700 border border-forest-300 rounded-xl hover:bg-forest-50 transition-colors"
        >
          <FileText className="w-5 h-5" />
          下载示例 CSV
        </button>
      </div>
    </div>
  );
}
