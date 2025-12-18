import React, { createContext, useState, useEffect } from 'react';
import initialMenuData from '../data/initialMenuData.json';

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load menus from localStorage or use initial data
  useEffect(() => {
    const savedMenus = localStorage.getItem('menus');
    
    if (savedMenus) {
      try {
        setMenus(JSON.parse(savedMenus));
      } catch (error) {
        console.error('Error loading menus:', error);
        setMenus(initialMenuData);
      }
    } else {
      setMenus(initialMenuData);
    }
    
    setLoading(false);
  }, []);

  // Save menus to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('menus', JSON.stringify(menus));
    }
  }, [menus, loading]);

  const addMenu = (menuData) => {
    const newMenu = {
      id: Date.now().toString(),
      ...menuData,
      createdAt: new Date().toISOString()
    };
    
    setMenus(prevMenus => [...prevMenus, newMenu]);
    return newMenu;
  };

  const updateMenu = (menuId, updatedData) => {
    setMenus(prevMenus =>
      prevMenus.map(menu =>
        menu.id === menuId
          ? { ...menu, ...updatedData, updatedAt: new Date().toISOString() }
          : menu
      )
    );
  };

  const deleteMenu = (menuId) => {
    setMenus(prevMenus => prevMenus.filter(menu => menu.id !== menuId));
  };

  const getMenuById = (menuId) => {
    return menus.find(menu => menu.id === menuId);
  };

  const searchMenus = (searchTerm) => {
    if (!searchTerm) return menus;
    
    const term = searchTerm.toLowerCase();
    return menus.filter(menu =>
      menu.name.toLowerCase().includes(term) ||
      menu.category?.toLowerCase().includes(term) ||
      menu.description?.toLowerCase().includes(term)
    );
  };

  const getMenusByCategory = (category) => {
    if (!category) return menus;
    return menus.filter(menu => menu.category === category);
  };

  const value = {
    menus,
    loading,
    addMenu,
    updateMenu,
    deleteMenu,
    getMenuById,
    searchMenus,
    getMenusByCategory
  };

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
};