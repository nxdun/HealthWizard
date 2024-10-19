/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Empty from "../components/Empty";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import fetchData from "../helper/apiCall";
import { setLoading } from "../redux/reducers/rootSlice";
import Loading from "../components/Loading";
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import axios from "axios";
import "../styles/user.css";
import ShaderCanvas from "../components/ShaderCanvas";

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [status, setStatus] = useState("Scheduled");

    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.root);

    // Decode the token to get personId and role
    const token = localStorage.getItem("token");
    const { personId, role } = token ? jwt_decode(token) : { personId: null, role: null };

    const getPatientAppointments = async () => {
        if (!personId) {
            toast.error("User not found. Please log in.");
            return;
        }

        try {
            dispatch(setLoading(true));
            
            // Dynamically use different API endpoints based on role
            const endpoint = role === "doctor"
                ? `/appointments/getDoctorAppointments/${personId}` // For doctors
                : `/appointments/getPatientAppointments/${personId}`; // For patients

            // Fetch appointments filtered by personId (which is patientId)
            const temp = await fetchData(endpoint);
            if (Array.isArray(temp)) {
                setAppointments(temp);
                console.log("Appointments:", temp);
            } else {
                setAppointments([]); // If it's not an array, set it to an empty array
            }
            dispatch(setLoading(false));
        } catch (error) {
            dispatch(setLoading(false));
            console.error("Error fetching appointments:", error);
            toast.error("Failed to fetch appointments. Please try again later.");
        }
    };

    useEffect(() => {
        getPatientAppointments();
    
    }, [role]); // Dependency on the role so it changes if the role changes

    // Open modal to update appointment status (for doctors)
    const handleUpdateStatus = (appointment) => {
        setSelectedAppointment(appointment);
        setStatus(appointment?.status || "Scheduled");
        setIsModalOpen(true);
    };

    // Handle status update (for doctors)
    const handleSubmitStatusUpdate = async () => {
      try {
        await axios.patch(
          `/appointments/s/${selectedAppointment._id}`,
          { status }, // The status being updated
          {
            headers: {
              "Content-Type": "application/json"
            },
          }
        );
    
        toast.success("Status updated successfully!");
        setIsModalOpen(false);
        getPatientAppointments(); // Refresh appointments after updating status
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error("Failed to update status. Please try again.");
      }
    };

    const handlePay = (appointmentId, price, location) => {
        // Redirect to Payment component
        window.location.href = `/pay?appointmentId=${appointmentId}&price=${price}&location=${location}`;
    };

    // Handle Rescheduling (for managers)
    const handleReschedule = (appointment) => {
        // Logic to handle rescheduling (could open a modal or navigate to another page)
        console.log("Rescheduling appointment: ", appointment);
    };

    return (
        <>
            <Navbar />
            <ShaderCanvas />
            {loading ? (
                <Loading />
            ) : (
                <section className="container h-[80vh] notif-section">
                    <h2 className="page-heading">Your Appointments</h2>

                    {appointments.length > 0 ? (
                        <div className="appointments">
                            <table>
                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th>Doctor Name</th>
                                        <th>Patient Name</th>
                                        <th>Appointment Date</th>
                                        <th>Appointment Time</th>
                                        <th>Booking Date</th>
                                        <th>Booking Time</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((ele, i) => (
                                        <tr key={ele?._id}>
                                            <td>{i + 1}</td>
                                            <td>
                                                {ele?.doctorID?.firstname && ele?.doctorID?.lastname
                                                    ? `${ele.doctorID.firstname} ${ele.doctorID.lastname}`
                                                    : "N/A"}
                                            </td>
                                            <td>
                                                {ele?.patientID?.firstname && ele?.patientID?.lastname
                                                    ? `${ele.patientID.firstname} ${ele.patientID.lastname}`
                                                    : "N/A"}
                                            </td>
                                            <td>{new Date(ele?.appointmentDate).toLocaleDateString()}</td>
                                            <td>{new Date(ele?.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                            <td>{new Date(ele?.createdAt).toLocaleDateString()}</td>
                                            <td>{new Date(ele?.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                            <td>{ele?.status}</td>
                            
                                            <td>
                                                {/* Role-based Button Logic */}
                                                {role === "patient" && ele?.status === "Completed" && (
                                                    <button
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-md"
                                                        onClick={() => handlePay(ele._id, ele.price, ele.location)}
                                                    >
                                                        Pay
                                                    </button>
                                                )}
                                                {role === "doctor" && (
                                                    <button
                                                        className="px-4 py-2 bg-green-600 text-white rounded-md"
                                                        onClick={() => handleUpdateStatus(ele)}
                                                    >
                                                        Update Status
                                                    </button>
                                                )}
                                                {role === "manager" && (
                                                    <button
                                                        className="px-4 py-2 bg-yellow-600 text-white rounded-md"
                                                        onClick={() => handleReschedule(ele)}
                                                    >
                                                        Reschedule
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <Empty />
                    )}
                </section>
            )}
            <Footer />

            {/* Modal for Doctors */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmitStatusUpdate}
                status={status}
                setStatus={setStatus}
            />
        </>
    );
};

export default Appointments;
