import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "./Loading";
import { setLoading } from "../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import Empty from "./Empty";
import fetchData from "../helper/apiCall";
import "../styles/user.css";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const getAllAppoint = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData("/appointments/getallappointments");
      console.log(temp); // Log the response to inspect its structure
      if (Array.isArray(temp)) {
        setAppointments(temp);
      } else {
        setAppointments([]); // If it's not an array, set it to an empty array
      }
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    getAllAppoint();
  }, []);

  const complete = async (ele) => {
    try {
      await toast.promise(
        axios.put(
          "/appointment/completed",
          {
            appointid: ele?._id,
            doctorId: ele?.doctorID._id, // Ensure this matches your data structure
            doctorname: `${ele?.doctorID?.firstname} ${ele?.doctorID?.lastname}`, // Use populated data
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          success: "Appointment marked as completed successfully",
          error: "Unable to mark appointment as completed",
          loading: "Updating appointment status...",
        }
      );

      getAllAppoint();
    } catch (error) {
      console.error("Error completing appointment:", error);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <section className="user-section">
          <h3 className="home-sub-heading">All Appointments</h3>
          {Array.isArray(appointments) && appointments.length > 0 ? (
            <div className="user-container">
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Doctor</th>
                    <th>Patient</th>
                    <th>Appointment Date</th>
                    <th>Appointment Time</th>
                    <th>Booking Date</th>
                    <th>Booking Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((ele, i) => {
                    const appointmentDate = new Date(ele.appointmentDate);
                    const createdAtDate = new Date(ele.createdAt).toLocaleDateString() || "N/A";
                    const updatedAtTime = new Date(ele.updatedAt).toLocaleTimeString() || "N/A";

                    return (
                      <tr key={ele?._id}>
                        <td>{i + 1}</td>
                        <td>{ele?.doctorID?.firstname + " " + ele?.doctorID?.lastname || "N/A"}</td>
                        <td>{ele?.patientID?.firstname + " " + ele?.patientID?.lastname || "N/A"}</td>
                        <td>{appointmentDate.toLocaleDateString()}</td>
                        <td>{appointmentDate.toLocaleTimeString()}</td>
                        <td>{createdAtDate}</td>
                        <td>{updatedAtTime}</td>
                        <td>{ele?.status}</td>
                        <td>
                          <button
                            className={`btn user-btn accept-btn ${ele?.status === "Completed" ? "disable-btn" : ""}`}
                            disabled={ele?.status === "Completed"}
                            onClick={() => complete(ele)}
                          >
                            Complete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty />
          )}
        </section>
      )}
    </>
  );
};

export default AdminAppointments;
