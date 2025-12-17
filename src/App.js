import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuList from './components/MenuList';
import Cart from './components/Cart';
import OrderForm from './components/OrderForm';
import OrderHistory from './components/OrderHistory';
import AddMenu from './components/AddMenu';
import './App.css';

function App() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('menu');

  // Load menu dari JSON Server
  useEffect(() => {
    fetchMenu();
    
    // Load cart dari localStorage
    const savedCart = localStorage.getItem('kantinCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart ke localStorage
  useEffect(() => {
    localStorage.setItem('kantinCart', JSON.stringify(cart));
  }, [cart]);

  const fetchMenu = async () => {
    try {
      const response = await axios.get('http://localhost:3001/menu');
      setMenu(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menu:', error);
      setLoading(false);
    }
  };

  const handleMenuAdded = (newMenu) => {
    setMenu([...menu, newMenu]);
    alert('✅ Menu berhasil ditambahkan!');
  };

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart(cart.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const saveOrderToJSON = async (orderData) => {
    try {
      const response = await axios.post('http://localhost:3001/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error saving order:', error);
      throw error;
    }
  };

  // ======== FUNGSI KIRIM KE WHATSAPP ========
  const sendOrderToWhatsApp = (orderData) => {
    // Nomor WhatsApp admin kantin (GANTI DENGAN NOMOR ANDA)
    const adminPhone = "6289667709933"; // Format: 62xxx (kode negara + nomor)
    
    // Format payment info
    let paymentInfo = '';
    if (orderData.paymentMethod === 'cash') {
      paymentInfo = `💵 *PEMBAYARAN: CASH/TUNAI*
• Uang Cash: Rp ${orderData.cashAmount.toLocaleString('id-ID')}
• Kembalian: Rp ${orderData.change.toLocaleString('id-ID')}`;
    } else if (orderData.paymentMethod === 'transfer') {
      paymentInfo = `🏦 *PEMBAYARAN: TRANSFER BANK*
• Total Transfer: Rp ${orderData.total.toLocaleString('id-ID')}
• Rekening: BCA 1234567890 a/n Kantin Kantor
⚠️ _Menunggu konfirmasi transfer_`;
    }
    
    // Format pesan untuk WhatsApp
    const message = `*PESANAN BARU KANTIN KANTOR*

📝 *DATA PEMESAN:*
• Nama: ${orderData.customerName}
• Lokasi: ${orderData.customerLocation}
• Waktu: ${new Date().toLocaleString('id-ID')}
• ID Pesanan: #${orderData.id || 'BARU'}

🍽️ *DETAIL PESANAN:*
${orderData.items.map(item => 
  `• ${item.name} (x${item.quantity}) = Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`
).join('\n')}

💰 *TOTAL TAGIHAN: Rp ${orderData.total.toLocaleString('id-ID')}*

${paymentInfo}

📌 Catatan: ${orderData.notes || 'Tidak ada'}

⏳ Status: MENUNGGU DIPROSES
━━━━━━━━━━━━━━━━━━━━
_Pesan otomatis dari Aplikasi Kantin_`;

    // Encode pesan untuk URL
    const encodedMessage = encodeURIComponent(message);
    
    // Buat URL WhatsApp
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${adminPhone}&text=${encodedMessage}&type=phone_number&app_absent=0`;
    
    // Buka WhatsApp di tab baru
    window.open(whatsappUrl, '_blank');
  };

  const handleOrderSubmit = async (orderData) => {
    try {
      // 1. Simpan ke database
      const savedOrder = await saveOrderToJSON(orderData);
      
      // 2. Kirim ke WhatsApp
      sendOrderToWhatsApp({
        ...savedOrder,
        customerName: orderData.customerName,
        customerLocation: orderData.customerLocation,
        items: orderData.items,
        total: orderData.total,
        notes: orderData.notes
      });
      
      // 3. Tampilkan alert
      alert(`✅ Pesanan berhasil disimpan!\n\n📱 WhatsApp sedang dibuka...\n\nSilakan tekan "KIRIM" di WhatsApp untuk konfirmasi pesanan.`);
      
      // 4. Kosongkan cart
      setCart([]);
      localStorage.removeItem('kantinCart');
      
      // 5. Switch ke history tab
      setActiveTab('history');
      
    } catch (error) {
      alert('❌ Gagal menyimpan pesanan. Silakan coba lagi.');
      console.error('Error:', error);
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (loading) {
    return <div className="loading-screen">Memuat menu...</div>;
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>🍱 Kantin Kantor App</h1>
        <p>Sistem pemesanan makanan untuk kantor Anda</p>
      </header>

      <nav className="app-nav">
        <button 
          className={activeTab === 'menu' ? 'active' : ''}
          onClick={() => setActiveTab('menu')}
        >
          🍽️ Menu
        </button>
        <button 
          className={activeTab === 'cart' ? 'active' : ''}
          onClick={() => setActiveTab('cart')}
        >
          🛒 Keranjang ({cart.length})
        </button>
        <button 
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          📋 Riwayat
        </button>
        <button 
          className={activeTab === 'admin' ? 'active' : ''}
          onClick={() => setActiveTab('admin')}
        >
          ⚙️ Admin
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'menu' && (
          <MenuList menu={menu} onAddToCart={addToCart} />
        )}

        {activeTab === 'cart' && (
          <div className="cart-view">
            <Cart 
              cart={cart} 
              onRemoveItem={removeFromCart}
              onUpdateQuantity={updateQuantity}
            />
            
            {cart.length > 0 && (
              <OrderForm 
                onSubmit={handleOrderSubmit}
                cart={cart}
                total={total}
              />
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <OrderHistory />
        )}

        {activeTab === 'admin' && (
          <AddMenu onMenuAdded={handleMenuAdded} />
        )}
      </main>

      <footer className="app-footer"> 
      </footer>
    </div>
  );
}

export default App;