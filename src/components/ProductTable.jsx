import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ProductTable = ({ products, onRowClick }) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const parsePrice = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  const analyzeChildrenPrices = (children, median) => {
    if (!children || !children.items || children.items.length === 0) {
      return { minPrice: 0, maxPrice: 0, deviation: 0, count: 0, networks: [], raw: [] };
    }

    const prices = children.items.map((child) => {
      const price = parsePrice(child.sale) > 0 ? parsePrice(child.sale) : parsePrice(child.current);
      return { 
        price, 
        network: child.resource?.brand?.name || child.resource?.name || 'Сеть',
        raw: child
      };
    });

    const minPrice = Math.min(...prices.map(p => p.price));
    const maxPrice = Math.max(...prices.map(p => p.price));
    const deviation = prices.length
      ? (prices.reduce((acc, p) => acc + (p.price - median), 0) / prices.length).toFixed(2)
      : 0;

    return {
      minPrice,
      maxPrice,
      deviation,
      count: children.items.length,
      networks: prices,
      raw: children.items,
    };
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortValue = (product) => {
    switch (sortField) {
      case 'name':
        return product.name?.toLowerCase() || '';
      case 'producer':
        return product.brand?.name?.toLowerCase() || '';
      case 'median':
        return parsePrice(product.mid_delta);
      case 'retailerDeviation':
        return parseFloat(analyzeChildrenPrices(product.children, parsePrice(product.mid_delta)).deviation);
      default:
        return 0;
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = getSortValue(a);
    const bValue = getSortValue(b);

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    } else {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
  });

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown className="h-4 w-4 opacity-30" />;
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4 text-blue-600" />
    ) : (
      <ChevronDown className="h-4 w-4 text-blue-600" />
    );
  };

  return (
    <div className="bg-white dark:bg-[#014252]  rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-[#014252] ">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">№</th>
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
              <th
                className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600/50 transition-colors"
                onClick={() => handleSort('median')}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>Медиана рынка</span>
                  <SortIcon field="median" />
                </div>
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Отклонение цены ретейлеров от медианы рынка и диапозон цен конкурентов
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-[#014252] divide-y divide-gray-200 dark:divide-slate-700">
            {sortedProducts.map((product, index) => {
              const median = parsePrice(product.mid_delta);
              const { minPrice, maxPrice, deviation, count, networks, raw } = analyzeChildrenPrices(product.children, median);

              const rangeDiff = maxPrice - minPrice || 1;
              const currentPercent = ((median - minPrice) / rangeDiff) * 100;

              const chartData = networks.map(n => ({
                name: n.network,
                value: n.price,
                color:
                  n.price <= minPrice + rangeDiff * 0.33 ? '#10b981' :
                  n.price <= minPrice + rangeDiff * 0.66 ? '#f59e0b' :
                  '#3b82f6'
              }));

              return (
                <tr
                  key={product.id || index}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition-all duration-200 group"
                  onClick={() => onRowClick && onRowClick(product.children?.items || [], product.name)}
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
                    <span className="text-sm text-gray-600 dark:text-gray-400">{product.brand?.name || '–'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center font-semibold text-gray-900 dark:text-white">
                    {median.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex flex-col items-center space-y-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Отклонение: {deviation}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Из {count} сетей</div>
                      <div className="w-full">
                        <div className="h-2 bg-gray-200 dark:bg-[#014252] rounded-full relative">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${((median - minPrice) / rangeDiff) * 100}%`,
                              backgroundColor:
                                ((median - minPrice) / rangeDiff) * 100 > 66
                                  ? '#ef4444'
                                  : ((median - minPrice) / rangeDiff) * 100 > 33
                                  ? '#f59e0b'
                                  : '#10b981',
                            }}
                          />
                          <div
                            className="absolute top-0 w-1 h-2 bg-gray-800 dark:bg-white rounded-full"
                            style={{
                              left: `${((median - minPrice) / rangeDiff) * 100}%`,
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>{minPrice.toFixed(0)}</span>
                          <span>{maxPrice.toFixed(0)}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;