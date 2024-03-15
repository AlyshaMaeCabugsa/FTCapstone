import React from 'react';
import './Sidebar.css';
import { Link, useNavigate } from 'react-router-dom';
import logoImage from '../mainlogo.png';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Adjust if you have other tokens or items
        localStorage.setItem('loggedIn', 'false'); // If you're using this to manage logged-in state
        navigate('/sign-in'); // Replace '/login' with your actual login route if different
      };

  return (
    <aside id="sidebar">
    <div className="sidebar-header">
      <img src={logoImage} alt="Logo" className="sidebar-logo" />
    </div>
    <nav className="sidebar-nav">
      <ul>
        <li><Link to="/admin-dashboard">Dashboard</Link></li>
        <Link to="/tracking-list">Tracking List</Link>
        <li><Link to="/reports">Reports</Link></li>
        <li><Link to="/inspection">Inspection</Link></li>
        <li><Link to="/certificates">Certificates</Link></li>
      </ul>
    </nav>
    <button onClick={handleLogout} className="btn-logout">Logout</button>
  </aside>
  
  );
};

export default Sidebar;