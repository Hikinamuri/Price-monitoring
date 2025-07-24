import React from 'react';
import { X } from 'lucide-react';

const PriceChart = ({ isOpen, onClose, data, title }) => {
  if (!isOpen) return null;

  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
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
          <div className="space-y-3">
            {data.map((item, index) => {
              const barWidth = (item.value / maxValue) * 100;
              
              return (
                <div key={index} className="flex items-center space-x-4">
                  {/* Retailer name */}
                  <div className="w-32 text-sm text-gray-700 dark:text-gray-300 text-right">
                    {item.name}
                  </div>
                  
                  {/* Price bar */}
                  <div className="flex-1 relative">
                    <div className="h-8 bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                      <div
                        className="h-full rounded-lg transition-all duration-500 ease-out"
                        style={{
                          width: `${barWidth}%`,
                          backgroundColor: item.color
                        }}
                      />
                    </div>
                    
                    {/* Price value */}
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-900 dark:text-white">
                      {item.value.toFixed(2)} ₽
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Дешевые цены</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Средние цены</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Дорогие цены</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceChart;