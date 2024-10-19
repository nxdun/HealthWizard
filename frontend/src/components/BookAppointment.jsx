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
    location: "", // Add location field to state
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
        doctorID: ele?._id, // Ensure this is correctly retrieved
        service: formDetails.service, // Set service from form
        location: formDetails.location, // Set location from form
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

  // Function to get today's date in 'YYYY-MM-DD' format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
              min={getTodayDate()} // Set the minimum date to today
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
              <option value="Orthopedics">Orthopedics</option>
              <option value="Neurology">Neurology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Gynecology">Gynecology</option>
              <option value="Ophthalmology">Ophthalmology</option>
              {/* Add more service options as needed */}
            </select>

            {/* New Location Selection */}
            <select
              name="location"
              className="form-input"
              value={formDetails.location}
              onChange={inputChange}
              required // Optional: Use if you want to enforce field completion
            >
              <option value="" disabled>Where Do You Want To Book</option>
              <option value="Government">Sri Jayawardanapura General Hospital</option>
              <option value="Government">National Hospital of Sri Lanka -colombo</option>
              <option value="Government">National Hospital - Kandy</option>
              <option value="Government">Vasana Hospital</option>
              <option value="Government">Lady Ridgeway Hospital for Children</option>
              <option value="Government">Nawaloka Hospitals PLC</option>
              <option value="Private">The Lanka Hospitals Corporation PLC</option>
              <option value="Private">Kings Hospital Colombo</option>
              <option value="Private">Hemas Hospital Wattala</option>
              <option value="Private">Dr. Neville Fernando Teaching Hospital</option>
              <option value="Private">Ninewells Hospital (Pvt) Ltd.</option>
              <option value="Private">Joseph Fraser Memorial Hospital</option>
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
