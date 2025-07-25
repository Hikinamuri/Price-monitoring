import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClickAway } from 'react-use';
import { Search } from 'lucide-react';

import Header from '../components/Header';
import RetailerCard from '../components/RetailerCard';
import { getCities, getSources, getCategories } from '../api/api';
import LogoImg from '../assets/logoImg.svg';
import LogoImgWhite from '../assets/logoImgWhite.svg';
import Logo from '../assets/logo.svg';
import LogoWhite from '../assets/logoWhite.svg';
import { useTheme } from '../contexts/ThemeContext';


// Удаление лишних пробелов, точек и т.д.
const sanitizeText = (text) => {
  if (!text) return '';
  return text.replace(/&nbsp;|\u00A0|\s+/g, ' ').replace(/\.+/g, '').trim();
};

// Построение дерева категорий из flat-списка
const buildCategoryTree = (flatList, parentId = null) => {
  return flatList
    .filter(cat => cat.pid === parentId)
    .map(cat => ({
      id: cat.id,
      name: sanitizeText(cat.children_titles || cat.name),
      hasChildren: cat.has_children === true,
      children: buildCategoryTree(flatList, cat.id)
    }));
};

// Компонент для отображения дерева категорий
const CategoryTree = ({ categories, onSelect }) => {
  const [openIds, setOpenIds] = useState([]);

  const toggleOpen = (id) => {
    setOpenIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <ul className="pl-2 text-sm space-y-1">
      {categories.map(cat => (
        <li key={cat.id}>
          <div
            onClick={() => cat.hasChildren ? toggleOpen(cat.id) : onSelect(cat)}
            className="cursor-pointer flex items-center space-x-1 hover:underline text-gray-800 dark:text-gray-100"
          >
            {cat.hasChildren && (
              <span className="text-xs">
                {openIds.includes(cat.id) ? '▼' : '▶'}
              </span>
            )}
            <span>{cat.name}</span>
          </div>
          {cat.hasChildren && openIds.includes(cat.id) && cat.children.length > 0 && (
            <CategoryTree categories={cat.children} onSelect={onSelect} />
          )}
        </li>
      ))}
    </ul>
  );
};


const HomePage = () => {
  const { isDark } = useTheme();
  const [selectedCity, setSelectedCity] = useState('Москва');
  const [cities, setCities] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const navigate = useNavigate();
  const categoryRef = useRef(null);

  useClickAway(categoryRef, () => {
    setIsCategoryOpen(false);
  });

  const fetchRetailersByCity = async (cityId) => {
    try {
      const response = await getSources(cityId);
      const mappedRetailers = response.data.data.items.map(item => ({
        id: item.id,
        name: item.name,
        image: item.image,
        totalSku: item.sum,
        deviation: item.sum_delta,
        dynamic: '-',
        productsLink: item.products_link
      }));

      setRetailers(mappedRetailers);

      if (mappedRetailers.length > 0) {
        await fetchCategories(cityId, mappedRetailers[0].id);
      }
    } catch (error) {
      console.error('Error fetching retailers:', error);
    }
  };

  const fetchCategories = async (cityId, sourceId) => {
    try {
      const response = await getCategories(cityId, sourceId);
      const rawData = response.data?.data;

      if (!rawData) return;

      const allValues = Object.values(rawData)
        .filter(v => v && typeof v === 'object')
        .map(c => Object.values(c))
        .flat();

      const tree = buildCategoryTree(allValues);
      setCategoryOptions(tree);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const citiesResponse = await getCities('/cities/list');
        const cityList = citiesResponse.data.data.items.map(city => ({
          id: city.id,
          name: city.name
        }));

        setCities(cityList);

        const selected = cityList.find(city => city.name === selectedCity) || cityList[0];
        setSelectedCity(selected.name);

        await fetchRetailersByCity(selected.id);
        setLoading(false);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const currentCity = cities.find(city => city.name === selectedCity);
    if (currentCity) {
      setLoading(true);
      fetchRetailersByCity(currentCity.id).then(() => setLoading(false));
    }
  }, [selectedCity]);

  const handleRetailerClick = (retailer) => {
    navigate(`/retailer/${retailer.id}_${retailer.name}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] dark:bg-[#012F3A] transition-colors duration-200">
      <Header />

      <div className="mx-8 px-4 py-4 bg-white dark:bg-[#014252] rounded-[6px] mb-18">
        {/* Заголовок */}
        <div className="mb-8 flex justify-between items-center bg-white dark:bg-[#014252]">
          <h1 className="text-3xl font-bold text-gray-900 dark:bg-[#014252] dark:text-white mb-2">
            Рейтинг ритейлеров
          </h1>

          {/* Поиск + Категории + Города */}
          <div className="flex flex-wrap items-start gap-4 relative z-10 my-auto">
            {/* Поиск */}
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск"
                className="pl-4 pr-10 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-[#80A1A9] text-black dark:text-black placeholder-black dark:placeholder-black focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 transition-colors duration-200"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black h-4 w-4"/>
            </div>

            {/* Категории - Dropdown */}
            <div className="relative" ref={categoryRef}>
              <button
                onClick={() => setIsCategoryOpen(prev => !prev)}
                className="px-4 py-2 border border-gray-300 h-[42px] dark:border-slate-600 rounded-lg bg-white dark:bg-[#014252] text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#014252] transition-colors"
              >
                Категории
              </button>

              {isCategoryOpen && (
                <div className="absolute left-0 mt-2 w-72 max-h-[300px] overflow-y-auto bg-white dark:bg-[#014252] border border-gray-300 dark:border-slate-600 rounded-lg shadow-lg p-3 z-20">
                  <h2 className="text-sm font-medium mb-2 text-gray-700 dark:text-white">
                    Выберите категорию
                  </h2>
                  {categoryOptions.length > 0 ? (
                    <CategoryTree
                      categories={categoryOptions}
                      onSelect={(category) => {
                        console.log('category', category)
                        setIsCategoryOpen(false);
                        navigate(`/category/${category.id}`);
                      }}
                    />
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Категории не найдены</p>
                  )}
                </div>
              )}
            </div>

            {/* Город */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-2 h-[42px] border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-[#014252] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            >
              {cities.map((city, index) => (
                <option key={index} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ритейлеры */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[200px] text-center text-gray-600 dark:text-gray-400">
            Загрузка...
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-[10px] ">
            {retailers.map((retailer) => (
              <RetailerCard
                key={retailer.id}
                retailer={retailer}
                onClick={handleRetailerClick}
              />
            ))}
          </div>
        )}

      </div>
      <footer className="py-8 mx-8 bg-[#F8F8F8] dark:bg-[#012F3A]">
          <div className="flex flex-col justify-between">
            <div className="flex items-center space-x-2 pb-6">
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
            <div className="text-sm text-gray-500 dark:text-gray-400 pb-2">
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
  );
};

export default HomePage;
