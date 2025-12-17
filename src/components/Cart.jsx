import React from 'react';

const Cart = ({ cart, onRemoveItem, onUpdateQuantity }) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="cart">
      <h2>🛒 Keranjang Pesanan</h2>
      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Keranjang masih kosong</p>
          <small>Tambahkan item dari menu</small>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p>Rp {item.price.toLocaleString()} x {item.quantity}</p>
                </div>
                <div className="cart-item-controls">
                  <button 
                    className="qty-btn"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="qty-display">{item.quantity}</span>
                  <button 
                    className="qty-btn"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button 
                    className="remove-btn"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    Hapus
                  </button>
                </div>
                <div className="cart-item-total">
                  Rp {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="total-row">
              <span>Total:</span>
              <span className="total-amount">Rp {total.toLocaleString()}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;