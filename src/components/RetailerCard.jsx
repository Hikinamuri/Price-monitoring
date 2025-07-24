import React, { useState, useEffect } from 'react';

const RetailerCard = ({ retailer, onClick }) => {

    const getDynamicTriangle = (dynamic) => {
        if (dynamic === '-') return null; // No triangle for "-"
        const value = parseFloat(dynamic);
        if (isNaN(value)) return null; // Handle invalid numbers
        return value >= 0 ? (
            <span className="text-green-600 dark:text-green-400 text-xs ml-1">▲</span>
        ) : (
            <span className="text-red-600 dark:text-red-400 text-xs ml-1">▼</span>
        );
    };

    const [retailerName, setRetailerName] = useState('');

    // Color palette for dynamic assignment
    const colorPalette = [
        '#EA580C', // Orange (original)
        '#1D4ED8', // Blue
        '#15803D', // Green
        '#B91C1C', // Red
        '#7C3AED', // Purple
        '#C026D3', // Pink
        '#0E7490', // Cyan
        '#B45309', // Amber
    ];

    // Generate consistent color based on retailer ID
    const getRetailerColor = (id) => {
        const index = Math.abs(id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)) % colorPalette.length;
        return colorPalette[index];
    };

    useEffect(() => {
        setRetailerName(retailer.name.split('')[0]);
    }, [retailer.name]);

    const retailerColor = getRetailerColor(retailer.id);

    return (
        <div 
            onClick={() => onClick && onClick(retailer)}
            className="bg-white dark:bg-slate-800 rounded-[6px] p-[12px] px-[10px] shadow-sm hover:shadow-lg border border-[#D9D9D9] dark:border-slate-700 cursor-pointer transition-all duration-300 hover:scale-[1.02] group min-w-[250px] min-h-[140px]"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    {retailer.image ? (
                        <img
                            src={retailer.image}
                            alt={`${retailer.name} logo`}
                            className="w-10 h-10 rounded-lg object-contain"
                            onError={(e) => {
                                e.target.style.display = 'none'; // Hide broken image
                                e.target.nextSibling.style.display = 'flex'; // Show fallback
                            }}
                        />
                    ) : null}
                    <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: retailerColor, display: retailer.image ? 'none' : 'flex' }}
                    >
                        {retailerName}
                    </div>
                    <span className="pl-[5px] font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {retailer.name}
                    </span>
                </div>
            </div>

            {/* Stats */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-dark-500 dark:text-gray-400">
                        Среднее отклонение:
                    </span>
                    <span className={`font-semibold text-xs text-dark-600 dark:text-gray-400`}>
                        {retailer.deviation}%
                    </span>
                </div>
                
                <div className="flex items-center justify-between">
                    <span className="text-xs text-dark-400 dark:text-gray-400">
                        Динамика за 7 дней:
                    </span>
                    <div className="flex items-center">
                        <span className="text-xs font-medium text-dark-400 dark:text-gray-300">
                            {retailer.dynamic}
                        </span>
                        {getDynamicTriangle(retailer.dynamic)}
                    </div>
                </div>
                
                <div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-dark-500 dark:text-gray-500">
                            SKU: {retailer.totalSku}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RetailerCard;