import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../../styles/register.css";
import axios from "axios";
import toast from "react-hot-toast";
import ShaderCanvas from "../../components/ShaderCanvas";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function RegisterStaffMember() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState("");
  const [formDetails, setFormDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confpassword: "",
    dob: "",
    mobile: "",
    address: "",
  });
  const navigate = useNavigate();

  const inputChange = (e) => {
    const { name, value } = e.target;
    return setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };
  const onUpload = async (element) => {
    setLoading(true);
    if (element.type === "image/jpeg" || element.type === "image/png") {
      const data = new FormData();
      data.append("file", element);
      data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);
      data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
      fetch(process.env.REACT_APP_CLOUDINARY_BASE_URL, {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => setFile(data.url.toString()));
      setLoading(false);
    } else {
      setLoading(false);
      toast.error("Please select an image in jpeg or png format");
    }
  };

  const formSubmit = async (e) => {
    try {
      e.preventDefault();

      if (loading) return;

      const { firstname, lastname, email, password, confpassword, dob, mobile, address } =
        formDetails;
      if (!firstname || !lastname || !email || !password || !confpassword || !dob || !mobile || !address) {
        return toast.error("All fields are required");
      } else if (firstname.length < 3) {
        return toast.error("First name must be at least 3 characters long");
      } else if (lastname.length < 3) {
        return toast.error("Last name must be at least 3 characters long");
      } else if (password.length < 5) {
        return toast.error("Password must be at least 5 characters long");
      } else if (password !== confpassword) {
        return toast.error("Passwords do not match");
      }

      await toast.promise(
        axios.post("/addStaff/registerStaff", {
          firstname,
          lastname,
          email,
          password,
          dob,
          mobile,
          address,
          pic: file,
        }),
        {
          pending: "Registering user...",
          success: "User registered successfully",
          error: "Unable to register user",
        }
      );
      return navigate("/dashboard/add-hospital-staff");
    } catch (error) {
      toast.error("An error occurred during registration");
    }
  };

  
  return (
    <>
      <ShaderCanvas />
      <section className="register-section flex-center">
        <div className="register-container flex-center w-full max-w-lg pt-8 pb-6 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="form-heading">Register Staff Member</h2>
          <form onSubmit={formSubmit} className="register-form">
            <input
              type="text"
              name="firstname"
              className="form-input"
              placeholder="Enter your first name"
              value={formDetails.firstname}
              onChange={inputChange}
            />
            <input
              type="text"
              name="lastname"
              className="form-input"
              placeholder="Enter your last name"
              value={formDetails.lastname}
              onChange={inputChange}
            />
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={formDetails.email}
              onChange={inputChange}
            />
            <input
              type="date"
              name="dob"
              className="form-input"
              placeholder="Enter your date of birth"
              value={formDetails.dob}
              onChange={inputChange}
            />
            <input
              type="text"
              name="mobile"
              className="form-input"
              placeholder="Enter your mobile number"
              value={formDetails.mobile}
              onChange={inputChange}
            />
            <input
              type="text"
              name="address"
              className="form-input"
              placeholder="Enter your address"
              value={formDetails.address}
              onChange={inputChange}
            />
            <input
            type="file"
            onChange={(e) => onUpload(e.target.files[0])}
            name="profile-pic"
            id="profile-pic"
            className="form-input"
          />
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={formDetails.password}
              onChange={inputChange}
            />
            <input
              type="password"
              name="confpassword"
              className="form-input"
              placeholder="Confirm your password"
              value={formDetails.confpassword}
              onChange={inputChange}
            />
            <button
              type="submit"
              className="btn form-btn"
              disabled={loading ? true : false}
            >
              Register Staff Member
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

export default RegisterStaffMember;
