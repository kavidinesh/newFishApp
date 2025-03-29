import React from "react";
import { useNavigate } from "react-router-dom";
import fishpricehandling from "./dashboardimage/fishprice.png";
import boat from "./dashboardimage/boat.jpg";
import fbuy from "./dashboardimage/fbuy.png";
import hr from "./dashboardimage/hr.jpg";
import "./Dashboard.css";

const Dashboard = ({ position }) => {
  const navigate = useNavigate();

  const dashItems = [
    {
      key: "fishprice",
      label: "Inventory Management",
      image: fishpricehandling,
      route: "/fishprice",
      roles: ["owner", "coordinator", "inventorymanager", "writtingperson", ""],
    },
    {
      key: "boattrip",
      label: "Boat Trip Management",
      image: boat,
      route: "/boattrip",
      roles: ["owner", "coordinator", "tansportmanager", "hrmanager", ""],
    },
    {
      key: "fbuy",
      label: "Customer Management",
      image: fbuy,
      route: "/FishBuyer",
      roles: ["owner", "coordinator", "inventorymanager", "hrmanager", ""],
    },
    {
      key: "hr",
      label: "Supplier Management",
      image: hr,
      route: "/fishermenprofiles",
      roles: ["owner", "coordinator", "hrmanager", ""],
    },
  ];

  const filteredItems = dashItems.filter((item) =>
    item.roles.includes(position)
  );

  return (
    <div className="modern-dashboard-wrapper">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay">
          <h1 className="hero-text">Welcome to the Fishery Management Dashboard</h1>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="modern-dashboard-container">
        <div className="modern-dashboard-content">
          {filteredItems.map((item) => (
            <div key={item.key} className="modern-card">
              <img src={item.image} alt={item.label} className="modern-card-img" />
              <div className="modern-card-body">
                <h2 className="modern-card-title">{item.label}</h2>
                <button
                  className="modern-btn"
                  onClick={() => navigate(item.route)}
                >
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="contact-section">
        <div className="contact-container">
          <h2 className="contact-heading">Start Selling Today!</h2>
          <p className="contact-subtext">
            Join our marketplace and grow your seafood business.
          </p>
          <form className="contact-form">
            <input type="text" placeholder="Full Name" className="contact-input" />
            <input type="email" placeholder="Email" className="contact-input" />
            <input type="text" placeholder="Phone Number" className="contact-input" />
            <button className="contact-button">Get Started</button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Fish Market. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
