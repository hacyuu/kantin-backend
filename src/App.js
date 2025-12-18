import React, { useState, useEffect } from "react";
import MenuList from "./components/MenuList";
import Cart from "./components/Cart";
import OrderForm from "./components/OrderForm";
import OrderHistory from "./components/OrderHistory";
import AddMenu from "./components/AddMenu";
import { getMenuItems } from "./utils/menuStorage";
import { getCartItems, clearCart } from "./utils/cartStorage";
import { addOrder } from "./utils/orderstorage";
import { initializeData } from "./utils/initdata";
import "./App.css";

function App() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("menu");

  // Initialize data saat pertama kali load
  useEffect(() => {
    try {
      // Initialize localStorage dengan data awal jika belum ada
      initializeData();

      // Load menu dan cart
      const menuData = getMenuItems();
      const cartData = getCartItems();

      setMenu(menuData);
      setCart(cartData);
      setLoading(false);
    } catch (error) {
      console.error("Error initializing app:", error);
      setLoading(false);
    }
  }, []);

  // Reload data ketika tab berubah
  const handleTabChange = (tab) => {
    setActiveTab(tab);

    // Refresh data dari localStorage
    setMenu(getMenuItems());
    setCart(getCartItems());
  };

  const handleMenuAdded = (newMenu) => {
    setMenu(getMenuItems()); // Reload dari localStorage
    alert("✅ Menu berhasil ditambahkan!");
    handleTabChange("menu");
  };

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    let updatedCart;
    if (existingItem) {
      updatedCart = cart.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      updatedCart = [...cart, { ...item, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem("cart_items", JSON.stringify(updatedCart));
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart_items", JSON.stringify(updatedCart));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }

    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );

    setCart(updatedCart);
    localStorage.setItem("cart_items", JSON.stringify(updatedCart));
  };

  // ======== FUNGSI KIRIM KE WHATSAPP ========
  const sendOrderToWhatsApp = (orderData) => {
    // Nomor WhatsApp admin kantin (GANTI DENGAN NOMOR ANDA)
    const adminPhone = "6289667709933"; // Format: 62xxx (kode negara + nomor)

    // Format payment info
    let paymentInfo = "";
    if (orderData.paymentMethod === "cash") {
      paymentInfo = `💵 *PEMBAYARAN: CASH/TUNAI*
• Uang Cash: Rp ${orderData.cashAmount?.toLocaleString("id-ID") || 0}
• Kembalian: Rp ${orderData.change?.toLocaleString("id-ID") || 0}`;
    } else if (orderData.paymentMethod === "transfer") {
      paymentInfo = `🏦 *PEMBAYARAN: TRANSFER BANK*
• Total Transfer: Rp ${orderData.total.toLocaleString("id-ID")}
• Rekening: BCA 1234567890 a/n Kantin Kantor
⚠️ _Menunggu konfirmasi transfer_`;
    }

    // Format pesan untuk WhatsApp
    const message = `*PESANAN BARU KANTIN KANTOR*

📝 *DATA PEMESAN:*
• Nama: ${orderData.customerName}
• Lokasi: ${orderData.customerLocation}
• Waktu: ${new Date().toLocaleString("id-ID")}
• ID Pesanan: #${orderData.id || "BARU"}

🍽️ *DETAIL PESANAN:*
${orderData.items
  .map(
    (item) =>
      `• ${item.name} (x${item.quantity}) = Rp ${(
        item.price * item.quantity
      ).toLocaleString("id-ID")}`
  )
  .join("\n")}

💰 *TOTAL TAGIHAN: Rp ${orderData.total.toLocaleString("id-ID")}*

${paymentInfo}

📌 Catatan: ${orderData.notes || "Tidak ada"}

⏳ Status: MENUNGGU DIPROSES
━━━━━━━━━━━━━━━━━━━━
_Pesan otomatis dari Aplikasi Kantin_`;

    // Encode pesan untuk URL
    const encodedMessage = encodeURIComponent(message);

    // Buat URL WhatsApp
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${adminPhone}&text=${encodedMessage}&type=phone_number&app_absent=0`;

    // Buka WhatsApp di tab baru
    window.open(whatsappUrl, "_blank");
  };

  const handleOrderSubmit = async (orderData) => {
    try {
      // 1. Simpan ke localStorage
      const savedOrder = addOrder(orderData);

      // 2. Kirim ke WhatsApp
      sendOrderToWhatsApp(savedOrder);

      // 3. Tampilkan alert
      alert(
        `✅ Pesanan berhasil disimpan!\n\n📱 WhatsApp sedang dibuka...\n\nSilakan tekan "KIRIM" di WhatsApp untuk konfirmasi pesanan.`
      );

      // 4. Kosongkan cart
      clearCart();
      setCart([]);

      // 5. Switch ke history tab
      handleTabChange("history");
    } catch (error) {
      alert("❌ Gagal menyimpan pesanan. Silakan coba lagi.");
      console.error("Error:", error);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Memuat menu...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>🍱 Kantin Kantor App</h1>
        <p>Sistem pemesanan makanan untuk kantor Anda</p>
      </header>

      <nav className="app-nav">
        <button
          className={activeTab === "menu" ? "active" : ""}
          onClick={() => handleTabChange("menu")}
        >
          🍽️ Menu
        </button>
        <button
          className={activeTab === "cart" ? "active" : ""}
          onClick={() => handleTabChange("cart")}
        >
          🛒 Keranjang ({cart.length})
        </button>
        <button
          className={activeTab === "history" ? "active" : ""}
          onClick={() => handleTabChange("history")}
        >
          📋 Riwayat
        </button>
        <button
          className={activeTab === "admin" ? "active" : ""}
          onClick={() => handleTabChange("admin")}
        >
          ⚙️ Admin
        </button>
      </nav>

      <main className="app-main">
        {activeTab === "menu" && (
          <MenuList menu={menu} onAddToCart={addToCart} />
        )}

        {activeTab === "cart" && (
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

        {activeTab === "history" && <OrderHistory />}

        {activeTab === "admin" && <AddMenu onMenuAdded={handleMenuAdded} />}
      </main>

      <footer className="app-footer">
        <p>© 2024 Kantin Kantor - Powered by React & LocalStorage</p>
      </footer>
    </div>
  );
}

export default App;
