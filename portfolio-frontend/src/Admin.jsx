import { useState } from 'react';
import { createProject } from './api';

const Admin = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    githubLink: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const projectData = {
        ...formData,
        techStack: formData.techStack.split(',').map(s => s.trim())
      };
      await createProject(projectData);
      alert("Project saved to MongoDB!");
      setFormData({ title: '', description: '', techStack: '', githubLink: '' });
    } catch (err) {
      alert("Error saving project. Check console.");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Add New Project</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input placeholder="Project Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
        <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
        <input placeholder="Tech Stack (comma separated)" value={formData.techStack} onChange={e => setFormData({...formData, techStack: e.target.value})} />
        <input placeholder="GitHub Link" value={formData.githubLink} onChange={e => setFormData({...formData, githubLink: e.target.value})} />
        <button type="submit">Save to Database</button>
      </form>
    </div>
  );
};

export default Admin;
