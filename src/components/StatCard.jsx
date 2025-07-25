import React from 'react';
import Frame1 from '../assets/Frame 70.svg';
import Frame2 from '../assets/Frame 70-1.svg';
import Frame3 from '../assets/Frame 70-2.svg';
import Frame4 from '../assets/Frame 70-3.svg';
import Frame1d from '../assets/Frame 70-d.svg';
import Frame2d from '../assets/Frame 70-1-d.svg';
import Frame3d from '../assets/Frame 70-2-d.svg';
import Frame4d from '../assets/Frame 70-3-d.svg';
import { useTheme } from '../contexts/ThemeContext';


const StatCard = ({ type, value, label }) => {
  const { isDark } = useTheme();
  
  const getIcon = () => {
    if (isDark) {
      switch (type) {
        case 'discount':
          return <img src={ Frame1d } alt="" srcSet="" />
        case 'sku':
          return <img src={ Frame2d } alt="" srcSet="" />
        case 'percentage':
          return <img src={ Frame3d } alt="" srcSet="" />
        case 'dynamic':
          return <img src={ Frame4d } alt="" srcSet="" />
        default:
          return null;
    }} else {
      switch (type) {
        case 'discount':
          return <img src={ Frame1 } alt="" srcSet="" />
        case 'sku':
          return <img src={ Frame2 } alt="" srcSet="" />
        case 'percentage':
          return <img src={ Frame3 } alt="" srcSet="" />
        case 'dynamic':
          return <img src={ Frame4 } alt="" srcSet="" />
        default:
          return null;
    }}
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
    <div className="
        bg-white dark:bg-[#014252] rounded-[6px]
        p-[10px] border border-gray-200 dark:border-[#80A1A9] 
        hover:shadow-lg transition-all duration-300 group min-w-[200px] min-h-[100px]">
      <div className="flex justify-between items-center space-x-3 mb-2">
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