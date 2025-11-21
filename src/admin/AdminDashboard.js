import React from "react";
import './Styles.css';
import { FaUpload, FaImages, FaProjectDiagram, FaTasks } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AdminDashboardSummary from "./dashBoardSummary";

const AdminDashboard = () => {
  const dashboardItems = [
    {
      title: "Upload Content",
    
      icon: <FaUpload />,
      link: "/kazisiba-admin/admin/very/secure/upload"
    },
    {
      title: "View Gallery",
 
      icon: <FaImages />,
      link: "/gallery"
    },
    {
      title: "Material",
 
      icon: <FaProjectDiagram />,
      link: "/materials"
    },
    {
      title: "Completed Projects",
  
      icon: <FaTasks />,
      link: "/completed-projects"
    }
  ];

  return (
    <div className="simple-dashboard-page">
      {/* <h2 className="simple-dashboard-title">Banx Kazisiba Admin Dashboard</h2> */}

      <br/>  <br/>  <br/>

      <div className="simple-dashboard-cards">
        {dashboardItems.map((item, index) => (
          <Link to={item.link} key={index} className="simple-card">
            <div className="simple-card-icon">{item.icon}</div>
            <h4>{item.title}</h4>
            <p>{item.desc}</p>
          </Link>
        ))}
      </div>

      <AdminDashboardSummary/>
      

      {/* New Section under cards */}
      <div className="dashboard-info-section">
        <div className="dashboard-info-image">
          <img src="/images/jim.jpeg" alt="Info" />
      </div>

 <div className="dashboard-info-text">
          <h3>Banx Gypsum Kazisiba</h3>
          <p style={{marginBottom:'0px'}} >
            This is your central hub to manage all your content, monitor ongoing projects,
            update the gallery, and manage your profile. Everything you need is accessible
            from this page for efficient administration.
          </p>
        </div> 

      </div>
    </div>
  );
};

export default AdminDashboard;
