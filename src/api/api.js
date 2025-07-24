import axios from 'axios';

const API_BASE_URL = 'https://pricescheck.ru/api/v1/'; // Замените на ваш базовый URL
const API_TOKEN = 'ETNRKX7hh0Sl';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Получение списка сетей
export const getSources = async (cityId) =>
  await api.get('/sources/list', {
    params: { city_id: cityId, token: API_TOKEN },
  });

// Получение списка городов
export const getCities = () =>
  api.get('/cities/list', {
    params: { token: API_TOKEN },
  });

// Получение списка категорий
export const getCategories = (cityId, sourceId) =>
  api.get('/categories/list', {
    params: { city_id: cityId, source_id: sourceId, token: API_TOKEN },
  });

// Получение списка товаров
export const getProducts = (cityId, sourceId, categoryId) =>
  api.get('/products/list', {
    params: { city_id: cityId, source_id: sourceId, category_id: categoryId, token: API_TOKEN },
  });