import React from "react";
import {
  FaHome,
  FaList,
  FaUser,
  FaUserMd,
  FaUsers,
  FaEnvelope,
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
      path: "/",
      icon: <FaHome />,
    },
    {
      name: "\u00A0 Appoinments",
      path: "/healthDashboard/appoinmentAnalyse",
      icon: <FaUsers />,
    },
  ];

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
          <div className="logout-container">
            <MdLogout />
            <p>Logout</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default HealthSideBar;
