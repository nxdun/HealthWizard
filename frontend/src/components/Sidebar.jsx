import React from "react";
import {
  FaHome,
  FaList,
  FaUser,
  FaUserMd,
  FaUsers,
  FaEnvelope,
  FaUserPlus,
} from "react-icons/fa";
import { LuFileJson2 } from "react-icons/lu";
import "../styles/sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/reducers/rootSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sidebar = [
    {
      name: "\u00A0 Home",
      path: "/",
      icon: <FaHome />,
    },
    {
      name: "\u00A0 Users",
      path: "/dashboard/users",
      icon: <FaUsers />,
    },
    {
      name: "\u00A0 Doctors",
      path: "/dashboard/doctors",
      icon: <FaUserMd />,
    },
    {
      name: "\u00A0 Add Hospital Staff",
      path: "/dashboard/add-hospital-staff",
      icon: <FaUserPlus />,
    },
    {
      name: "\u00A0 Appointments",
      path: "/dashboard/appointments",
      icon: <FaList />,
    },
    {
      name: "\u00A0 Applications",
      path: "/dashboard/applications",
      icon: <FaEnvelope />,
    },
    {
      name: "\u00A0 Configurations",
      path: "/dashboard/config",
      icon: <LuFileJson2 />,
    },
    {
      name: "\u00A0 Profile",
      path: "/profile",
      icon: <FaUser />,
    },
  ];

  const logoutFunc = () => {
    dispatch(setUserInfo({}));
    localStorage.removeItem("token");
    navigate("/login");
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
          <div className="logout-container">
            <MdLogout />
            <p onClick={logoutFunc}>Logout</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Sidebar;
