import React, { useState } from 'react';
import './OrderForm.css';

function OrderForm({ onSubmit, cart, total }) {
  const [customerName, setCustomerName] = useState('');
  const [customerLocation, setCustomerLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cashAmount, setCashAmount] = useState('');

  const calculateChange = () => {
    const cash = parseFloat(cashAmount) || 0;
    const change = cash - total;
    return change > 0 ? change : 0;
  };

  const isCashValid = () => {
    if (paymentMethod !== 'cash') return true;
    const cash = parseFloat(cashAmount) || 0;
    return cash >= total;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!paymentMethod) {
      alert('⚠️ Pilih metode pembayaran terlebih dahulu!');
      return;
    }

    if (paymentMethod === 'cash' && !isCashValid()) {
      alert('⚠️ Nominal uang cash tidak cukup!');
      return;
    }

    const orderData = {
      customerName,
      customerLocation,
      items: cart,
      total,
      notes,
      paymentMethod,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    // Tambahkan info pembayaran
    if (paymentMethod === 'cash') {
      orderData.cashAmount = parseFloat(cashAmount);
      orderData.change = calculateChange();
    }

    onSubmit(orderData);

    // Reset form
    setCustomerName('');
    setCustomerLocation('');
    setNotes('');
    setPaymentMethod('');
    setCashAmount('');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="order-form-container">
      <h2>📝 Form Pemesanan</h2>
      
      <form onSubmit={handleSubmit} className="order-form">
        {/* Customer Info */}
        <div className="form-group">
          <label htmlFor="name">
            <span className="label-icon">👤</span>
            Nama Pemesan <span className="required">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Masukkan nama Anda"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">
            <span className="label-icon">📍</span>
            Lokasi/Ruangan <span className="required">*</span>
          </label>
          <input
            id="location"
            type="text"
            value={customerLocation}
            onChange={(e) => setCustomerLocation(e.target.value)}
            placeholder="Contoh: Lantai 2 - Ruang Marketing"
            required
          />
        </div>

        {/* Payment Method */}
        <div className="form-group">
          <label htmlFor="payment">
            <span className="label-icon">💳</span>
            Metode Pembayaran <span className="required">*</span>
          </label>
          <select
            id="payment"
            value={paymentMethod}
            onChange={(e) => {
              setPaymentMethod(e.target.value);
              setCashAmount(''); // Reset cash amount saat ganti method
            }}
            required
            className="payment-select"
          >
            <option value="">-- Pilih Metode Pembayaran --</option>
            <option value="cash">💵 Cash / Tunai</option>
            <option value="transfer">🏦 Transfer Bank</option>
          </select>
        </div>

        {/* Cash Payment Details */}
        {paymentMethod === 'cash' && (
          <div className="payment-details cash-payment">
            <div className="payment-info-box">
              <div className="total-display">
                <span>Total Tagihan:</span>
                <strong>{formatCurrency(total)}</strong>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="cashAmount">
                <span className="label-icon">💰</span>
                Nominal Uang Cash <span className="required">*</span>
              </label>
              <input
                id="cashAmount"
                type="Number"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                placeholder="Masukkan nominal uang"
                required
              />
              <small className="input-hint">
                Minimal: {formatCurrency(total)}
              </small>
            </div>

            {cashAmount && parseFloat(cashAmount) >= total && (
              <div className={`change-display ${calculateChange() > 0 ? 'has-change' : 'exact'}`}>
                <div className="change-icon">
                  {calculateChange() > 0 ? '💸' : '✅'}
                </div>
                <div className="change-info">
                  <span className="change-label">
                    {calculateChange() > 0 ? 'Kembalian:' : 'Uang Pas!'}
                  </span>
                  {calculateChange() > 0 && (
                    <strong className="change-amount">
                      {formatCurrency(calculateChange())}
                    </strong>
                  )}
                </div>
              </div>
            )}

            {cashAmount && parseFloat(cashAmount) < total && (
              <div className="error-message">
                ⚠️ Uang kurang {formatCurrency(total - parseFloat(cashAmount))}
              </div>
            )}
          </div>
        )}

        {/* Transfer Payment Details */}
        {paymentMethod === 'transfer' && (
          <div className="payment-details transfer-payment">
            <div className="payment-info-box">
              <div className="total-display">
                <span>Total yang harus ditransfer:</span>
                <strong>{formatCurrency(total)}</strong>
              </div>
              
              <div className="bank-info">
                <h4>📱 Informasi Rekening:</h4>
                <div className="bank-detail">
                  <span className="bank-label">Bank:</span>
                  <strong>BCA</strong>
                </div>
                <div className="bank-detail">
                  <span className="bank-label">No. Rekening:</span>
                  <strong>1234567890</strong>
                </div>
                <div className="bank-detail">
                  <span className="bank-label">Atas Nama:</span>
                  <strong>Kantin Kantor</strong>
                </div>
              </div>

              <div className="transfer-note">
                💡 <em>Silakan transfer dan konfirmasi via WhatsApp setelah order</em>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="form-group">
          <label htmlFor="notes">
            <span className="label-icon">📝</span>
            Catatan Tambahan
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: Pedasnya sedang, tanpa bawang"
            rows="3"
          />
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <div className="summary-row">
            <span>Jumlah Item:</span>
            <strong>{cart.reduce((sum, item) => sum + item.quantity, 0)} item</strong>
          </div>
          <div className="summary-row total-row">
            <span>Total Pembayaran:</span>
            <strong className="total-amount">{formatCurrency(total)}</strong>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="submit-button"
          disabled={paymentMethod === 'cash' && !isCashValid()}
        >
          <span className="button-icon">📱</span>
          Kirim Pesanan via WhatsApp
        </button>
      </form>
    </div>
  );
}

export default OrderForm;