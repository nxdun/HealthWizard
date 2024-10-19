import React from "react";
import { NavLink } from "react-router-dom";
import { FaUserMd, FaUserPlus, FaUsers } from "react-icons/fa";

const AddHospitalStaff = () => {
  // Dummy data for counts
  const totalDoctors = 120;
  const totalHealthManagers = 15;
  const totalStaffMembers = 50;

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Add Hospital Staff
      </h2>
      <div className="flex justify-around mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-lg font-semibold text-blue-600 mb-2">Total Doctors</h3>
          <p className="text-2xl text-gray-800">{totalDoctors}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-lg font-semibold text-blue-600 mb-2">Total Health Managers</h3>
          <p className="text-2xl text-gray-800">{totalHealthManagers}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-lg font-semibold text-blue-600 mb-2">Total Staff Members</h3>
          <p className="text-2xl text-gray-800">{totalStaffMembers}</p>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <NavLink to="/dashboard/add-doctor" className="flex items-center justify-center w-full bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-700 transition duration-300 mb-3">
          <FaUserMd className="mr-2" /> Add Doctor
        </NavLink>
        <NavLink to="/dashboard/add-health-manager" className="flex items-center justify-center w-full bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-700 transition duration-300 mb-3">
          <FaUserPlus className="mr-2" /> Add Health Manager
        </NavLink>
        <NavLink to="/dashboard/add-staff" className="flex items-center justify-center w-full bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-700 transition duration-300">
          <FaUsers className="mr-2" /> Add Staff
        </NavLink>
      </div>
    </div>
  );
};

export default AddHospitalStaff;
