import React from 'react';
import { Moon, Sun, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

import LogoImg from '../assets/logoImg.svg';
import LogoImgWhite from '../assets/logoImgWhite.svg';
import Logo from '../assets/logo.svg';
import LogoWhite from '../assets/logoWhite.svg';

const Header = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 transition-colors duration-200">
      <div className="min-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-[30px] h-[30px] flex items-center justify-center">
              {isDark ? (
                <img src={LogoImgWhite} alt="White logo image" />
              ) : (
                <img src={LogoImg} alt="Default logo image" />
              )}
            </div>
            <div className="flex flex-col">
              {isDark ? (
                <img src={LogoWhite} alt="Price monitoring logo" />
              ) : (
                <img src={Logo} alt="Price monitoring logo" />
              )}
              
              <span className="text-xs text-gray-500 dark:text-gray-400">Мониторинг цен</span>
            </div>
          </div>

          {/* Search and Controls */}
          <div className="flex items-center space-x-4">
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