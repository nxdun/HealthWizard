import React, { useState } from "react";
import "../styles/bookappointment.css";
import axios from "axios";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import jwt_decode from "jwt-decode";

const BookAppointment = ({ setModalOpen, ele }) => {
  // Decode the token to get userId
  const token = localStorage.getItem("token");
  const { personId } = token ? jwt_decode(token) : { personId: null };

  const [formDetails, setFormDetails] = useState({
    date: "",
    time: "",
    service: "", // Add service field to state
  });

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  const selectTime = (time) => {
    setFormDetails((prevDetails) => ({
      ...prevDetails,
      time, // Set selected time
    }));
  };


  const bookAppointment = async (e) => {
    e.preventDefault();
    if (!personId) {
      toast.error("User not found. Please log in.");
      return;
    }

    try {
      const appointmentData = {
        appointmentID: Date.now().toString(), // Unique appointment ID
        appointmentDate: new Date(`${formDetails.date}T${formDetails.time}`), // Combine date and time
        patientID: personId, // Use the userId from decoded token
        doctorID: ele?.personId?._id, // Ensure this is correctly retrieved
        service: formDetails.service, // Set service from form
      };

      console.log("Appointment Data:", appointmentData); // Log the data

      await toast.promise(
        axios.post(
          "/appointments/",
          appointmentData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          success: "Appointment booked successfully",
          error: "Unable to book appointment",
          loading: "Booking appointment..",
        }
      );
      setModalOpen(false);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error); // Log the error response
      toast.error("An error occurred while booking the appointment.");
    }
  };

  return (
    <div className="modal flex-center">
      <div className="modal__content">
        <h2 className="page-heading">Book Appointment</h2>
        <IoMdClose
          onClick={() => {
            setModalOpen(false);
          }}
          className="close-btn"
        />
        <div className="register-container flex-center book">
          <form className="register-form" onSubmit={bookAppointment}>
            <input
              type="date"
              name="date"
              className="form-input"
              value={formDetails.date}
              onChange={inputChange}
              required // Optional: Use if you want to enforce field completion
            />
            <div className="time-selection">
              <h3>Select Time Slot</h3>
              <div className="time-buttons">
                {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"].map((time, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`time-btn ${formDetails.time === time ? "selected" : ""}`}
                    onClick={() => selectTime(time)}
                  >
                    {time === "12:00" ? "12:00 PM" : `${parseInt(time.split(":")[0])}:${time.split(":")[1]} ${parseInt(time.split(":")[0]) >= 12 ? "PM" : "AM"}`}
                  </button>
                ))}
              </div>
            </div>

            <select
              name="service"
              className="form-input"
              value={formDetails.service}
              onChange={inputChange}
              required // Optional: Use if you want to enforce field completion
            >
              <option value="" disabled>Select a service</option> {/* Placeholder option */}
              <option value="General Consultation">General Consultation</option>
              <option value="Dental Checkup">Dental Checkup</option>
              <option value="Physical Therapy">Physical Therapy</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Pediatrics">Pediatrics</option>
              {/* Add more service options as needed */}
            </select>
            <button type="submit" className="btn form-btn">
              Book
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
