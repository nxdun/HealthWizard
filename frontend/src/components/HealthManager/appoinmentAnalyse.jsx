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
import ServicePieChart from "./ServicePieChart";
import 'jspdf-autotable';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
const logoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAYAAADiC...";

const AppointmentAnalyse = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]); // State to hold doctors
  const [appointmentData, setAppointmentData] = useState([]);
  const [startDate, setStartDate] = useState(null); // Start date for filter (allow null for reset)
  const [endDate, setEndDate] = useState(null); // End date for filter (allow null for reset)
  const [timeFrame, setTimeFrame] = useState("monthly"); // Default time frame
  const [selectedDoctorID, setSelectedDoctorID] = useState(""); // State for selected doctor ID

  useEffect(() => {
    // Fetch all appointments and doctors initially
    fetchAppointments();
    fetchDoctors();
  }, []);
  
  const fetchAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/appointments/getall");
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
      console.log("Filtered Doctors:", filteredDoctors);
      setDoctors(filteredDoctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  // Process appointments data for graph visualization
  const processAppointmentData = (appointments) => {
    const appointmentCount = {};
    const now = new Date(); // Get current date

    // Filter appointments by selected doctor and date range (if provided)
    const filteredAppointments = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);
      const isWithinRange = (!startDate || appointmentDate >= startDate) && (!endDate || appointmentDate <= endDate);

      // Check if the appointment falls within the doctor filter and date range
      return (!selectedDoctorID || appointment.doctorID === selectedDoctorID) && isWithinRange;
    });

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

    // If reset, ensure we display all months (from January to December)
    if (timeFrame === "monthly" && !startDate && !endDate) {
      for (let i = 1; i <= 12; i++) {
        const monthKey = `${now.getFullYear()}-${String(i).padStart(2, "0")}`;
        if (!appointmentCount[monthKey]) {
          appointmentCount[monthKey] = 0; // Ensure every month has a value
        }
      }
    }

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

  // Reset filters to defaults (including full monthly view)
  const resetFilters = () => {
    setSelectedDoctorID(""); // Reset selected doctor
    setTimeFrame("monthly"); // Reset time frame to monthly
    setStartDate(null); // Reset start date (null means show all months)
    setEndDate(null); // Reset end date (null means show all months)
    processAppointmentData(appointments); // Reprocess data with default filters
  };

// Generate PDF report
const generateReport = () => {
  const doc = new jsPDF();

  // Add Logo
  try {
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', 10, 10, 30, 30); // x, y, width, height
    }
  } catch (error) {
    console.error("Error adding logo to the PDF:", error);
  }

  // Header
  doc.setFillColor(59, 130, 246); // Tailwind blue-500
  doc.rect(0, 0, doc.internal.pageSize.width, 20, 'F'); // Filled rectangle for header

  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255); // White text
  doc.text('Hospital Appointment Report', doc.internal.pageSize.width / 2, 15, { align: 'center' });

  // Current Date and Time
  const currentDate = new Date();
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0); // Black text
  doc.text(`Report Generated: ${format(currentDate, 'PPpp')}`, doc.internal.pageSize.width - 60, 25);

  // Title Section
  doc.setFontSize(16);
  doc.text(`Appointment Analysis (${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)})`, 14, 40);

  // Selected Filters
  doc.setFontSize(12);
  doc.text(`Selected Doctor: ${selectedDoctorID || "All Doctors"}`, 14, 50);
  doc.text(`Date Range: ${startDate ? format(startDate, 'PP') : "All"} - ${endDate ? format(endDate, 'PP') : "All"}`, 14, 60);

  // Appointment Data Table
  const tableColumn = ["Date", "Number of Appointments"];
  const tableRows = appointmentData.labels.map((label, index) => [
    label,
    appointmentData.datasets[0].data[index],
  ]);

  // Use autotable for better tables
  try {
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 70,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] }, // Tailwind blue-500
      styles: { fontSize: 10 },
    });
  } catch (error) {
    console.error("Error generating table in PDF:", error);
  }

  // Add a colored section for summary
  const summaryStartY = doc.autoTable.previous.finalY + 10;
  doc.setFillColor(229, 231, 235); // Tailwind gray-200
  doc.rect(10, summaryStartY, doc.internal.pageSize.width - 20, 20, 'F');
  doc.setTextColor(31, 41, 55); // Tailwind gray-800
  doc.setFontSize(14);
  doc.text("Summary", 15, summaryStartY + 15);

  // Add summary details
  doc.setFontSize(12);
  doc.text(`Total Appointments: 1,200`, 15, summaryStartY + 25);
  doc.text(`Completed Appointments: 1,100`, 15, summaryStartY + 35);
  doc.text(`Pending Appointments: 100`, 15, summaryStartY + 45);
  doc.text(`Cancelled Appointments: 20`, 15, summaryStartY + 55);

  // Signature Section
  const signatureY = doc.internal.pageSize.height - 40;
  doc.setFontSize(12);
  doc.text("Prepared By:", 14, signatureY);
  doc.text("______________________________", 14, signatureY + 10);
  doc.text("Signature", 14, signatureY + 15);

  doc.text("Approved By:", doc.internal.pageSize.width / 2 + 10, signatureY);
  doc.text("______________________________", doc.internal.pageSize.width / 2 + 10, signatureY + 10);
  doc.text("Signature", doc.internal.pageSize.width / 2 + 10, signatureY + 15);

  // Save the PDF
  try {
    doc.save("appointment_report.pdf");
  } catch (error) {
    console.error("Error saving the PDF:", error);
  }
};

  return (
    <>
      <ShaderCanvas />
      <section className="min-h-screen flex">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <ChartCard>
            <h2 className="text-2xl font-bold text-center mb-4">Appointment Analysis</h2>




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

{/* Doctor dropdown */}
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


            {/* Reset Filters Button */}
            <div className="flex justify-center mb-6">
              <button
                onClick={resetFilters}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
              >
                Reset Filters
              </button>
            </div>
                        {/* PDF Report Button */}
                        <div className="flex justify-center mt-6">
              <button
                onClick={generateReport}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
              >
                Generate PDF Report
              </button>
            </div>

            <div className="flex flex-col items-center mb-6">
    {appointmentData && Array.isArray(appointmentData.labels) && appointmentData.labels.length > 0 ? (
        <Line
            data={appointmentData}
            options={{
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: `Appointments Analysis (${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)})`,
                    },
                },
            }}
            width={600}
            height={400}
        />
    ) : (
        <p>No appointment data available</p>
    )}
    <ServicePieChart appointmentData={appointments} size={600} /> {/* Change size here */}
</div>


          </ChartCard>
        </div>
      </section>
    </>
  );
};

export default AppointmentAnalyse;
