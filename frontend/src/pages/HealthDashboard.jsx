import React from "react";
import Sidebar from "../components/HealthManager/HealthSideBar";
import ShaderCanvas from "../components/ShaderCanvas";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts"; // Assuming using Recharts for charts

const HealthDashboard = () => {
  // Dummy data for hospital appointment analysis
  const appointmentData = [
    { name: "Jan", Appointments: 120, Completed: 110 },
    { name: "Feb", Appointments: 150, Completed: 130 },
    { name: "Mar", Appointments: 200, Completed: 180 },
    { name: "Apr", Appointments: 170, Completed: 160 },
    { name: "May", Appointments: 240, Completed: 230 },
    { name: "Jun", Appointments: 210, Completed: 200 },
  ];

  const recentAppointments = [
    { id: 1, patientName: "John Doe", date: "2024-10-18", time: "10:30 AM", doctor: "Dr. Smith" },
    { id: 2, patientName: "Jane Doe", date: "2024-10-19", time: "12:00 PM", doctor: "Dr. Brown" },
    { id: 3, patientName: "Alex Johnson", date: "2024-10-20", time: "02:15 PM", doctor: "Dr. White" },
  ];

  return (
    <>
      <ShaderCanvas />
      <section className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 bg-gray-50 p-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Health Dashboard</h1>
            <p className="text-lg text-gray-500">Overview of Hospital Appointments</p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-600">Total Appointments</h3>
              <p className="text-3xl font-bold text-blue-600">1,200</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-600">Completed Appointments</h3>
              <p className="text-3xl font-bold text-green-500">1,100</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-600">Pending Appointments</h3>
              <p className="text-3xl font-bold text-yellow-500">100</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-600">Cancelled Appointments</h3>
              <p className="text-3xl font-bold text-red-500">20</p>
            </div>
          </div>

          {/* Graphs Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Monthly Appointment Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={appointmentData}>
                  <CartesianGrid stroke="#ccc" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Appointments" stroke="#8884d8" />
                  <Line type="monotone" dataKey="Completed" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Appointments Comparison (Monthly)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={appointmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Appointments" fill="#8884d8" />
                  <Bar dataKey="Completed" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Appointments */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Appointments</h3>
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((appointment) => (
                  <tr key={appointment.id} className="border-t">
                    <td className="py-4 px-6 text-sm text-gray-600">{appointment.patientName}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{appointment.date}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{appointment.time}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{appointment.doctor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default HealthDashboard;
