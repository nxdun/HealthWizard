import React, { useEffect, useState, useRef } from "react";
import "../styles/profile.css";
import axios from "axios";
import toast from "react-hot-toast";
import { setLoading } from "../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/Loading";
import fetchData from "../helper/apiCall";
import jwt_decode from "jwt-decode";
import NavBar from "../components/NavBar";
import ShaderCanvas from "../components/ShaderCanvas";
import QRCodeStyling from "qr-code-styling";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function Profile() {
  const decode = jwt_decode(localStorage.getItem("token"));
  const userId = decode.personId; // personId from token
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);
  const [file, setFile] = useState("");
  const [formDetails, setFormDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    age: "",
    mobile: "",
    gender: "neither",
    address: "",
    password: "",
    confpassword: "",
  });

  // QR Code setup
  const qrCodeRef = useRef(null);
  const qrCodeInstance = useRef(null);

  useEffect(() => {
    qrCodeInstance.current = new QRCodeStyling({
      width: 300,
      height: 300,
      type: "png",
      data: userId,
      dotsOptions: {
        color: "#000",
        type: "rounded",
      },
      backgroundOptions: {
        color: "#ffffff",
      },
    });
  }, [userId]);

  const generateQRCode = () => {
    if (qrCodeInstance.current) {
      qrCodeInstance.current.append(qrCodeRef.current);
    }
  };

  generateQRCode()

  const handleDownloadQRCode = () => {
    if (qrCodeInstance.current) {
      qrCodeInstance.current.download({ name: "person-qr-code", extension: "png" });
    }
  };

  const getUser = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/user/getperson/${userId}`);
      setFormDetails({
        ...temp,
        password: "",
        confpassword: "",
        mobile: temp.mobile === null ? "" : temp.mobile,
        age: temp.age === null ? "" : temp.age,
      });
      setFile(temp.pic || "https://i.imgur.com/6VBx3io.png");
      dispatch(setLoading(false));
    } catch (error) {
      toast.error("Error fetching user details");
    }
  };

  useEffect(() => {
    getUser();
  }, [dispatch]);

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    const {
      firstname,
      lastname,
      email,
      age,
      mobile,
      address,
      gender,
      password,
      confpassword,
    } = formDetails;

    if (!email) return toast.error("Email should not be empty");
    if (firstname.length < 3) return toast.error("First name must be at least 3 characters long");
    if (lastname.length < 3) return toast.error("Last name must be at least 3 characters long");
    if (password.length < 5) return toast.error("Password must be at least 5 characters long");
    if (password !== confpassword) return toast.error("Passwords do not match");

    try {
      await toast.promise(
        axios.put(
          "/user/updateprofile",
          { firstname, lastname, age, mobile, address, gender, email, password },
          { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } }
        ),
        {
          pending: "Updating profile...",
          success: "Profile updated successfully",
          error: "Unable to update profile",
        }
      );
      setFormDetails({ ...formDetails, password: "", confpassword: "" });
    } catch (error) {
      toast.error("Unable to update profile");
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <NavBar />
          <ShaderCanvas />
          <section className="register-section flex-center">
            <div className="profile-container flex-center">
              <h2 className="form-heading">Profile</h2>
              <img src={file} alt="profile" className="profile-pic" />
              <form onSubmit={formSubmit} className="register-form">
                <div className="form-same-row">
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
                </div>
                <div className="form-same-row">
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="Enter your email"
                    value={formDetails.email}
                    onChange={inputChange}
                  />
                  <select
                    name="gender"
                    value={formDetails.gender}
                    className="form-input"
                    id="gender"
                    onChange={inputChange}
                  >
                    <option value="neither">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="form-same-row">
                  <input
                    type="text"
                    name="age"
                    className="form-input"
                    placeholder="Enter your age"
                    value={formDetails.age}
                    onChange={inputChange}
                  />
                  <input
                    type="text"
                    name="mobile"
                    className="form-input"
                    placeholder="Enter your mobile number"
                    value={formDetails?.mobile}
                    onChange={inputChange}
                  />
                </div>
                <textarea
                  type="text"
                  name="address"
                  className="form-input"
                  placeholder="Enter your address"
                  value={formDetails.address}
                  onChange={inputChange}
                  rows="2"
                ></textarea>
                <div className="form-same-row">
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
                </div>
                <button
                  type="submit"
                  className=" bg-orange-700 w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Update
                </button>
              </form>

              {/* QR Code Generator Section */}
              <div className="qr-code-section mt-8">
                <h3>Your QR Code (Person ID)</h3>
                <div ref={qrCodeRef}></div>

                <button
                  onClick={handleDownloadQRCode}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Download QR Code
                </button>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}

export default Profile;
