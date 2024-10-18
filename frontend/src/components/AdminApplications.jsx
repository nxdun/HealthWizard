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

// Admin accept user request for doctor application
const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const getAllApp = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/doctors`);
      // Filter applications where isDoctor is false
      const filteredApplications = temp.filter((doctor) => !doctor.isDoctor);
      setApplications(filteredApplications);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      toast.error("Failed to fetch applications");
    }
  };

  // Accept user application
  const acceptUser = async (doctorID) => {
    try {
      const confirm = window.confirm("Are you sure you want to accept?");
      if (confirm) {
        await toast.promise(
          axios.put(`/doctors/approve/${doctorID}`, null, {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          {
            success: "Application accepted",
            error: "Unable to accept application",
            loading: "Accepting application...",
          }
        );
        getAllApp(); // Refresh the list after acceptance
      }
    } catch (error) {
      toast.error("Error accepting application");
    }
  };

  // Reject user application
  const deleteUser = async (doctorID) => {
    try {
      const confirm = window.confirm("Are you sure you want to reject?");
      if (confirm) {
        await toast.promise(
          axios.put(`/doctors/reject/${doctorID}`, null, {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          {
            success: "Application rejected",
            error: "Unable to reject application",
            loading: "Rejecting application...",
          }
        );
        getAllApp(); // Refresh the list after rejection
      }
    } catch (error) {
      toast.error("Error rejecting application");
    }
  };

  useEffect(() => {
    getAllApp();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <section className="user-section">
          <h3 className="home-sub-heading">All Applications</h3>
          {applications.length > 0 ? (
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
                    <th>Specialization</th>
                    <th>Fees</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((ele, i) => (
                    <tr key={ele?._id}>
                      <td>{i + 1}</td>
                      <td>
                        <img
                          className="user-table-pic"
                          src={
                            ele?.pic ||
                            "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                          }
                          alt={ele?.firstname}
                        />
                      </td>
                      <td>{ele?.firstname}</td>
                      <td>{ele?.lastname}</td>
                      <td>{ele?.email}</td>
                      <td>{ele?.mobile}</td>
                      <td>{ele?.specialization}</td>
                      <td>{ele?.fees}</td>
                      <td className="select">
                        <button
                          className="btn user-btn accept-btn"
                          onClick={() => acceptUser(ele?.doctorID)}
                        >
                          Accept
                        </button>
                        <button
                          className="btn user-btn"
                          onClick={() => deleteUser(ele?.doctorID)}
                        >
                          Reject
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

export default AdminApplications;
