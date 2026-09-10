import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', name: '', email: '' });

  const API_URL = '/api/students'; // Được cấu hình qua proxy hoặc gọi đầy đủ URL nếu khác port

  const fetchStudents = async () => {
    const res = await fetch('http://localhost:5000/api/students');
    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ studentId: '', name: '', email: '' });
    fetchStudents();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/students/${id}`, { method: 'DELETE' });
    fetchStudents();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Quan Ly Sinh Vien</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
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
        <button type="submit">Them Sinh Vien</button>
      </form>

      <ul>
        {students.map(st => (
          <li key={st._id}>
            {st.studentId} - {st.name} - {st.email} {' '}
            <button onClick={() => handleDelete(st._id)}>Xoa</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;