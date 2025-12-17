import React from 'react';

const MenuList = ({ menu, onAddToCart }) => {
  return (
    <div className="menu-container">
      <h2>🍽️ Menu Kantin</h2>
      <div className="menu-grid">
        {menu.map(item => (
          <div key={item.id} className="menu-card">
            <div className="menu-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="menu-info">
              <h3>{item.name}</h3>
              <p className="menu-description">{item.description}</p>
              <div className="menu-footer">
                <span className="menu-price">Rp {item.price.toLocaleString()}</span>
                <button 
                  className="add-button"
                  onClick={() => onAddToCart(item)}
                >
                  + Tambah
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuList;