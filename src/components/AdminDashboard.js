import React from 'react';
import Sidebar from './Sidebar'; // Assuming you have a Sidebar component
import './AdminDashboard.css';


const AdminDashboard = () => {

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <main className="dashboard-content">
        <h1>Welcome Admin</h1>
      </main>
    </div>
  );
};

export default AdminDashboard;
