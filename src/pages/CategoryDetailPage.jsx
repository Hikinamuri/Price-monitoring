import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import { getCategories } from '../api/api';
import StatCard from '../components/StatCard';
import ProductTable from '../components/ProductTable';
import { useClickAway } from 'react-use';
import PriceChart from '../components/PriceChart';
import axios from 'axios';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://pricescheck.ru/api/v1';
const API_TOKEN = 'ETNRKX7hh0Sl';

const CategoryDetailPage = () => {
  const { retailerName, categorySlug } = useParams();
  const navigate = useNavigate();
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [retailerCategoryName, setRetailerCategoryName] = useState(null);
  const [retailerCategoryFullName, setRetailerCategoryFullName] = useState(null);
  const [retailerId, setRetailerId] = useState('');
  const [retailName, setRetailerName] = useState('');
  const [showChart, setShowChart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [isLoading, setIsLoading] = useState(true)
  const categoryRef = useRef(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);  

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

  const [stats, setStats] = useState({
    discount: 0,
    totalSku: 0,
    medianPercentage: 0,
    weekDynamic: 0,
  });

  // Заглушка: подставляем значения для параметров фильтра
  const filterCity = queryParams.get('city');
  const filterSource = queryParams.get('source');

  const retailerDisplayName = retailerName 
    ? retailName
    : ''

  const getRetailData = () => {
    if (retailerName) {
        setRetailerId(retailerName.split('_')[0])
        setRetailerName(retailerName.split('_')[1])
    }
  }

  const categoryDisplayName = retailerCategoryName

  const breadcrumbs = [
    { name: 'Рейтинг ритейлеров', href: '/' },
    { name: retailerDisplayName, href: `${retailerName ? `/retailer/${retailerId}` : ''}` },
    { name: categoryDisplayName, href: null },
  ];

    const getCategoryName = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/categories/get`, {
                params: {
                    token: API_TOKEN,
                    page: 1,
                    limit: 10,
                    category_id: categorySlug,
                },
            });
            setRetailerCategoryFullName(response.data.data.category.full_name)
            setRetailerCategoryName(response.data.data.category.name)
        } catch(err) {
            console.log('error', err)
        }
    }

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/products/list`, {
                params: {
                token: API_TOKEN,
                page: 1,
                limit: 20,
                filter_city: filterCity,
                category_id: categorySlug,
                filter_source: filterSource,
                },
            });
            console.log('filterCategory', categorySlug)
            if (response.data?.data) {
                setProducts(response.data.data.items);
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

  useClickAway(categoryRef, () => {
    setIsCategoryOpen(false);
  });
  useEffect(() => {
    fetchProducts();
    getCategoryName();
    getRetailData();
    fetchCategories();
  }, [filterCity, categorySlug, filterSource]);

  const [chartData, setChartData] = useState([]);

  const [selectedChartData, setSelectedChartData] = useState([]);
  const [selectedProductName, setSelectedProductName] = useState('');

  // const handleProductClick = (data, title) => {
  //   console.log('datadata', data)
  //   setChartData(data);
  //   setSelectedProduct({ name: title });
  //   setShowChart(true);
  // };

  const handleProductClick = (items, name) => {
    // console.log('datadata', items, name)
    // const parsedItems = items.map(child => {
    //   const price = parseFloat(child.sale) > 0 ? parseFloat(child.sale) : parseFloat(child.current);
    //   return {
    //     name: child.resource?.brand?.name || child.resource?.name || 'Сеть',
    //     value: price,
    //     color:
    //       price <= 100 ? '#10b981' :
    //       price <= 200 ? '#f59e0b' : '#3b82f6'
    //   };
    // });
    // console.log('parsedItems', parsedItems)

    setSelectedChartData(items);
    setSelectedProductName(name);
    setShowChart(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] dark:bg-[#012F3A] transition-colors duration-200">
      <Header selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

      <div className="mx-8 px-4 py-4 bg-white dark:bg-[#014252] rounded-[6px] mb-18">
        {/* Хлебные крошки */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {crumb && crumb.href ? (
                <>
                    <Link to={crumb.href} className="hover:text-gray-900 dark:hover:text-white transition-colors">
                        {crumb.name}
                    </Link>
                    {index < breadcrumbs.length - 1 && <ChevronRight className="h-4 w-4" />}
                </>
              ) : (
                crumb.name ? <span className="text-gray-900 dark:text-white font-medium">{crumb.name}</span> : null
                
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Заголовок */}
        <div className="mb-6 flex justify-between items-center bg-white dark:bg-[#014252]">
          <div className='flex justify-between items-center'>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: '#eab308' }}>
                {retailerDisplayName ? retailerDisplayName.split('')[0] : ''}
            </div>
            <div className='py-[5px] pl-[5px]'>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {retailerDisplayName}
                    </h1>
                <p className="text-gray-600 dark:text-gray-400">
                {/* Рейтинг ритейлеров › {retailerDisplayName ? `${retailerDisplayName} >` : null} {categoryDisplayName} */}
                {retailerCategoryFullName}
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

        {/* Статистика */}
        <div className="flex items-center justify-center gap-[20px] pb-[30px]">
          <StatCard type="discount" value={stats.discount} label="Средняя относительная скидка" />
          <StatCard type="sku" value={stats.totalSku} label="Общее SKU товаров" />
          <StatCard type="percentage" value={stats.medianPercentage} label="% Ниже медианы" />
          <StatCard type="dynamic" value={stats.weekDynamic} label="Динамика за 7 дней" />
        </div>

        {/* Таблица товаров */}
        {!isLoading && 
          <ProductTable products={products} onRowClick={handleProductClick} />      
        }

        {/* Модальное окно с графиком цен */}
        <PriceChart
          isOpen={showChart}
          onClose={() => setShowChart(false)}
          data={selectedChartData}
          title={selectedProductName}
        />


        <footer className="mt-16 py-8 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">ООО «ДАТА КОМПАС»</div>
            <div className="flex space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Политика конфиденциальности</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Соглашение</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CategoryDetailPage;