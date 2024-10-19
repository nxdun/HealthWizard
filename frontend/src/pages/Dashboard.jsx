import React from "react";
import AdminApplications from "../components/AdminApplications";
import AdminAppointments from "../components/AdminAppointments";
import AdminDoctors from "../components/AdminDoctors";
import Sidebar from "../components/Sidebar";
import Users from "../components/Users";
import ShaderCanvas from "../components/ShaderCanvas";
import Config from "../components/Config.jsx";

const Dashboard = (props) => {
  const { type } = props;
  return (
    <>
    <ShaderCanvas />
      <section className="layout-section">
        <div className="layout-container">
          <Sidebar />
          {type === "users" ? (
            <Users />
          ) : type === "doctors" ? (
            <AdminDoctors />
          ) : type === "applications" ? (
            <AdminApplications />
          ) : type === "appointments" ? (
            <AdminAppointments />
          ) : type === "config" ? (
            <Config />
          ) : (
            <></>
          )}
        </div>
      </section>
    </>
  );
};

export default Dashboard;
