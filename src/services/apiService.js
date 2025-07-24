import axios from 'axios';

const API_TOKEN = 'ETNRKX7hh0Sl';
const API_BASE_URL = 'https://pricescheck.ru/api/v1/'; // Replace with actual API URL

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// API Service methods
export const apiService = {
  // Get list of cities
  getCities: async () => {
    try {
      const response = await apiClient.get('/cities/list');
      return response.data;
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
  },

  // Get list of sources (retailers)
  getSources: async (cityId = null) => {
    try {
      const params = cityId ? { city_id: cityId } : {};
      const response = await apiClient.get('/sources/list', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching sources:', error);
      throw error;
    }
  },

  // Get categories
  getCategories: async (cityId = null, sourceId = null, parentId = null) => {
    try {
      const params = {};
      if (cityId) params.city_id = cityId;
      if (sourceId) params.source_id = sourceId;
      if (parentId) params.parent_id = parentId;
      
      const response = await apiClient.get('/categories/list', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get products
  getProducts: async (cityId, sourceId, categoryId) => {
    try {
      const params = {
        city_id: cityId,
        source_id: sourceId,
        category_id: categoryId
      };
      const response = await apiClient.get('/products/list', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
};

// Mock data fallback for development
export const mockApiService = {
  getCities: async () => {
    return {
      data: [
        { id: 1, name: "Москва" },
        { id: 2, name: "Санкт-Петербург" },
        { id: 3, name: "Новосибирск" },
        { id: 4, name: "Екатеринбург" },
        { id: 5, name: "Казань" }
      ]
    };
  },

  getSources: async () => {
    return {
      data: [
        {
          id: 1,
          name: "FixPrice",
          image: "F",
          sum: 602,
          sum_delta: -18.3
        },
        {
          id: 2,
          name: "Чижик",
          image: "Ч", 
          sum: 602,
          sum_delta: -18.3
        },
        {
          id: 3,
          name: "Подружка",
          image: "П",
          sum: 602,
          sum_delta: -18.3
        },
        {
          id: 4,
          name: "КрасноеБелое",
          image: "КБ",
          sum: 602,
          sum_delta: -18.3
        }
      ]
    };
  },

  getCategories: async (cityId, sourceId, parentId) => {
    // Return top-level categories if no parentId
    if (!parentId) {
      return {
        data: [
          { id: 1, name: "Хлеб и выпечка", pid: null, level: 1 },
          { id: 2, name: "Уход за телом и лицом", pid: null, level: 1 },
          { id: 3, name: "Уход за полостью рта", pid: null, level: 1 },
          { id: 4, name: "Товары для дома", pid: null, level: 1 },
          { id: 5, name: "Бытовая химия", pid: null, level: 1 }
        ]
      };
    }
    
    // Return subcategories
    return {
      data: [
        { id: 21, name: "Крем для лица", pid: 2, level: 2 },
        { id: 22, name: "Шампуни", pid: 2, level: 2 },
        { id: 23, name: "Мыло", pid: 2, level: 2 }
      ]
    };
  },

  getProducts: async () => {
    return {
      data: [
        {
          id: 1,
          name: "Туалетное крем-мыло для лица и тела Caring cream bar, DURU, 90г",
          mid_delta: -40.4,
          brand: { name: "DURU" },
          children: [
            {
              id: 1,
              current: 59.00,
              sale: 58.00,
              mid_delta: -40.4,
              resource: { name: "Buyup" },
              count: 12
            }
          ]
        }
      ]
    };
  }
};

// Use mock service for development, real service for production
export default process.env.NODE_ENV === 'development' ? mockApiService : apiService;