const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Student = require('./models/Student');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.set('bufferCommands', false);

const REQUIRED_ENV = ['MONGODB_URI'];
for (const key of REQUIRED_ENV) {
  if (!process.env[key] || !process.env[key].trim()) {
    console.error(`Missing required environment variable: ${key}`);
  }
}

const mongoUri = process.env.MONGODB_URI?.trim();

const memoryStudents = [
  { _id: 'memory-1', studentId: 'SV001', name: 'Nguyen Van A', email: 'a@example.com' },
  { _id: 'memory-2', studentId: 'SV002', name: 'Tran Thi B', email: 'b@example.com' }
];

const isMongoReady = () => mongoose.connection.readyState === 1;

// Kết nối MongoDB Atlas
mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS: 30000,
  retryWrites: true,
  maxPoolSize: 10,
  family: 4
})
  .then(() => console.log(">>> Da ket noi thanh cong voi MongoDB Atlas!"))
  .catch(err => console.error("Loi ket noi MongoDB:", err.message));

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

// API Hello Test
app.get('/api/hello', (req, res) => {
  res.json({ message: "Hello tu Linux Server Backend!" });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET /api/students - Lấy danh sách sinh viên
app.get('/api/students', async (req, res) => {
  try {
    if (!isMongoReady()) {
      return res.json(memoryStudents);
    }

    console.log('Before Student.find');
    const students = await Student.find().maxTimeMS(5000).lean();
    console.log('After Student.find', students.length);
    res.json(students);
  } catch (err) {
    console.error('Student.find error:', err);
    return res.json(memoryStudents);
  }
});

// POST /api/students - Thêm sinh viên mới
app.post('/api/students', async (req, res) => {
  try {
    if (!isMongoReady()) {
      const newStudent = {
        _id: `memory-${Date.now()}`,
        studentId: req.body.studentId,
        name: req.body.name,
        email: req.body.email
      };
      memoryStudents.push(newStudent);
      return res.status(201).json(newStudent);
    }

    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/students/:id - Cập nhật thông tin sinh viên
app.put('/api/students/:id', async (req, res) => {
  try {
    if (!isMongoReady()) {
      const index = memoryStudents.findIndex(student => student._id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ error: 'Sinh vien khong ton tai' });
      }

      memoryStudents[index] = {
        ...memoryStudents[index],
        ...req.body
      };
      return res.json(memoryStudents[index]);
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: 'Sinh vien khong ton tai' });
    }

    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/students/:id - Xóa sinh viên
app.delete('/api/students/:id', async (req, res) => {
  try {
    if (!isMongoReady()) {
      const index = memoryStudents.findIndex(student => student._id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ error: 'Sinh vien khong ton tai' });
      }
      memoryStudents.splice(index, 1);
      return res.json({ message: 'Da xoa sinh vien' });
    }

    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Sinh vien khong ton tai' });
    }
    res.json({ message: 'Da xoa sinh vien' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server dang chay tai port ${PORT}`);
});