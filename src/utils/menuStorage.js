import { getFromStorage, saveToStorage } from "./localStorage";
import { STORAGE_KEYS } from "./constants";

// Get all menu items
export const getMenuItems = () => {
  return getFromStorage(STORAGE_KEYS.MENU) || [];
};

// Get menu item by ID
export const getMenuItemById = (id) => {
  const items = getMenuItems();
  return items.find((item) => item.id === id);
};

// Add new menu item
export const addMenuItem = (item) => {
  const items = getMenuItems();
  const newItem = {
    ...item,
    id: Date.now().toString(),
    available: true,
  };
  items.push(newItem);
  saveToStorage(STORAGE_KEYS.MENU, items);
  return newItem;
};

// Update menu item
export const updateMenuItem = (id, updatedItem) => {
  const items = getMenuItems();
  const index = items.findIndex((item) => item.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...updatedItem };
    saveToStorage(STORAGE_KEYS.MENU, items);
    return items[index];
  }
  return null;
};

// Delete menu item
export const deleteMenuItem = (id) => {
  const items = getMenuItems();
  const filteredItems = items.filter((item) => item.id !== id);
  saveToStorage(STORAGE_KEYS.MENU, filteredItems);
  return true;
};

// Get menu items by category
export const getMenuItemsByCategory = (category) => {
  const items = getMenuItems();
  return items.filter((item) => item.category === category);
};
