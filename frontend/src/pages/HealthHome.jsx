import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import { FiMenu } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import Contact from "../components/Contact";
import AboutUs from "../components/AboutUs";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import HomeCircles from "../components/HomeCircles";

const HealthHome = () => {
  const [iconActive, setIconActive] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <>
      <header>
        <nav className={iconActive ? "nav-active" : ""}>
          <h2 className="nav-logo">
            <NavLink to={"/"}>Medic</NavLink>
          </h2>
          <ul className="nav-links">
            <li>
              <NavLink to={"/"}>Home</NavLink>
            </li>
            <li>
              <NavLink to={"/healthDashboard"}>Dashboard</NavLink>
            </li>
            <li>
              <span
                className="btn"
                onClick={() => {
                  // Add your logout logic here, if any

                  // Navigate to the home page
                  navigate("/");
                }}
              >
                Logout
              </span>
            </li>
          </ul>
        </nav>
        <div className="menu-icons">
          {!iconActive && (
            <FiMenu
              className="menu-open"
              onClick={() => {
                setIconActive(true);
              }}
            />
          )}
          {iconActive && (
            <RxCross1
              className="menu-close"
              onClick={() => {
                setIconActive(false);
              }}
            />
          )}
        </div>
      </header>
      <Hero />
      <AboutUs />
      <HomeCircles />
      <Contact />
      <Footer />
    </>
  );
};

export default HealthHome;
