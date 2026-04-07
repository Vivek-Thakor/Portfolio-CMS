import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { fetchProjects, createProject, deleteProject } from './api';
import './App.css';

const Home = () => {
  const [projects, setProjects] = useState([]);

  const getProjects = () => fetchProjects().then(res => setProjects(res.data));
  useEffect(() => { getProjects(); }, []);

  return (
    <div className="container">
      <header style={{ marginBottom: '60px' }}>
        <h1 style={{ fontSize: '4rem', margin: 0 }}>MY_PORTFOLIO<span>_</span></h1>
        <p style={{ color: 'var(--text-dim)' }}>// Tech Archive // Projects</p>
      </header>

      <div className="project-grid">
        {projects.map(p => (
          <div className="project-card" key={p._id}>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent)', marginBottom: '10px' }}>
              [{new Date(p.createdAt).toLocaleDateString()}]
            </div>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <div style={{ margin: '20px 0' }}>
              {p.techStack.map(t => <span key={t} className="tech-pill">{t}</span>)}
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <a 
                href={p.githubLink} 
                target="_blank" 
                rel="noreferrer" 
                className="btn-main" 
                style={{ textDecoration: 'none', textAlign: 'center' }}
              >
                SOURCE_CODE &gt;&gt;
              </a>
              <button 
  onClick={async () => {
    if (window.confirm("CRITICAL: PROCEED WITH DATA TERMINATION?")) {
      await deleteProject(p._id);
      getProjects();
    }
  }} 
  style={{ 
    background: 'none', 
    border: '1px solid #ff4444', 
    color: '#ff4444', 
    cursor: 'pointer', 
    padding: '0 10px',
    fontSize: '0.7rem' 
  }}
>
  TERMINATE
</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Admin = () => {
  const [form, setForm] = useState({ title: '', description: '', techStack: '', githubLink: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, techStack: form.techStack.split(',').map(t => t.trim()) };
    await createProject(data);
    alert("ENTRY_COMMITTED_TO_DATABASE");
    setForm({ title: '', description: '', techStack: '', githubLink: '' });
  };

  return (
    <div className="container">
      <div className="admin-form">
        <h2 style={{ marginTop: 0, color: 'var(--accent)' }}>DATABASE_ENTRY</h2>
        <form onSubmit={handleSubmit}>
          <input placeholder="PROJECT_NAME" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <textarea rows="5" placeholder="ENGINEERING_SUMMARY" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          <input placeholder="TECH_STACK (COMMA_SEPARATED)" value={form.techStack} onChange={e => setForm({ ...form, techStack: e.target.value })} />
          <input placeholder="REPO_LINK" value={form.githubLink} onChange={e => setForm({ ...form, githubLink: e.target.value })} />
          <button type="submit" className="btn-main" style={{ width: '100%' }}>COMMIT_TO_CORE</button>
        </form>
      </div>
    </div>
  );
};

function App() {
  return (
    <div>
      <nav>
        <div className="logo" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>ROOT@SYSTEM:</div>
        <div>
          <Link to="/">[ HOME ]</Link>
          <Link to="/admin">[ Add Project ]</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;