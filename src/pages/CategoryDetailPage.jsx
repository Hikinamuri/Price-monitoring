import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import ProductTable from '../components/ProductTable';
import PriceChart from '../components/PriceChart';
import { categoryProducts, retailerStats, chartData, categories } from '../data/mockData';

const CategoryDetailPage = () => {
  const { retailerName, categorySlug } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [showChart, setShowChart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const retailerDisplayName = retailerName 
    ? retailerName.charAt(0).toUpperCase() + retailerName.slice(1)
    : 'Чижик';
    
  const categoryDisplayName = categorySlug
    ? categorySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Уход за телом и лицом';

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowChart(true);
  };

  const breadcrumbs = [
    { name: "Рейтинг ретейлеров", href: "/" },
    { name: retailerDisplayName, href: `/retailer/${retailerName}` },
    { name: categoryDisplayName, href: null }
  ];

  const stats = retailerStats.category;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
      <Header 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {crumb.href ? (
                <Link 
                  to={crumb.href}
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {crumb.name}
                </Link>
              ) : (
                <span className="text-gray-900 dark:text-white font-medium">
                  {crumb.name}
                </span>
              )}
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="h-4 w-4" />
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Page Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: '#eab308' }}
          >
            Ч
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {retailerDisplayName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Рейтинг ретейлеров › {retailerDisplayName} › {categoryDisplayName}
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            type="discount"
            value={stats.discount}
            label="Средняя относительная скидка"
          />
          <StatCard
            type="sku"
            value={stats.totalSku}
            label="Общее SKU товаров"
          />
          <StatCard
            type="percentage"
            value={stats.medianPercentage}
            label="% Ниже медианы"
          />
          <StatCard
            type="dynamic"
            value={stats.weekDynamic}
            label="Динамика за 7 дней"
          />
        </div>

        {/* Products Table */}
        <ProductTable 
          products={categoryProducts}
          onRowClick={handleProductClick}
        />

        {/* Price Chart Modal */}
        <PriceChart
          isOpen={showChart}
          onClose={() => setShowChart(false)}
          data={chartData}
          title={selectedProduct?.name}
        />

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              ООО «ДАТА КОМПАС»
            </div>
            <div className="flex space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                Политика конфиденциальности
              </a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                Соглашение
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CategoryDetailPage;