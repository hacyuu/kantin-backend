import React, { useState, useEffect } from "react";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
    setLoading(false);
  };

  const deleteOrder = (id) => {
    if (window.confirm("Yakin hapus pesanan ini?")) {
      const updatedOrders = orders.filter(order => order.id !== id);
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "status-completed";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-pending";
    }
  };

  if (loading) return <div className="loading">Memuat riwayat...</div>;

  return (
    <div className="order-history">
      <h2>📋 Riwayat Pesanan</h2>

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>Belum ada pesanan yang tersimpan</p>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-id">ID: #{order.id}</div>
                <div className={`order-status ${getStatusColor(order.status)}`}>
                  {order.status || "pending"}
                </div>
              </div>

              <div className="order-details">
                <p><strong>👤 Nama:</strong> {order.customerName}</p>
                <p><strong>📍 Lokasi:</strong> {order.customerLocation}</p>
                <p>
                  <strong>📅 Waktu:</strong>{" "}
                  {new Date(order.orderDate).toLocaleString("id-ID")}
                </p>

                <div className="order-items">
                  <strong>📦 Items:</strong>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.name} x{item.quantity}
                        <span className="item-total">
                          {" "}
                          (Rp {(item.price * item.quantity).toLocaleString()})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="order-total">
                  <strong>💰 Total:</strong>{" "}
                  <span className="total-amount">
                    Rp {order.total.toLocaleString()}
                  </span>
                </div>

                {order.notes && (
                  <div className="order-notes">
                    <strong>📝 Catatan:</strong> {order.notes}
                  </div>
                )}
              </div>

              <button
                onClick={() => deleteOrder(order.id)}
                className="delete-order-btn"
              >
                🗑️ Hapus
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
