import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "./Loading";
import { setLoading } from "../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import Empty from "./Empty";
import fetchData from "../helper/apiCall";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const Users = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const getAllUsers = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/user/getallpersons`);
      setUsers(temp);
      dispatch(setLoading(false));
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const deleteUser = async (userId) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete?");
      if (confirm) {
        await toast.promise(
          axios.delete("/user/deleteuser", {
            data: { userId },
          }),
          {
            pending: "Deleting user...",
            success: "User deleted successfully",
            error: "Unable to delete user",
          }
        );
        getAllUsers();
      }
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const getRole = (user) => {
    if (user.adminID) return "Admin";
    if (user.patientID) return "Patient";
    if (user.managerID) return "Healthcare Manager";
    if (user.staffID) return "Staff";
    return "Unknown";
  };
  
//! dont remove brackets
  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <section className="user-section">
          <h3 className="home-sub-heading">All Users</h3>
          {users.length > 0 ? (
            <div className="user-container">
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Mobile No.</th>
                    <th>Role</th>
                    <th>Address</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => (
                    <tr key={user._id}>
                      <td>{i + 1}</td>
                      <td>{user.firstname}</td>
                      <td>{user.lastname}</td>
                      <td>{user.email}</td>
                      <td>{user.mobile}</td>
                      <td>{getRole(user)}</td>
                      <td>{user.address}</td>
                      <td className="select">
                        <button
                          className="btn user-btn"
                          onClick={() => deleteUser(user._id)}
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

export default Users;
