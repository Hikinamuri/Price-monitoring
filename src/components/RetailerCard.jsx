import React from 'react';

const RetailerCard = ({ retailer, onClick }) => {
  const getDiscountColor = (discount) => {
    const value = Math.abs(parseFloat(discount));
    if (value > 15) return 'text-red-600 dark:text-red-400';
    if (value > 10) return 'text-orange-600 dark:text-orange-400';
    return 'text-green-600 dark:text-green-400';
  };

  return (
    <div 
      onClick={() => onClick && onClick(retailer)}
      className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-lg border border-gray-200 dark:border-slate-700 cursor-pointer transition-all duration-300 hover:scale-[1.02] group"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: retailer.iconBg }}
          >
            {retailer.icon}
          </div>
          <span className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {retailer.name}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Средняя относительная
          </span>
          <span className={`font-semibold text-lg ${getDiscountColor(retailer.discount)}`}>
            {retailer.discount}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Действует до 7 дней
          </span>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {retailer.rating}
          </span>
        </div>
        
        <div className="pt-2 border-t border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              SKU {retailer.sku}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetailerCard;