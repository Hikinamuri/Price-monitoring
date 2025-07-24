import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import RetailerCard from '../components/RetailerCard';
import StatCard from '../components/StatCard';
import { getCities } from '../api/api';
import { getSources } from '../api/api';
import { getCategories } from '../api/api';
import { Search } from 'lucide-react';


// Function to decode HTML entities and sanitize text
const sanitizeText = (text) => {
  if (!text) return '';
  // Replace &nbsp; with empty string and trim
  return text.replace(/&nbsp;/g, '').trim();
};

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [retailers, setRetailers] = useState([]);
  const [statistics, setStatistics] = useState({
    discount: '0%',
    totalSku: 0,
    medianPercentage: '0%',
    weekDynamic: '-'
  });
  const [selectedCity, setSelectedCity] = useState('Москва');
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [categoryStack, setCategoryStack] = useState([]);
  const navigate = useNavigate();

  // Function to fetch retailers with cityId
  const fetchRetailersByCity = async (cityId) => {
    try {
      const response = await getSources(cityId);
      console.log('Retailer response:', response);
      const mappedRetailers = response.data.data.items.map(item => ({
        id: item.id,
        name: item.name,
        image: item.image,
        totalSku: item.sum,
        deviation: item.sum_delta,
        dynamic: '-',
        productsLink: item.products_link
      }));

      const stats = {
        discount: `${(response.data.data.items.reduce((sum, item) => sum + (item.sum_delta || 0), 0) / response.data.data.items.length).toFixed(1)}%`,
        totalSku: response.data.data.items.reduce((sum, item) => sum + (item.sum || 0), 0),
        medianPercentage: '0%',
        weekDynamic: '-'
      };

      setRetailers(mappedRetailers);
      setStatistics(stats);
      if (mappedRetailers.length > 0) {
        await fetchCategories(cityId, mappedRetailers[0].id);
      }
    } catch (error) {
      console.error('Error fetching retailers:', error);
    }
  };

  // Function to fetch categories with cityId and sourceId
  const fetchCategories = async (cityId, sourceId, parentId = null) => {
    try {
      const response = await getCategories(cityId, sourceId);
      console.log('Category response:', response);

      // Check if data exists and convert to array, filtering out null values
      let categoriesData = response.data?.data;
      if (!categoriesData || typeof categoriesData !== 'object') {
        console.error('Invalid category data:', categoriesData);
        setCategoryOptions([]);
        return;
      }
      const categoriesArray = Object.values(categoriesData).filter(cat => cat !== null && cat !== undefined && typeof cat === 'object');

      if (categoriesArray.length === 0) {
        console.warn('No valid category data found:', categoriesData);
        setCategoryOptions([]);
        return;
      }

      const buildCategoryOptions = (categoriesData) => {
        const options = [];
        const relevantCategories = categoriesData.map(cat => {
          const catResponse = parentId
            ? Object.values(cat).filter(c => c.pid === parentId)
            : Object.values(cat).filter(c => c.level === '1' || c.level === 1);
          return catResponse;
        });
        console.log('Relevant categories:', relevantCategories); // Debug the filtered result

        // Flatten and process all relevant categories
        relevantCategories.forEach(catArray => {
          catArray.forEach(cat => {
            console.log('cat raw data:', cat); // Debug raw category data
            if (!cat.level) {
              console.warn('Category missing level:', cat);
              return; // Skip invalid categories
            }
            // Sanitize display name to remove &nbsp; and trim
            const sanitizeText = (text) => {
                if (!text) return '';
                
                // 1. Заменяем все варианты пробелов (включая HTML-сущности и Unicode)
                let cleaned = text.replace(/&nbsp;|\u00A0|\s+/g, ' ');
                
                // 2. Удаляем точки, которые могли появиться из-за предыдущих обработок
                cleaned = cleaned.replace(/\.+/g, '');
                
                // 3. Убираем лишние пробелы
                cleaned = cleaned.trim();
                
                return cleaned;
                };

                // Использование:
                const displayName = sanitizeText(cat.children_titles || cat.name);
                options.push({
                id: cat.id,
                name: displayName,
                level: cat.level,
                hasChildren: cat.has_children === true
            });

            // Add second-level categories when at top level
            if (!parentId && cat.has_children) {
              const allValues = categoriesData.map(c => Object.values(c)).flat();
              const children = allValues.filter(child => child.pid === cat.id);
              children.forEach(child => {
                if (!child.level) {
                  console.warn('Child category missing level:', child);
                  return;
                }
                const childDisplayName = sanitizeText(child.children_titles || child.name);
                options.push({ id: child.id, name: `${displayName} > ${childDisplayName}`, level: child.level, hasChildren: child.has_children === true });
              });
            }
          });
        });
        return options;
      };
      const newCategoryOptions = buildCategoryOptions(categoriesArray);
      setCategoryOptions(newCategoryOptions);
      if (newCategoryOptions.length > 0 && !selectedCategory) {
        setSelectedCategory(newCategoryOptions[0].name);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch cities
        const citiesResponse = await getCities('/cities/list');
        const cityList = citiesResponse.data.data.items.map(city => ({
          id: city.id,
          name: city.name
        }));
        setCities(cityList);
        const defaultCity = cityList.find(city => city.name === 'Москва');
        if (defaultCity) setSelectedCity(defaultCity.name);

        // Initial fetch of retailers and categories with default city
        const currentCity = cityList.find(city => city.name === selectedCity);
        const cityId = currentCity ? currentCity.id : cityList.find(city => city.name === 'Москва').id;
        await fetchRetailersByCity(cityId);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Re-fetch retailers and categories when selectedCity changes
    const currentCity = cities.find(city => city.name === selectedCity);
    if (currentCity) {
      setLoading(true);
      setCurrentCategoryId(null); // Reset to top level
      setCategoryStack([]);
      fetchRetailersByCity(currentCity.id).then(() => setLoading(false));
    }
  }, [selectedCity]);

  const handleCategoryChange = (e) => {
    const newCategory = categoryOptions.find(cat => cat.name === e.target.value);
    if (newCategory) {
      setSelectedCategory(newCategory.name);
      setCurrentCategoryId(newCategory.id);
      if (newCategory.hasChildren) {
        setCategoryStack([...categoryStack, { id: currentCategoryId, name: selectedCategory }]);
        fetchCategories(cities.find(city => city.name === selectedCity).id, retailers[0]?.id, newCategory.id);
      } else {
        // Navigate to product page for leaf category
        navigate(`/category/${newCategory.id}`);
      }
    }
  };

  const handleBack = () => {
    if (categoryStack.length > 0) {
      const parent = categoryStack.pop();
      setCategoryStack([...categoryStack]);
      setCurrentCategoryId(parent.id);
      setSelectedCategory(parent.name);
      fetchCategories(cities.find(city => city.name === selectedCity).id, retailers[0]?.id, parent.id);
    } else {
      setCurrentCategoryId(null);
      setSelectedCategory('');
      fetchCategories(cities.find(city => city.name === selectedCity).id, retailers[0]?.id);
    }
  };

  const handleRetailerClick = (retailer) => {
    navigate(`/retailer/${retailer.name.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
      <Header />
      
      <div className="min-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Рейтинг ритейлеров
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Поиск"
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 transition-colors duration-200"
              />
            </div>

            {/* Category Selector */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 w-64"
                disabled={loading}
              >
                {categoryOptions.map((category, index) => (
                  <option key={index} value={category.name} disabled={!category.hasChildren && categoryStack.length === 0}>
                    {category.name}
                  </option>
                ))}
              </select>
              {categoryStack.length > 0 && (
                <button
                  onClick={handleBack}
                  className="ml-2 px-3 py-1 bg-gray-200 dark:bg-slate-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors"
                >
                  Назад
                </button>
              )}
            </div>

            {/* City Filter */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            >
              {cities.map((city, index) => (
                <option key={index} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Statistics Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            label="Процент товаров с низких медианами"
          />
          <StatCard
            type="dynamic"
            value={statistics.weekDynamic}
            label="Динамика изменения за последние 7 дней"
          />
        </div> */}

        {/* Retailers Grid */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[200px] text-center text-gray-600 dark:text-gray-400">
            Загрузка...
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
            {retailers.map((retailer) => (
              <RetailerCard
                key={retailer.id}
                retailer={retailer}
                onClick={handleRetailerClick}
              />
            ))}
          </div>
        )}

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