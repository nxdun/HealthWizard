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

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  // Get all doctors with filtering based on isDoctor flag
  const getAllDoctors = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/doctors/`);
      // Filter doctors where isDoctor is true
      const filteredDoctors = temp.filter((doctor) => doctor.isDoctor);
      setDoctors(filteredDoctors);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      toast.error("Failed to fetch doctors");
    }
  };

  // Delete doctor
  const deleteUser = async (doctorID) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete?");
      if (confirm) {
        await toast.promise(
          axios.delete(`/doctors/${doctorID}`, {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          {
            success: "Doctor deleted successfully",
            error: "Unable to delete Doctor",
            loading: "Deleting Doctor...",
          }
        );
        getAllDoctors();
      }
    } catch (error) {
      toast.error("Error deleting doctor");
    }
  };

  useEffect(() => {
    getAllDoctors();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <section className="user-section">
          <h3 className="home-sub-heading">All Doctors</h3>
          {doctors.length > 0 ? (
            <div className="user-container">
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Pic</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Mobile No.</th>
                    <th>Experience</th>
                    <th>Specialization</th>
                    <th>Fees</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor, i) => (
                    <tr key={doctor._id}>
                      <td>{i + 1}</td>
                      <td>
                        <img
                          className="user-table-pic"
                          src={doctor.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                          alt={doctor.firstname || "No Image"}
                        />
                      </td>
                      <td>{doctor.firstname || "N/A"}</td>
                      <td>{doctor.lastname || "N/A"}</td>
                      <td>{doctor.email || "N/A"}</td>
                      <td>{doctor.mobile ? doctor.mobile.toString() : "N/A"}</td>
                      <td>{doctor.experience || "N/A"}</td>
                      <td>{doctor.specialization || "N/A"}</td>
                      <td>{doctor.fees || "N/A"}</td>
                      <td className="select">
                        <button
                          className="btn user-btn"
                          onClick={() => deleteUser(doctor.doctorID)}
                        >
                          Remove
                        </button>
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
    </>
  );
};

export default AdminDoctors;
