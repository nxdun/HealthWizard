import React from "react";
import {
  FaHome,
  FaUsers,
} from "react-icons/fa";
import "../../styles/sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../redux/reducers/rootSlice";

const HealthSideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sidebar = [
    {
      name: "\u00A0 Home",
      path: "/healthDashboard",
      icon: <FaHome />,
    },
    {
      name: "\u00A0 Appointments",
      path: "/healthDashboard/appoinmentAnalyse",
      icon: <FaUsers />,
    },
  ];

  const handleLogout = () => {
    // Dispatch logout action or clear user info if needed
    dispatch(setUserInfo(null)); // Assuming this resets user info
    navigate("/"); // Navigate to home page
  };

  return (
    <>
      <section className="sidebar-section flex-center">
        <div className="sidebar-container">
          <ul>
            {sidebar.map((ele, i) => {
              return (
                <li key={i}>
                  {ele.icon}
                  <NavLink to={ele.path}>{ele.name}</NavLink>
                </li>
              );
            })}
          </ul>
          <div className="logout-container" onClick={handleLogout}>
            <MdLogout />
            <p>Logout</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default HealthSideBar;
