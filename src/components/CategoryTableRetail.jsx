import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CategoryTableRetail = ({ categories, onRowClick, title = "Динамика медиан" }) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [expandedIds, setExpandedIds] = useState(new Set());

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleExpand = (id) => {
    const newSet = new Set(expandedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedIds(newSet);
  };

  const flattenCategories = (cats, level = 0, parentExpanded = true) => {
    const result = [];
    cats.map(cat => {
        console.log('cat', cat)
    })
    cats.forEach((cat) => {
      const isExpanded = expandedIds.has(cat?.id);
      const visible = parentExpanded;
      result.push({ ...cat, level, visible, isExpanded });

      if (cat.children && cat.children.length > 0) {
        result.push(...flattenCategories(cat.children, level + 1, visible && isExpanded));
      }
    });
    return result;
  };

  const sortedCategories = () => {
    const flat = flattenCategories(categories);
    if (!sortField) return flat;

    const sorted = [...flat].sort((a, b) => {
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

    return sorted;
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown className="h-4 w-4 opacity-30" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 text-blue-600" /> : 
      <ChevronDown className="h-4 w-4 text-blue-600" />;
  };

  const getMedianCells = (medianData) => {
    const totalDays = 14;
    const dayCells = [];

    for (let i = 0; i < totalDays; i++) {
      const value = medianData[i] || 0;
      let cellClass = 'w-6 h-6 rounded flex items-center justify-center text-xs font-medium transition-all duration-200 hover:scale-110';
      let textColor = '';

      if (value === 0) {
        cellClass += ' bg-gray-100 dark:bg-[#014252]';
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
    if (dynamic?.startsWith('+')) return 'text-red-600 dark:text-red-400';
    if (dynamic?.startsWith('-')) return 'text-green-600 dark:text-green-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const flatSorted = sortedCategories();

  return (
    <div className="bg-white dark:bg-[#014252] rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
      <div className="bg-gray-50 dark:bg-[#014252]  border-b border-gray-200 dark:border-slate-600 px-6 py-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-[#014252] ">
            <tr>
              <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">№</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('name')}>
                <div className="flex items-center space-x-1">
                  <span>Категория</span>
                  <SortIcon field="name" />
                </div>
              </th>
              <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('discount')}>
                <div className="flex justify-center items-center space-x-1">
                  <span>Отклонение</span>
                  <SortIcon field="discount" />
                </div>
              </th>
              <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase">SKU</th>
              <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase">Медианы</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
            {flatSorted.map((cat, index) => (
              cat.visible && (
                <tr key={cat.id} onClick={() => onRowClick?.(cat)} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 group">
                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{index + 1}</td>
                  <td className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">
                    <div className="flex items-center" style={{ paddingLeft: `${cat.level * 16}px` }}>
                      {cat.children?.length > 0 && (
                        <button 
                          className="mr-2 focus:outline-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(cat.id);
                          }}
                        >
                          {cat.isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                      )}
                      {cat.name}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center text-sm">
                    <span className={getDiscountColor(cat.discount)}>{cat.discount}</span>
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-600 dark:text-gray-300">
                    {cat.totalSku}
                  </td>
                  <td className="px-4 py-2">
                    <div className="grid grid-cols-14 gap-1">{getMedianCells(cat.medianData)}</div>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTableRetail;
