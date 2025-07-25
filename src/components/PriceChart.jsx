import React from 'react';
import { X } from 'lucide-react';

const PriceChart = ({ isOpen, onClose, data, title }) => {
  if (!isOpen) return null;

  const maxValue = Math.max(...data.map(item => item.value));

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return price.toFixed(2).replace('.', ',');
    }
    return price;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#012F3A] rounded-xl max-w-5xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title || "Туалетное крем-мыло для лица и тела Caring cream bar, DURU, 90г"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Chart */}
        <div className="p-6">
          <div className="space-y-4">
            {data.map((item, index) => {
              const barWidth = (item.value / maxValue) * 100;

              return (
                <div key={index} className="flex items-center space-x-4">
                  {/* Название */}
                  <div className="w-40 text-sm text-gray-700 dark:text-white text-right">
                    {item.name}
                  </div>

                  {/* Бар */}
                  <div className="flex-1 relative">
                    <div className="h-8 bg-gray-100 dark:bg-slate-700 rounded-md overflow-hidden relative">
                      <div
                        className="h-full transition-all duration-500 ease-out"
                        style={{
                          width: `${barWidth}%`,
                          backgroundColor: item.color,
                        }}
                      />
                      {/* Горизонтальная линия по центру */}
                      <div className="absolute inset-y-0 left-0 w-full border-t border-dashed border-gray-400 opacity-20 top-1/2 transform -translate-y-1/2"></div>
                    </div>

                    {/* Цена */}
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm font-medium text-white whitespace-nowrap">
                      {formatPrice(item.value)} ₽
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Легенда */}
          <div className="mt-8 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#7EC8E3' }}></div>
              <span className="text-white">Регулярная цена</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FFA726' }}></div>
              <span className="text-white">Промоцена</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FFD54F' }}></div>
              <span className="text-white">Медиана рынка</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceChart;
