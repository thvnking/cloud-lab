// Nạp thư viện
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // đọc file .env

const app = express();

// Middleware để parse JSON
app.use(express.json());

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Kết nối MongoDB Atlas thành công'))
  .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// Route test
app.get('/', (req, res) => {
  res.send(`Server đang chạy trên port ${process.env.PORT}!`);
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Backend đang hoạt động!' });
});

// Lắng nghe server
app.listen(process.env.PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${process.env.PORT}`);
});

// Kiểm tra biến môi trường
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('PORT:', process.env.PORT);
