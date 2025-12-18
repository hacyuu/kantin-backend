const STORAGE_KEY = "orders";

// Ambil semua order
export const getOrders = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
};

// Simpan order baru
export const saveOrder = (orderData) => {
  const orders = getOrders();
  orders.push(orderData);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
};

// Hapus order berdasarkan ID
export const deleteOrderById = (id) => {
  const orders = getOrders().filter(order => order.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  return orders;
};

// Hapus semua order (opsional)
export const clearOrders = () => {
  localStorage.removeItem(STORAGE_KEY);
};
