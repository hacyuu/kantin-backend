import { getFromStorage, saveToStorage } from "./localStorage";
import { STORAGE_KEYS } from "./constants";

// Get cart items
export const getCartItems = () => {
  return getFromStorage(STORAGE_KEYS.CART) || [];
};

// Add item to cart
export const addToCart = (item) => {
  const cart = getCartItems();
  const existingItem = cart.find((cartItem) => cartItem.id === item.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  saveToStorage(STORAGE_KEYS.CART, cart);
  return cart;
};

// Update cart item quantity
export const updateCartItemQuantity = (id, quantity) => {
  const cart = getCartItems();
  const item = cart.find((cartItem) => cartItem.id === id);

  if (item) {
    item.quantity = quantity;
    if (item.quantity <= 0) {
      return removeFromCart(id);
    }
    saveToStorage(STORAGE_KEYS.CART, cart);
  }

  return cart;
};

// Remove item from cart
export const removeFromCart = (id) => {
  const cart = getCartItems();
  const filteredCart = cart.filter((item) => item.id !== id);
  saveToStorage(STORAGE_KEYS.CART, filteredCart);
  return filteredCart;
};

// Clear cart
export const clearCart = () => {
  saveToStorage(STORAGE_KEYS.CART, []);
  return [];
};

// Get cart total
export const getCartTotal = () => {
  const cart = getCartItems();
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Get cart item count
export const getCartItemCount = () => {
  const cart = getCartItems();
  return cart.reduce((count, item) => count + item.quantity, 0);
};
