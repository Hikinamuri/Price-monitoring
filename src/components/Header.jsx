import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

import LogoImg from '../assets/logoImg.svg';
import LogoImgWhite from '../assets/logoImgWhite.svg';
import Logo from '../assets/logo.svg';
import LogoWhite from '../assets/logoWhite.svg';
import Moon from '../assets/moon.svg';
import Sun from '../assets/sun.svg';
import ProfileNight from '../assets/profile-night.svg';
import ProfileDay from '../assets/profile-light.svg';

const Header = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-[#F8F8F8] dark:bg-[#012F3A] transition-colors duration-200">
      <div className="min-w-9xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
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
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="transition-all duration-200 hover:scale-105"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <img src={ Sun } alt="" srcSet="" />
              ) : (
                <img src={ Moon } alt="" srcSet="" />
              )}
            </button>

            {/* User Icon */}
            <button className="transition-all duration-200 hover:scale-105">
              {isDark ? (
                <img src={ ProfileNight } alt="" srcSet="" />
              ) : (
                <img src={ ProfileDay} alt="" srcSet="" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;