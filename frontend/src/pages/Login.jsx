import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/register.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/reducers/rootSlice";
import jwt_decode from "jwt-decode";
import fetchData from "../helper/apiCall";
import ShaderCanvas from "../components/ShaderCanvas";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function Login() {
  const dispatch = useDispatch();
  const [formDetails, setFormDetails] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const inputChange = (e) => {
    const { name, value } = e.target;
    return setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const formSubmit = async (e) => {
    try {
      e.preventDefault();
      const { email, password } = formDetails;
      if (!email || !password) {
        return toast.error("Input field should not be empty");
      } else if (password.length < 5) {
        return toast.error("Password must be at least 5 characters long");
      }

            // Check if login details are for the health manager
      if (email === "health@gmail.com" && password === "health") {
        toast.success("Health Manager Login Successful");
              return navigate("/HealthHome");
      }

      const { data } = await toast.promise(
        axios.post("/user/login", {
          email,
          password,
        }),
        {
          success: "Login successfully",
          error: "Unable to login user",
          loading: "Logging in...",
        }
      );

      localStorage.setItem("token", data.token);
      console.log(jwt_decode(data.token));
      dispatch(setUserInfo(jwt_decode(data.token).userId));
      getUser(jwt_decode(data.token).userId);
    } catch (error) {
      console.log(error);
      return error.message;
    }
  };

  const getUser = async (id) => {
    try {
      const temp = await fetchData(`/user/getuser/${id}`);
      dispatch(setUserInfo(temp));
      return navigate("/");
    } catch (error) {
      return error;
    }
  };

  return (
    <>
    <ShaderCanvas />
    <section className="register-section flex-center">
      <div className="register-container flex-center">
        <h2 className="form-heading">Sign In</h2>
        <form
          onSubmit={formSubmit}
          className="register-form"
        >
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="Enter your email"
            value={formDetails.email}
            onChange={inputChange}
          />
          <input
            type="password"
            name="password"
            className="form-input"
            placeholder="Enter your password"
            value={formDetails.password}
            onChange={inputChange}
          />
          <button
            type="submit"
            className="btn form-btn"
          >
            sign in
          </button>
        </form>
        <p>
          Not a user?{" "}
          <NavLink
            className="login-link"
            to={"/register"}
          >
            Register
          </NavLink>
        </p>
      </div>
    </section>
    </>
  );
}

export default Login;
