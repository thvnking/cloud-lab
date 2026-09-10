const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Student = require('./models/Student');

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log(">>> Da ket noi thanh cong voi MongoDB Atlas!"))
  .catch(err => console.error("Loi ket noi MongoDB:", err));

// API Hello Test
app.get('/api/hello', (req, res) => {
  res.json({ message: "Hello tu Linux Server Backend!" });
});

// GET /api/students - Lấy danh sách sinh viên
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/students - Thêm sinh viên mới
app.post('/api/students', async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/students/:id - Cập nhật thông tin sinh viên
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/students/:id - Xóa sinh viên
app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Da xoa sinh vien" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server dang chay tai port ${PORT}`);
});