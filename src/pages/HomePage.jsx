import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import RetailerCard from '../components/RetailerCard';
import StatCard from '../components/StatCard';
import { retailers, statistics, categories } from '../data/mockData';

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const navigate = useNavigate();

  const handleRetailerClick = (retailer) => {
    // Navigate to retailer detail page
    navigate(`/retailer/${retailer.name.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
      <Header 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Рейтинг ретейлеров
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Анализ цен и скидок по различным категориям товаров
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            type="discount"
            value={statistics.discount}
            label="Средняя относительная скидка по всем товарам"
          />
          <StatCard
            type="sku"
            value={statistics.totalSku}
            label="Общее SKU товаров в категории"
          />
          <StatCard
            type="percentage"
            value={statistics.medianPercentage}
            label="Процент товаров с низкими медианами"
          />
          <StatCard
            type="dynamic"
            value={statistics.weekDynamic}
            label="Динамика изменения за последние 7 дней"
          />
        </div>

        {/* Retailers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {retailers.map((retailer) => (
            <RetailerCard
              key={retailer.id}
              retailer={retailer}
              onClick={handleRetailerClick}
            />
          ))}
        </div>

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

export default HomePage;