import React, { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingDown } from 'lucide-react';

const ProductTable = ({ products, onRowClick }) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (typeof aValue === 'string' && aValue.includes('%')) {
      aValue = parseFloat(aValue.replace('%', ''));
      bValue = parseFloat(bValue.replace('%', ''));
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown className="h-4 w-4 opacity-30" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 text-blue-600" /> : 
      <ChevronDown className="h-4 w-4 text-blue-600" />;
  };

  const getPriceBar = (priceRange) => {
    const { min, max, current } = priceRange;
    const range = max - min;
    const currentPos = range > 0 ? ((current - min) / range) * 100 : 50;
    
    // Determine color based on position
    let barColor = '#10b981'; // green
    if (currentPos > 66) barColor = '#ef4444'; // red
    else if (currentPos > 33) barColor = '#f59e0b'; // orange
    
    return (
      <div className="w-full max-w-[200px]">
        <div className="h-2 bg-gray-200 dark:bg-slate-600 rounded-full relative">
          <div 
            className="h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${Math.max(currentPos, 5)}%`,
              backgroundColor: barColor 
            }}
          />
          <div 
            className="absolute top-0 w-1 h-2 bg-gray-800 dark:bg-white rounded-full"
            style={{ left: `${currentPos}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>{min.toFixed(0)}</span>
          <span>{max.toFixed(0)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-slate-700/30">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                №
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600/50 transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-2">
                  <span>Товар</span>
                  <SortIcon field="name" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600/50 transition-colors"
                onClick={() => handleSort('producer')}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>Производитель</span>
                  <SortIcon field="producer" />
                </div>
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Медиана
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Медиана рынка
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Отклонение цены ритейлеров от медианы рынка и диапазон цен конкурентов
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
            {sortedProducts.map((product, index) => (
              <tr 
                key={product.id}
                className="hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition-all duration-200 group"
                onClick={() => onRowClick && onRowClick(product)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap max-w-md">
                  <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {product.name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {product.producer}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {product.minPrice.toFixed(2)}
                    </div>
                    <div className="text-xs text-green-600">
                      {product.discount}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {product.maxPrice.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center space-x-4">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {product.currentPrice.toFixed(2)}
                    </span>
                    {getPriceBar(product.priceRange)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;