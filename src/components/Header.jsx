import React from 'react';
import { Search, Moon, Sun, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { categories } from '../data/mockData';

const Header = ({ selectedCategory, onCategoryChange }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 dark:text-white text-lg">PRICESCHECK</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">мониторинг цен</span>
            </div>
          </div>

          {/* Search and Controls */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Поиск"
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 transition-colors duration-200"
              />
            </div>

            {/* Category Selector */}
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-200 hover:scale-105"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>

            {/* User Icon */}
            <button className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-200 hover:scale-105">
              <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;