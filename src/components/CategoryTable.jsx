import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CategoryTable = ({ categories, onRowClick, title = "Динамика медиан" }) => {
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

  const sortedCategories = [...categories].sort((a, b) => {
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

  const getMedianCells = (medianData) => {
    const totalDays = 14; // Two weeks shown in design
    const dayCells = [];
    
    for (let i = 0; i < totalDays; i++) {
      const value = medianData[i] || 0;
      let cellClass = 'w-6 h-6 rounded flex items-center justify-center text-xs font-medium transition-all duration-200 hover:scale-110';
      let textColor = '';
      
      if (value === 0) {
        cellClass += ' bg-gray-100 dark:bg-slate-700';
        textColor = 'text-gray-400 dark:text-gray-500';
      } else if (value <= 2) {
        cellClass += ' bg-emerald-400';
        textColor = 'text-white';
      } else if (value <= 5) {
        cellClass += ' bg-yellow-400';
        textColor = 'text-gray-800';
      } else if (value <= 10) {
        cellClass += ' bg-orange-400';
        textColor = 'text-white';
      } else {
        cellClass += ' bg-red-400';
        textColor = 'text-white';
      }

      dayCells.push(
        <div key={i} className={`${cellClass} ${textColor}`}>
          {value > 0 ? value : ''}
        </div>
      );
    }
    
    return dayCells;
  };

  const getDiscountColor = (discount) => {
    const value = Math.abs(parseFloat(discount));
    if (value > 15) return 'text-red-600 dark:text-red-400';
    if (value > 10) return 'text-orange-600 dark:text-orange-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getDynamicColor = (dynamic) => {
    if (dynamic.startsWith('+')) return 'text-red-600 dark:text-red-400';
    if (dynamic.startsWith('-')) return 'text-green-600 dark:text-green-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
      {/* Table Header */}
      <div className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
          <div className="flex space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-emerald-400 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Дешевые медианы</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Средние</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-400 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Дорогие медианы</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-slate-700/30">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-8">
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
                onClick={() => handleSort('discount')}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>Средняя относительная</span>
                  <SortIcon field="discount" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600/50 transition-colors"
                onClick={() => handleSort('weekDynamic')}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>Динамика за 7 дней</span>
                  <SortIcon field="weekDynamic" />
                </div>
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Общее SKU
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="grid grid-cols-14 gap-px text-center text-[10px] mb-2">
                  <span>&gt;50</span>
                  <span>50-40</span>
                  <span>40-30</span>
                  <span>30-20</span>
                  <span>20-10</span>
                  <span>10-0</span>
                  <span>-</span>
                  <span>0-10</span>
                  <span>10-20</span>
                  <span>20-30</span>
                  <span>30-40</span>
                  <span>40-50</span>
                  <span>&gt;50</span>
                  <span>&gt;60</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
            {sortedCategories.map((category, index) => (
              <tr 
                key={category.id}
                className="hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition-all duration-200 group"
                onClick={() => onRowClick && onRowClick(category)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {category.name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`text-sm font-semibold ${getDiscountColor(category.discount)}`}>
                    {category.discount}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`text-sm font-medium ${getDynamicColor(category.weekDynamic)}`}>
                    {category.weekDynamic}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {category.totalSku}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="grid grid-cols-14 gap-1 justify-center max-w-[420px]">
                    {getMedianCells(category.medianData)}
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

export default CategoryTable;