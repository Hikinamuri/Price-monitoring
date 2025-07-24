import React from 'react';
import { TrendingDown, Package, Percent, Calendar } from 'lucide-react';

const StatCard = ({ type, value, label }) => {
  const getIcon = () => {
    switch (type) {
      case 'discount':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      case 'sku':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'percentage':
        return <Percent className="h-5 w-5 text-green-500" />;
      case 'dynamic':
        return <Calendar className="h-5 w-5 text-orange-500" />;
      default:
        return null;
    }
  };

  const getValueColor = () => {
    switch (type) {
      case 'discount':
      case 'dynamic':
        return 'text-red-600 dark:text-red-400';
      case 'sku':
        return 'text-blue-600 dark:text-blue-400';
      case 'percentage':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-900 dark:text-white';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center space-x-3 mb-2">
        {getIcon()}
        <span className={`text-2xl font-bold ${getValueColor()}`}>
          {value}
        </span>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        {label}
      </p>
    </div>
  );
};

export default StatCard;