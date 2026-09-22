import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// ฟังก์ชันดึงและจัดการสินค้า
export const fetchProducts = () => API.get('/products');
export const fetchProductByBarcode = (barcode) => API.get(`/products/barcode/${barcode}`);
export const createProduct = (productData) => API.post('/products', productData);

// ฟังก์ชันเบิก-จ่ายและประวัติ
export const recordTransaction = (transactionData) => API.post('/transactions', transactionData);
export const fetchTransactionHistory = () => API.get('/transactions/history');

export default API;