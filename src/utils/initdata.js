import { STORAGE_KEYS } from './constants';
import initialData from '../data/initialData.json';

// Initialize data saat pertama kali load
export const initializeData = () => {
  // Cek apakah sudah ada data
  const existingMenu = localStorage.getItem(STORAGE_KEYS.MENU);
  const existingOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
  const existingCart = localStorage.getItem(STORAGE_KEYS.CART);
  const existingCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);

  // Jika belum ada data menu, gunakan initialData
  if (!existingMenu) {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(initialData.menu));
    console.log('✅ Menu initialized from initialData.json');
  }

  // Initialize orders jika belum ada
  if (!existingOrders) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    console.log('✅ Orders initialized');
  }

  // Initialize cart jika belum ada
  if (!existingCart) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    console.log('✅ Cart initialized');
  }

  // Initialize categories jika belum ada
  if (!existingCategories) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initialData.categories));
    console.log('✅ Categories initialized');
  }

  return {
    menu: JSON.parse(localStorage.getItem(STORAGE_KEYS.MENU)),
    orders: JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)),
    cart: JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)),
    categories: JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES))
  };
};

// Reset semua data ke initial state
export const resetAllData = () => {
  if (window.confirm('Apakah Anda yakin ingin reset semua data? Data yang ada akan hilang!')) {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(initialData.menu));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initialData.categories));
    
    console.log('✅ All data has been reset');
    window.location.reload();
  }
};

// Export data untuk backup
export const exportData = () => {
  const data = {
    menu: JSON.parse(localStorage.getItem(STORAGE_KEYS.MENU) || '[]'),
    orders: JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]'),
    cart: JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]'),
    categories: JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]'),
    exportDate: new Date().toISOString()
  };

  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `menu-kantor-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  console.log('✅ Data exported successfully');
};

// Import data dari backup
export const importData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (data.menu) localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(data.menu));
        if (data.orders) localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(data.orders));
        if (data.cart) localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(data.cart));
        if (data.categories) localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(data.categories));
        
        console.log('✅ Data imported successfully');
        resolve(data);
        window.location.reload();
      } catch (error) {
        console.error('❌ Error importing data:', error);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};