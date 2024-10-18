import React, { useEffect, useState } from "react";
import Sidebar from "./HealthSideBar";
import ShaderCanvas from "../../components/ShaderCanvas";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import ChartCard from "./ChartCard";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from 'jspdf'; // Import jsPDF for generating PDF reports
import { format } from 'date-fns'; // Import format for date formatting

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AppointmentAnalyse = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]); // State to hold doctors
  const [appointmentData, setAppointmentData] = useState([]);
  const [startDate, setStartDate] = useState(new Date()); // Start date for filter
  const [endDate, setEndDate] = useState(new Date()); // End date for filter
  const [timeFrame, setTimeFrame] = useState("monthly"); // Default time frame
  const [selectedDoctorID, setSelectedDoctorID] = useState(""); // State for selected doctor ID

  useEffect(() => {
    // Fetch all appointments and doctors initially
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/appointments");
      setAppointments(response.data);
      processAppointmentData(response.data); // Process data initially
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/user/getallpersons");
      // Filter doctors from the response data
      const filteredDoctors = response.data.filter(user => user.type === "Doctor");
      setDoctors(filteredDoctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  // Process appointments data for graph visualization
  const processAppointmentData = (appointments) => {
    const appointmentCount = {};

    // Filter appointments based on the selected doctor ID
    const filteredAppointments = appointments.filter(appointment => 
      !selectedDoctorID || appointment.doctorID === selectedDoctorID
    );

    // Group filtered appointments by the selected time frame
    filteredAppointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.appointmentDate);
      let key;

      if (timeFrame === "daily") {
        key = format(appointmentDate, "yyyy-MM-dd"); // Daily
      } else if (timeFrame === "monthly") {
        key = `${appointmentDate.getFullYear()}-${String(appointmentDate.getMonth() + 1).padStart(2, "0")}`; // Monthly
      } else {
        key = appointmentDate.getFullYear(); // Yearly
      }

      if (!appointmentCount[key]) {
        appointmentCount[key] = 0;
      }
      appointmentCount[key]++;
    });

    // Sort the keys
    const sortedLabels = Object.keys(appointmentCount).sort();

    // Create data for the graph
    setAppointmentData({
      labels: sortedLabels,
      datasets: [
        {
          label: `Appointments (${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)})`,
          data: sortedLabels.map((label) => appointmentCount[label]),
          borderColor: "rgba(75,192,192,1)",
          backgroundColor: "rgba(75,192,192,0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
    });
  };

  // Handle time frame change
  const handleTimeFrameChange = (frame) => {
    setTimeFrame(frame);
    processAppointmentData(appointments); // Reprocess data based on new time frame
  };

  // Handle doctor selection change
  const handleDoctorChange = (event) => {
    const doctorID = event.target.value;
    setSelectedDoctorID(doctorID); // Update selected doctor ID
    processAppointmentData(appointments); // Reprocess data based on new selection
  };

  // Generate PDF report
  const generateReport = () => {
    const doc = new jsPDF();
    const title = `Appointment Report (${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)})`;
    doc.text(title, 10, 10);
    doc.text(`Selected Doctor: ${selectedDoctorID || "All Doctors"}`, 10, 20);
    doc.text(`Date Range: ${startDate.toDateString()} - ${endDate.toDateString()}`, 10, 30);
    
    let yOffset = 40;
    appointmentData.labels.forEach((label, index) => {
      doc.text(`Date: ${label}, Count: ${appointmentData.datasets[0].data[index]}`, 10, yOffset);
      yOffset += 10;
    });

    doc.save("appointment_report.pdf");
  };

  return (
    <>
      <ShaderCanvas />
      <section className="min-h-screen flex">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <ChartCard>
            <h2 className="text-2xl font-bold text-center mb-4">Appointment Analysis</h2>

            {/* Date range picker */}
            <div className="flex justify-center items-center space-x-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date:</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date:</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>

            {/* Time frame buttons */}
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => handleTimeFrameChange("daily")}
                className={`px-4 py-2 rounded-md ${timeFrame === "daily" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
              >
                Daily
              </button>
              <button
                onClick={() => handleTimeFrameChange("monthly")}
                className={`px-4 py-2 rounded-md ${timeFrame === "monthly" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
              >
                Monthly
              </button>
              <button
                onClick={() => handleTimeFrameChange("yearly")}
                className={`px-4 py-2 rounded-md ${timeFrame === "yearly" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
              >
                Yearly
              </button>
            </div>

            {/* Dropdown for doctors */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Select Doctor:</label>
              <select
                onChange={handleDoctorChange}
                className="border border-gray-300 rounded-md p-2"
                value={selectedDoctorID}
              >
                <option value="">All Doctors</option> {/* Option to view all doctors' appointments */}
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.firstname} {doctor.lastname}
                  </option>
                ))}
              </select>
            </div>

            {/* Graph */}
            {appointmentData.labels ? (
              <Line
                data={appointmentData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: true,
                      position: "top",
                    },
                    title: {
                      display: true,
                      text: `Appointments Count by ${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)}`,
                    },
                  },
                }}
              />
            ) : (
              <p className="text-center text-gray-500">Loading graph...</p>
            )}

            {/* Generate Report Button */}
            <div className="mt-4">
              <button
                onClick={generateReport}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
              >
                Generate Report
              </button>
            </div>
          </ChartCard>
        </div>
      </section>
    </>
  );
};

export default AppointmentAnalyse;
