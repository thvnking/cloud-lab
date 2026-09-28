import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', name: '', email: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const API_URL = 'http://localhost:5000/api/students';

  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error("Loi khi lay danh sach sinh vien:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });

        if (!res.ok) throw new Error('Cap nhat sinh vien that bai');
        setMessage('✅ Cập nhật sinh viên thành công!');
        setEditingId(null);
      } else {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });

        if (!res.ok) throw new Error('Them sinh vien that bai');
        setMessage('✅ Thêm sinh viên thành công!');
      }

      setForm({ studentId: '', name: '', email: '' });
      fetchStudents();
    } catch (error) {
      setMessage('❌ Có lỗi xảy ra khi lưu sinh viên.');
      console.error(error);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setForm({
      studentId: student.studentId,
      name: student.name,
      email: student.email
    });
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Xoa sinh vien that bai');
      setMessage('✅ Xóa sinh viên thành công!');
      fetchStudents();
    } catch (error) {
      setMessage('❌ Có lỗi xảy ra khi xóa sinh viên.');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Quan Ly Sinh Vien</h2>

      {message && (
        <div style={{
          marginBottom: '12px',
          padding: '10px 12px',
          borderRadius: '6px',
          backgroundColor: '#e8f5e9',
          color: '#1b5e20',
          border: '1px solid #a5d6a7'
        }}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input 
          placeholder="MSSV" 
          value={form.studentId} 
          onChange={e => setForm({...form, studentId: e.target.value})} 
          required 
        />
        <input 
          placeholder="Ho ten" 
          value={form.name} 
          onChange={e => setForm({...form, name: e.target.value})} 
          required 
        />
        <input 
          placeholder="Email" 
          value={form.email} 
          onChange={e => setForm({...form, email: e.target.value})} 
          required 
        />
        <button type="submit">{editingId ? 'Cap nhat' : 'Them Sinh Vien'}</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {students.map(st => (
          <li key={st._id} style={{ marginBottom: '10px' }}>
            <strong>{st.studentId}</strong> - {st.name} ({st.email}) {' '}
            <button onClick={() => handleEdit(st)}>Sua</button> {' '}
            <button onClick={() => handleDelete(st._id)}>Xoa</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;