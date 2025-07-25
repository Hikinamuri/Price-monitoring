// Mock data for PricesCheck application

export const retailers = [
  {
    id: 1,
    name: "FixPrice",
    icon: "F",
    iconBg: "#2563eb",
    discount: "-18.3%",
    dateRange: "Действует до 7 дней",
    rating: "-6.6",
    sku: "602"
  },
  {
    id: 2,
    name: "Чижик", 
    icon: "Ч",
    iconBg: "#eab308",
    discount: "-18.3%",
    dateRange: "Действует до 7 дней",
    rating: "-0.3",
    sku: "602"
  },
  {
    id: 3,
    name: "Подружка",
    icon: "П",
    iconBg: "#6b7280",
    discount: "-18.3%",
    dateRange: "Действует до 7 дней",
    rating: "-0.6",
    sku: "602"
  },
  {
    id: 4,
    name: "КрасноеБелое",
    icon: "КБ",
    iconBg: "#dc2626",
    discount: "-18.3%",
    dateRange: "Действует до 7 дней",
    rating: "+0.3",
    sku: "602"
  }
];

export const statistics = {
  discount: "-18.3%",
  totalSku: 602,
  medianPercentage: "25%",
  weekDynamic: "-0.6%"
};

// Categories within a retailer
export const retailerCategories = [
  {
    id: '9ea28897-29a6-3746-cac9-af2e8c0b1593',
    name: "Прочее для окраски волос",
    discount: "-6.0%",
    weekDynamic: "0.0",
    totalSku: 0,
    medianData: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  {
    id: '1e854879-36ff-7f40-7926-5cca64ddf343',
    name: "Ополаскиватель для полости рта",
    discount: "-22.8%",
    weekDynamic: "+1.0",
    totalSku: 1,
    medianData: [0, 5, 2, 2, 4, 2, 9, 2, 2, 0, 0, 0, 0, 0]
  },
  {
    id: '49b54d00-aefc-2a5a-f59d-4352a8ab1d1d',
    name: "Полотенца",
    discount: "-13.8%",
    weekDynamic: "+2.6",
    totalSku: 26,
    medianData: [1, 1, 2, 4, 5, 11, 2, 1, 1, 0, 0, 0, 0, 0]
  },
  {
    id: '368c0f8f-06d8-80a5-3eae-3cba5f68b624',
    name: "Салфетки",
    discount: "-17.1%",
    weekDynamic: "0.0",
    totalSku: 26,
    medianData: [2, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0]
  },
  {
    id: 'ce8f964b-a690-20db-d847-e89cf9ebea36',
    name: "Салфетки влажные",
    discount: "-15.5%",
    weekDynamic: "0.0",
    totalSku: 6,
    medianData: [0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0]
  },
  {
    id: '36fa0bb7-21b9-c2af-8b07-d2d74538381c',
    name: "Антисептик для рук",
    discount: "-33.6%",
    weekDynamic: "0.0",
    totalSku: 4,
    medianData: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
];

// Products within a category
export const categoryProducts = [
  {
    id: '9ea28897-29a6-3746-cac9-af2e8c0b1593',
    name: "Прочее для окраски волос",
    producer: "Buyup",
    minPrice: 59.00,
    maxPrice: 59.00,
    currentPrice: 58.00,
    discount: "-40.4%",
    priceRange: { min: 58.00, max: 149.00, current: 58.00 }
  },
  {
    id: '1e854879-36ff-7f40-7926-5cca64ddf343',
    name: "Ополаскиватель для полости рта",
    producer: "Buyup",
    minPrice: 59.00,
    maxPrice: 59.00, 
    currentPrice: 127.00,
    discount: "-40.4%",
    priceRange: { min: 127.00, max: 319.00, current: 127.00 }
  },
  {
    id: '49b54d00-aefc-2a5a-f59d-4352a8ab1d1d',
    name: "Полотенца",
    producer: "Buyup",
    minPrice: 59.00,
    maxPrice: 59.00,
    currentPrice: 43.50,
    discount: "-40.4%",
    priceRange: { min: 43.50, max: 87.00, current: 43.50 }
  },
  {
    id: '368c0f8f-06d8-80a5-3eae-3cba5f68b624',
    name: "Салфетки",
    producer: "Buyup",
    minPrice: 59.00,
    maxPrice: 59.00,
    currentPrice: 79.50,
    discount: "-40.4%",
    priceRange: { min: 79.50, max: 99.00, current: 79.50 }
  },
  {
    id: 'ce8f964b-a690-20db-d847-e89cf9ebea36',
    name: "Салфетки влажные",
    producer: "Buyup",
    minPrice: 59.00,
    maxPrice: 59.00,
    currentPrice: 102.50,
    discount: "-40.4%",
    priceRange: { min: 102.50, max: 220.00, current: 102.50 }
  },
  {
    id: '36fa0bb7-21b9-c2af-8b07-d2d74538381c',
    name: "Антисептик для рук",
    producer: "Buyup",
    minPrice: 59.00,
    maxPrice: 59.00,
    currentPrice: 63.00,
    discount: "-40.4%",
    priceRange: { min: 63.00, max: 179.00, current: 63.00 }
  }
];

// Chart data for price comparison across retailers
export const chartData = [
  { name: "Wildberries Разное", value: 149.99, color: "#3b82f6" },
  { name: "Авито", value: 146.99, color: "#3b82f6" },
  { name: "Globus", value: 146.99, color: "#3b82f6" },
  { name: "Верный", value: 139.99, color: "#3b82f6" },
  { name: "Магнолия", value: 99.99, color: "#3b82f6" },
  { name: "Метро", value: 99.90, color: "#eab308" },
  { name: "О'кей", value: 79.99, color: "#f59e0b" },
  { name: "Лента Гипер", value: 79.99, color: "#f59e0b" },
  { name: "Яркие!", value: 79.99, color: "#f59e0b" },
  { name: "Магнит Косметик", value: 79.99, color: "#f59e0b" },
  { name: "Яндекс Лавка", value: 76.00, color: "#3b82f6" },
  { name: "Fix Price", value: 59.00, color: "#10b981" }
];

export const categories = [
  "Все категории",
  "Продукты питания", 
  "Бытовая химия",
  "Косметика",
  "Товары для дома",
  "Детские товары"
];

export const breadcrumbs = {
  retailer: [
    { name: "Рейтинг ритейлеров", href: "/" },
    { name: "Чижик", href: null }
  ],
  category: [
    { name: "Рейтинг ритейлеров", href: "/" },
    { name: "Чижик", href: "/retailer/чижик" },
    { name: "Уход за телом и лицом", href: null }
  ]
};

export const retailerStats = {
  chizhik: {
    discount: "-18.3%",
    totalSku: 602,
    medianPercentage: "25%", 
    weekDynamic: "-0.6%"
  },
  category: {
    discount: "-22.8%",
    totalSku: 8,
    medianPercentage: "25%",
    weekDynamic: "+1.0%"
  }
};