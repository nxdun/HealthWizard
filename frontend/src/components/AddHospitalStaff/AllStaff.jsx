import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "../Loading";
import { setLoading } from "../../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import Empty from "../Empty";
import fetchData from "../../helper/apiCall";
import { CSVLink } from "react-csv";  // Import CSV export component

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const AllStaff = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  
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
          axios.delete("/user/deleteperson", {
            data: { userId },
          }),
          {
            pending: "Deleting Healthcare Manager...",
            success: "Healthcare Manager deleted successfully",
            error: "Unable to delete Healthcare Manager",
          }
        );
        getAllUsers();
      }
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const getRole = (user) => {
    if (user.HealthManagerID) return "Healthcare Manager";
    if (user.staffID) return "Staff";
    return null;
  };

  // Handle search filtering
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle role filtering
  const handleRoleFilter = (e) => {
    setFilterRole(e.target.value);
  };

  // Filter users based on search and role filter, but only for Staff and Healthcare Manager
  const filteredUsers = users
    .filter((user) => user.HealthManagerID || user.staffID) // Only include Staff and Healthcare Manager
    .filter((user) => {
      const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
      const searchMatch = fullName.includes(searchTerm.toLowerCase());
      const roleMatch = filterRole === "All" || getRole(user) === filterRole;
      return searchMatch && roleMatch;
    });

  useEffect(() => {
    getAllUsers();
  }, []);

  // CSV headers for export
  const csvHeaders = [
    { label: "S.No", key: "sno" },
    { label: "First Name", key: "firstname" },
    { label: "Last Name", key: "lastname" },
    { label: "Email", key: "email" },
    { label: "Mobile No.", key: "mobile" },
    { label: "Role", key: "role" },
    { label: "Address", key: "address" }
  ];

  // Prepare data for CSV export
  const csvData = filteredUsers.map((user, i) => ({
    sno: i + 1,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    mobile: user.mobile,
    role: getRole(user),
    address: user.address
  }));

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <section className="user-section">
          <h3 className="home-sub-heading">Staff and Healthcare Managers</h3>

          {/* Search Bar and Filter */}
          <div className="filter-section">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-bar"
            />
            <select value={filterRole} onChange={handleRoleFilter} className="filter-select">
              <option value="All">All Roles</option>
              <option value="Healthcare Manager">Healthcare Manager</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          {filteredUsers.length > 0 ? (
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
                  {filteredUsers.map((user, i) => (
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
                  {/* CSV Download Button under the table, in the same <tbody> */}
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '20px 0' }}>
                      <CSVLink 
                        data={csvData} 
                        headers={csvHeaders} 
                        filename={"staff_and_healthcare_managers.csv"}
                        className="btn csv-btn"
                      >
                        Download CSV
                      </CSVLink>
                    </td>
                  </tr>
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

export default AllStaff;
