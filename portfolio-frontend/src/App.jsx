import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { fetchProjects, createProject, deleteProject, fetchProjectStats, fetchSkills, addSkill, updateProject } from './api';
import './App.css';
import Login from './Login';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ total: 0, stability: 0 });
  const [skills, setSkills] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', techStack: '', githubLink: '' });

  const loadData = () => {
    fetchProjects().then(res => setProjects(res.data));
    fetchProjectStats().then(res => setStats(res.data)).catch(() => {});
    fetchSkills().then(res => setSkills(res.data)).catch(() => {});
  };

  useEffect(() => { loadData(); }, []);

  const handleEditClick = (project) => {
    setEditingId(project._id);
    setEditForm({ 
      title: project.title, 
      description: project.description, 
      techStack: project.techStack.join(', '), 
      githubLink: project.githubLink || '' 
    });
  };

  const submitEdit = async (e, id) => {
    e.preventDefault();
    const data = { ...editForm, techStack: editForm.techStack.split(',').map(t => t.trim()) };
    await updateProject(id, data);
    setEditingId(null);
    loadData();
  };

  return (
    <div className="container">
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '4rem', margin: 0 }}>MY_PORTFOLIO<span>_</span></h1>
        <p style={{ color: 'var(--text-dim)' }}>// Tech Archive // Projects</p>
      </header>

      {/* Feature 1: System Pulse Dashboard */}
      <div className="system-pulse">
        <div className="pulse-item">
           <span style={{ color: 'var(--text-dim)' }}>RECORDS_FOUND:</span>
           <code style={{ fontSize: '1rem', color: 'var(--accent)', background: 'none' }}>{stats.total}</code>
        </div>
        <div className="pulse-item">
           <span style={{ color: 'var(--text-dim)' }}>STACK_STABILITY:</span>
           <code style={{ fontSize: '1rem', color: 'var(--accent)', background: 'none' }}>{stats.stability}%</code>
        </div>
        <div className="pulse-item">
           <div className="blink-dot"></div>
           <span style={{ color: 'var(--accent)' }}>SYNC_ACTIVE</span>
        </div>
      </div>

      {/* Feature 2: Technical Skill Radar */}
      {skills.length > 0 && (
        <div className="radar-section">
          <h2 style={{ color: 'var(--accent)', marginBottom: '30px', marginTop: 0 }}>// SKILL_RADAR //</h2>
          {skills.map(s => (
            <div className="radar-item" key={s._id}>
              <div className="radar-header">
                <span>{s.name.toUpperCase()}</span>
                <span>[{s.level}%]</span>
              </div>
              <div className="radar-bar-bg">
                <div className="radar-bar-fill" style={{ width: `${s.level}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 style={{ color: 'var(--accent)', margin: '40px 0 20px 0' }}>// PROJECT_GRID //</h2>
      <div className="project-grid">
        {projects.map(p => (
          <div className="project-card" key={p._id}>
            {editingId === p._id ? (
              <form onSubmit={(e) => submitEdit(e, p._id)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input style={{ background: 'none', border: '1px solid var(--accent)', color: 'var(--text-main)', padding: '10px', fontFamily: 'JetBrains Mono', marginBottom: '0' }} value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} required />
                <textarea style={{ background: 'none', border: '1px solid var(--accent)', color: 'var(--text-main)', padding: '10px', fontFamily: 'JetBrains Mono', marginBottom: '0' }} rows="4" value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} required />
                <input style={{ background: 'none', border: '1px solid var(--accent)', color: 'var(--text-main)', padding: '10px', fontFamily: 'JetBrains Mono', marginBottom: '0' }} value={editForm.techStack} onChange={e => setEditForm({ ...editForm, techStack: e.target.value })} />
                <input style={{ background: 'none', border: '1px solid var(--accent)', color: 'var(--text-main)', padding: '10px', fontFamily: 'JetBrains Mono', marginBottom: '0' }} value={editForm.githubLink} onChange={e => setEditForm({ ...editForm, githubLink: e.target.value })} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn-main" style={{ flex: 1, padding: '10px' }}>SAVE_OVERRIDE</button>
                  <button type="button" onClick={() => setEditingId(null)} style={{ flex: 1, padding: '10px', background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', cursor: 'pointer', fontFamily: 'Space Grotesk', fontWeight: 'bold' }}>CANCEL</button>
                </div>
              </form>
            ) : (
              <>
                <div style={{ fontSize: '0.8rem', color: 'var(--accent)', marginBottom: '10px' }}>
                  [{new Date(p.createdAt).toLocaleDateString()}]
                </div>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <div style={{ margin: '20px 0' }}>
                  {p.techStack.map(t => <span key={t} className="tech-pill">{t}</span>)}
                </div>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
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
                    onClick={() => handleEditClick(p)}
                    style={{ 
                      background: 'none', 
                      border: '1px solid var(--accent)', 
                      color: 'var(--accent)', 
                      cursor: 'pointer', 
                      padding: '0 10px',
                      fontSize: '0.7rem' 
                    }}
                  >
                    EDIT
                  </button>
                  <button 
                    onClick={async () => {
                      if (window.confirm("CRITICAL: PROCEED WITH DATA TERMINATION?")) {
                        await deleteProject(p._id);
                        loadData();
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
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Admin = () => {
  const [form, setForm] = useState({ title: '', description: '', techStack: '', githubLink: '' });
  const [skillForm, setSkillForm] = useState({ name: '', level: '' });

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, techStack: form.techStack.split(',').map(t => t.trim()) };
    await createProject(data);
    alert("PROJECT_COMMITTED_TO_DATABASE");
    setForm({ title: '', description: '', techStack: '', githubLink: '' });
  };

  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    await addSkill(skillForm);
    alert("SKILL_CALIBRATION_LOGGED");
    setSkillForm({ name: '', level: '' });
  };

  return (
    <div className="container" style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <div className="admin-form" style={{ flex: '1', minWidth: '300px' }}>
        <h2 style={{ marginTop: 0, color: 'var(--accent)' }}>PROJECT_ENTRY</h2>
        <form onSubmit={handleProjectSubmit}>
          <input placeholder="PROJECT_NAME" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <textarea rows="5" placeholder="ENGINEERING_SUMMARY" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          <input placeholder="TECH_STACK (COMMA_SEPARATED)" value={form.techStack} onChange={e => setForm({ ...form, techStack: e.target.value })} />
          <input placeholder="REPO_LINK" value={form.githubLink} onChange={e => setForm({ ...form, githubLink: e.target.value })} />
          <button type="submit" className="btn-main" style={{ width: '100%' }}>COMMIT_PORTFOLIO</button>
        </form>
      </div>

      <div className="admin-form" style={{ flex: '1', minWidth: '300px', height: 'fit-content' }}>
        <h2 style={{ marginTop: 0, color: 'var(--accent)' }}>SKILL_CALIBRATOR</h2>
        <form onSubmit={handleSkillSubmit}>
          <input placeholder="TECH_LANGUAGE" value={skillForm.name} onChange={e => setSkillForm({ ...skillForm, name: e.target.value })} required />
          <input type="number" placeholder="MASTERY_LEVEL (0-100)" min="0" max="100" value={skillForm.level} onChange={e => setSkillForm({ ...skillForm, level: e.target.value })} required />
          <button type="submit" className="btn-main" style={{ width: '100%' }}>UPLOAD_SKILL</button>
        </form>
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Load User state
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location]);

  // Load/Set Theme
  const themes = ['matrix', 'cyber-blue', 'high-contrast'];
  const [themeIdx, setThemeIdx] = useState(0);

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') || 'matrix';
    const index = themes.indexOf(savedTheme);
    if(index > -1) {
       setThemeIdx(index);
       document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const nextIdx = (themeIdx + 1) % themes.length;
    const nextTheme = themes[nextIdx];
    setThemeIdx(nextIdx);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('app-theme', nextTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <div>
      <nav>
        <div className="logo" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>ROOT@SYSTEM:</div>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/">[ HOME ]</Link>
          <Link to="/admin">[ Add Project ]</Link>
          
          {user ? (
            <>
              <span style={{ marginLeft: '20px', color: 'var(--accent)', fontFamily: 'JetBrains Mono', fontSize: '0.85rem' }}>
                // USER_{user.username.toUpperCase()} //
              </span>
              <button 
                onClick={handleLogout} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#ff4444', 
                  cursor: 'pointer', 
                  fontFamily: 'Space Grotesk', 
                  fontSize: '1rem',
                  marginLeft: '20px'
                }}>
                [ LOGOUT ]
              </button>
            </>
          ) : (
            <Link to="/login">[ LOGIN ]</Link>
          )}

          <button onClick={toggleTheme} className="theme-switch-btn">
            [ THEME: {themes[themeIdx].toUpperCase()} ]
          </button>

        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
