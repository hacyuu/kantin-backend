import React, { useState } from 'react';
import axios from 'axios';
import './AddMenu.css';

function AddMenu({ onMenuAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image: '',
    available: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = [
    '🍚 Nasi',
    '🍜 Mie',
    '☕ Minuman',
    '🍰 Snack',
    '🥗 Sayur',
    '🍗 Lauk',
    '🍲 Soto/Sup'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi tipe file
      if (!file.type.startsWith('image/')) {
        alert('❌ File harus berupa gambar (JPG, PNG, GIF, dll)');
        return;
      }

      // Validasi ukuran file (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('❌ Ukuran gambar maksimal 2MB');
        return;
      }

      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newMenu = {
        ...formData,
        price: parseFloat(formData.price),
        image: imagePreview || 'https://via.placeholder.com/300x200?text=No+Image', // Default jika tidak upload
        id: Date.now().toString() // Generate simple ID
      };

      // POST ke JSON Server
      const response = await axios.post('http://localhost:3001/menu', newMenu);
      
      // Success
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        category: '',
        price: '',
        description: '',
        image: '',
        available: true
      });
      setImageFile(null);
      setImagePreview('');

      // Callback ke parent untuk refresh menu list
      if (onMenuAdded) {
        onMenuAdded(response.data);
      }

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Error adding menu:', error);
      alert('❌ Gagal menambahkan menu. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      description: '',
      image: '',
      available: true
    });
    setImageFile(null);
    setImagePreview('');
  };

  return (
    <div className="add-menu-container">
      <div className="add-menu-header">
        <h2>➕ Tambah Menu Baru</h2>
        <p>Lengkapi form di bawah untuk menambahkan menu ke sistem</p>
      </div>

      {showSuccess && (
        <div className="success-alert">
          <span className="success-icon">✅</span>
          <div>
            <strong>Berhasil!</strong>
            <p>Menu baru telah ditambahkan ke daftar</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="add-menu-form">
        {/* Nama Menu */}
        <div className="form-group">
          <label htmlFor="name">
            <span className="label-icon">🍽️</span>
            Nama Menu <span className="required">*</span>
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Contoh: Nasi Goreng Spesial"
            required
          />
        </div>

        {/* Kategori */}
        <div className="form-group">
          <label htmlFor="category">
            <span className="label-icon">📂</span>
            Kategori <span className="required">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">-- Pilih Kategori --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Harga */}
        <div className="form-group">
          <label htmlFor="price">
            <span className="label-icon">💰</span>
            Harga <span className="required">*</span>
          </label>
          <input
            id="price"
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="15000"
            required
          />
          <small className="input-hint">
            {formData.price && `Preview: Rp ${parseFloat(formData.price).toLocaleString('id-ID')}`}
          </small>
        </div>

        {/* Deskripsi */}
        <div className="form-group">
          <label htmlFor="description">
            <span className="label-icon">📝</span>
            Deskripsi <span className="required">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Contoh: Nasi goreng dengan telur, ayam, dan sayuran segar"
            rows="3"
            required
          />
        </div>

        {/* Upload Gambar */}
        <div className="form-group">
          <label htmlFor="image">
            <span className="label-icon">🖼️</span>
            Upload Gambar Menu
          </label>
          <div className="file-upload-wrapper">
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            <label htmlFor="image" className="file-upload-label">
              <span className="upload-icon">📁</span>
              {imageFile ? imageFile.name : 'Pilih file gambar...'}
            </label>
          </div>
          <small className="input-hint">
            Format: JPG, PNG, GIF | Maksimal 2MB
          </small>
        </div>

        {/* Preview Gambar */}
        {imagePreview && (
          <div className="image-preview">
            <p className="preview-label">Preview Gambar:</p>
            <div className="preview-image-container">
              <img src={imagePreview} alt="Preview" />
              <button 
                type="button" 
                className="remove-image-btn"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview('');
                }}
              >
                ❌ Hapus
              </button>
            </div>
          </div>
        )}

        {/* Ketersediaan */}
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
            />
            <span className="checkbox-text">
              <span className="label-icon">✅</span>
              Menu tersedia untuk dijual
            </span>
          </label>
        </div>

        {/* Buttons */}
        <div className="form-actions">
          <button 
            type="button" 
            onClick={handleReset}
            className="btn-reset"
            disabled={isSubmitting}
          >
            <span>🔄</span>
            Reset Form
          </button>
          <button 
            type="submit" 
            className="btn-submit"
            disabled={isSubmitting}
          >
            <span>{isSubmitting ? '⏳' : '✅'}</span>
            {isSubmitting ? 'Menyimpan...' : 'Tambah Menu'}
          </button>
        </div>
      </form>

      {/* Info Box */}
      <div className="info-box">
        <h4>💡 Tips:</h4>
        <ul>
          <li>Pastikan harga sudah benar sebelum menyimpan</li>
          <li>Gunakan deskripsi yang jelas dan menarik</li>
          <li>Upload gambar dengan kualitas baik (max 2MB)</li>
          <li>Uncheck "tersedia" jika menu sedang stok habis</li>
        </ul>
      </div>
    </div>
  );
}

export default AddMenu;