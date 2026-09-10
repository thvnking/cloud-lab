const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Ket noi MongoDB Atlas thanh cong!'))
  .catch((err) => console.error('Loi ket noi MongoDB Atlas:', err));

app.get('/api/hello', (req, res) => {
  res.json({ message: "Backend dang hoat dong tot!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});