import React from "react";
import AdminApplications from "../components/AdminApplications";
import AdminAppointments from "../components/AdminAppointments";
import AdminDoctors from "../components/AdminDoctors";
import Sidebar from "../components/HealthManager/HealthSideBar";
import Users from "../components/Users";
import ShaderCanvas from "../components/ShaderCanvas";

const HealthDashboard = (props) => {
  const { type } = props;
  return (
    <>
    <ShaderCanvas />
      <section className="layout-section">
        <div className="layout-container">
          <Sidebar />
        </div>
      </section>
    </>
  );
};

export default HealthDashboard;
