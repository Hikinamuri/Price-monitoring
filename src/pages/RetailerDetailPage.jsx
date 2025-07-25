import React, { useState, useEffect, useRef } from 'react';
import { useClickAway } from 'react-use';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import { getCategories } from '../api/api';
import StatCard from '../components/StatCard';
import CategoryTable from '../components/CategoryTable';
import { retailerCategories, retailerStats, categories } from '../data/mockData';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';
import LogoImg from '../assets/logoImg.svg';
import LogoImgWhite from '../assets/logoImgWhite.svg';
import Logo from '../assets/logo.svg';
import LogoWhite from '../assets/logoWhite.svg';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const API_BASE_URL = 'https://pricescheck.ru/api/v1';
const API_TOKEN = 'ETNRKX7hh0Sl';

const RetailerDetailPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  const { retailerName } = useParams();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [retailerId, setRetailerId] = useState('');
  const [retailName, setRetailername] = useState('');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filterCity = queryParams.get('city');
  const filterSource = queryParams.get('source');
  const categoryRef = useRef(null);
  const [categoryOptions, setCategoryOptions] = useState([]);  
  
  const retailerDisplayName = retailerName 
    ? retailName
    : '';

    const sanitizeText = (text) => {
        if (!text) return '';
        return text.replace(/&nbsp;|\u00A0|\s+/g, ' ').replace(/\.+/g, '').trim();
    };

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

  const handleCategoryClick = (category) => {
    // Navigate to category detail page
    const categorySlug = category.id;
    window.location.href = `/retailer/${retailerName}/category/${categorySlug}`;
  };
  const getRetailData = () => {
    setRetailerId(retailerName.split('_')[0])
    setRetailername(retailerName.split('_')[1])
  }
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

  const breadcrumbs = [
    { name: "Рейтинг ритейлеров", href: "/" },
    { name: retailerDisplayName, href: null }
  ];

    const stats = retailerStats.chizhik;

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/products/list`, {
                params: {
                    token: API_TOKEN,
                    page: 1,
                    limit: 20,
                    // filter_city: filterCity,
                    // category_id: categorySlug,
                    category_id: retailerId,
                },
            });
            console.log('response', response.data.data.items)
            if (response.data?.data) {
                // setProducts(response.data.data.items);
                console.log('response', response.data.data.items)
                // Пример статистики — вычисляется на основе товаров, если нужно
                setStats({
                discount: '12%',
                totalSku: response.data.data.items.length,
                medianPercentage: '54%',
                weekDynamic: '+3%',
                });
            }
            setIsLoading(false)
        } catch (error) {
            console.error('Ошибка при получении списка товаров:', error);
        }
    };
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

  useClickAway(categoryRef, () => {
    setIsCategoryOpen(false);
  });
  useEffect(() => {
    fetchProducts();
    getRetailData();
    fetchCategories();
  }, [filterSource]);

  return (
    <div className="min-h-screen bg-[#F8F8F8] dark:bg-[#012F3A] transition-colors duration-200">
      <Header 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      <div className="mx-8 px-4 py-4 bg-white dark:bg-[#014252] rounded-[6px] mb-18">
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
        <div className="mb-6 flex justify-between items-center bg-white dark:bg-[#014252]">
          <div className='flex justify-between items-center'>
            <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: '#eab308' }}
            >
                {retailerDisplayName ? retailerDisplayName.split('')[0] : ''}
            </div>
            <div className='py-[5px] pl-[5px]'>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {retailerDisplayName}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                Рейтинг ритейлеров › {retailerDisplayName}
                </p>
            </div>
          </div>
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
            
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="flex items-center justify-center gap-[20px] pb-[30px]">
          <StatCard type="discount" value={stats.discount} label="Среднее отклонение" />
          <StatCard type="sku" value={stats.totalSku} label="Общее SKU" />
          <StatCard type="percentage" value={stats.medianPercentage} label="% Ниже медианы" />
          <StatCard type="dynamic" value={stats.weekDynamic} label="Динамика за 7 дней" />
        </div>

        {/* Categories Table */}
        <CategoryTable 
          categories={retailerCategories}
          onRowClick={handleCategoryClick}
          title="Динамика медиан"
        />

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

export default RetailerDetailPage;