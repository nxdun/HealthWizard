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
import "../styles/user.css";

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.root);

    // Decode the token to get personId
    const token = localStorage.getItem("token");
    const { personId } = token ? jwt_decode(token) : { personId: null };

    const getPatientAppointments = async () => {
        if (!personId) {
            toast.error("User not found. Please log in.");
            return;
        }

        try {
            dispatch(setLoading(true));
            // Fetch appointments filtered by personId (which is patientId)
            const temp = await fetchData(`/appointments/getPatientAppointments/${personId}`);
            if (Array.isArray(temp)) {
                setAppointments(temp);
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
    }, []);

    return (
        <>
            <Navbar />
            {loading ? (
                <Loading />
            ) : (
                <section className="container notif-section">
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
        </>
    );
};

export default Appointments;
