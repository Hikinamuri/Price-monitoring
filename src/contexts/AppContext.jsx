import React, { createContext, useContext, useReducer, useEffect } from 'react';
import apiService from '../services/apiService';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_CITIES: 'SET_CITIES',
  SET_SELECTED_CITY: 'SET_SELECTED_CITY',
  SET_SOURCES: 'SET_SOURCES',
  SET_SELECTED_SOURCE: 'SET_SELECTED_SOURCE',
  SET_CATEGORIES: 'SET_CATEGORIES',
  SET_CATEGORY_BREADCRUMBS: 'SET_CATEGORY_BREADCRUMBS',
  SET_CURRENT_CATEGORY: 'SET_CURRENT_CATEGORY',
  SET_PRODUCTS: 'SET_PRODUCTS',
  RESET_CATEGORY_NAVIGATION: 'RESET_CATEGORY_NAVIGATION'
};

// Initial state
const initialState = {
  loading: false,
  error: null,
  cities: [],
  selectedCity: null,
  sources: [],
  selectedSource: null,
  categories: [],
  categoryBreadcrumbs: [],
  currentCategory: null,
  products: []
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case actionTypes.SET_CITIES:
      return { ...state, cities: action.payload };
    case actionTypes.SET_SELECTED_CITY:
      return { ...state, selectedCity: action.payload };
    case actionTypes.SET_SOURCES:
      return { ...state, sources: action.payload };
    case actionTypes.SET_SELECTED_SOURCE:
      return { ...state, selectedSource: action.payload };
    case actionTypes.SET_CATEGORIES:
      return { ...state, categories: action.payload };
    case actionTypes.SET_CATEGORY_BREADCRUMBS:
      return { ...state, categoryBreadcrumbs: action.payload };
    case actionTypes.SET_CURRENT_CATEGORY:
      return { ...state, currentCategory: action.payload };
    case actionTypes.SET_PRODUCTS:
      return { ...state, products: action.payload };
    case actionTypes.RESET_CATEGORY_NAVIGATION:
      return { 
        ...state, 
        categories: [], 
        categoryBreadcrumbs: [], 
        currentCategory: null,
        products: []
      };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load cities on app start
  useEffect(() => {
    loadCities();
  }, []);

  // Load sources when city changes
  useEffect(() => {
    if (state.selectedCity) {
      loadSources(state.selectedCity.id);
    }
  }, [state.selectedCity]);

  // API calls
  const loadCities = async () => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      const response = await apiService.getCities();
      dispatch({ type: actionTypes.SET_CITIES, payload: response.data });
      
      // Auto-select Moscow as default
      const moscow = response.data.find(city => city.name === 'Москва');
      if (moscow) {
        dispatch({ type: actionTypes.SET_SELECTED_CITY, payload: moscow });
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: actionTypes.SET_LOADING, payload: false });
    }
  };

  const loadSources = async (cityId) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      const response = await apiService.getSources(cityId);
      dispatch({ type: actionTypes.SET_SOURCES, payload: response.data });
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: actionTypes.SET_LOADING, payload: false });
    }
  };

  const loadCategories = async (sourceId, parentId = null) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      const response = await apiService.getCategories(
        state.selectedCity?.id, 
        sourceId, 
        parentId
      );
      dispatch({ type: actionTypes.SET_CATEGORIES, payload: response.data });
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: actionTypes.SET_LOADING, payload: false });
    }
  };

  const loadProducts = async (sourceId, categoryId) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      const response = await apiService.getProducts(
        state.selectedCity?.id,
        sourceId,
        categoryId
      );
      dispatch({ type: actionTypes.SET_PRODUCTS, payload: response.data });
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: actionTypes.SET_LOADING, payload: false });
    }
  };

  // Actions
  const selectCity = (city) => {
    dispatch({ type: actionTypes.SET_SELECTED_CITY, payload: city });
    dispatch({ type: actionTypes.RESET_CATEGORY_NAVIGATION });
  };

  const selectSource = (source) => {
    dispatch({ type: actionTypes.SET_SELECTED_SOURCE, payload: source });
    dispatch({ type: actionTypes.RESET_CATEGORY_NAVIGATION });
  };

  const navigateToCategory = (category) => {
    const newBreadcrumbs = [...state.categoryBreadcrumbs, category];
    dispatch({ type: actionTypes.SET_CATEGORY_BREADCRUMBS, payload: newBreadcrumbs });
    dispatch({ type: actionTypes.SET_CURRENT_CATEGORY, payload: category });
    loadCategories(state.selectedSource?.id, category.id);
  };

  const navigateBackToCategory = (categoryIndex) => {
    const newBreadcrumbs = state.categoryBreadcrumbs.slice(0, categoryIndex + 1);
    const targetCategory = newBreadcrumbs[newBreadcrumbs.length - 1];
    
    dispatch({ type: actionTypes.SET_CATEGORY_BREADCRUMBS, payload: newBreadcrumbs });
    dispatch({ type: actionTypes.SET_CURRENT_CATEGORY, payload: targetCategory });
    
    if (categoryIndex === -1) {
      // Back to source selection
      dispatch({ type: actionTypes.RESET_CATEGORY_NAVIGATION });
    } else {
      loadCategories(state.selectedSource?.id, targetCategory?.id);
    }
  };

  const navigateToProducts = (categoryId) => {
    loadProducts(state.selectedSource?.id, categoryId);
  };

  const value = {
    ...state,
    // Actions
    selectCity,
    selectSource,
    navigateToCategory,
    navigateBackToCategory,
    navigateToProducts,
    loadCategories,
    // Utils
    clearError: () => dispatch({ type: actionTypes.SET_ERROR, payload: null })
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};