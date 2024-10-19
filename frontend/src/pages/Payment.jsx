import React, { useState } from "react";
import Navbar from "../components/Navbar";
import ShaderCanvas from "../components/ShaderCanvas";
import axios from "axios";

const Payment = () => {
  const [step, setStep] = useState(1);
  const [paymentType, setPaymentType] = useState("");
  const [hospitalType, setHospitalType] = useState("Private"); // Default hospital type
  const [amount, setAmount] = useState(49.99); // Fake price for now
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [error, setError] = useState(null);

  // Handle payment type selection
  const handlePaymentSelection = (type) => {
    setPaymentType(type);
    setStep(2);
  };

  // Validate and process payment
  const handlePaymentSubmit = async () => {
    setLoading(true);
    setError(null);
    setResultMessage("");
  
    try {
      // Validate payment method with the backend
      console.log("log", hospitalType, paymentType, amount);
      const response = await axios.post("/payments/process", {
        hospitalType,
        paymentMethod: paymentType,
        amount,
      });
  
      // Handle backend validation errors
      if (response.status === 400 && response.data.message === "Card type not allowed to use.") {
        setError("Card type not allowed for this hospital.");
        setLoading(false);
        setStep(3);
        return;
      }
  
      if (response.status === 400) {
        setError(response.data.message);
        setLoading(false);
        setStep(3);
        return;
      }
  
      // If the response indicates success
      if (response.status === 200) {
        // Mock payment outcome
        const outcome = prompt(
          `Mock Payment for ${paymentType}. What do you want to do? (s for Successful, c for Cancelled, e for Error)`
        ).toLowerCase();
  
        if (outcome === "s") {
          setResultMessage(
            `Payment of $${amount} using ${paymentType} was successful.`
          );
        } else if (outcome === "c") {
          setError("Payment was cancelled.");
        } else if (outcome === "e") {
          setError("An error occurred while processing the payment.");
        } else {
          setError("Invalid mock outcome. Please choose 's', 'c', or 'e'.");
        }
      }
    } catch (err) {
      setError("Failed to process payment. Please try again.");
    }
  
    setLoading(false);
    setStep(3);
  };
  

  return (
    <>
      <Navbar />
      <ShaderCanvas />
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-white/30 backdrop-blur-sm">
        <div className="w-full max-w-2xl p-10 bg-white/90 rounded-lg shadow-2xl">
          <h2 className="text-4xl font-semibold text-center mb-8 text-gray-800">
            {step === 1
              ? "Select Payment Type"
              : step === 2
              ? "Confirm Payment"
              : "Payment Result"}
          </h2>

          {step === 1 && (
            <div className="flex flex-col gap-6">
              <p className="text-lg text-gray-700 text-center mb-4">
                Hospital Type: <strong>{hospitalType}</strong>
              </p>
              <p className="text-lg text-gray-700 text-center mb-4">
                Amount: <strong>${amount}</strong>
              </p>
              <button
                className="bg-blue-500 text-white px-8 py-4 rounded-lg text-xl hover:bg-blue-600 transition"
                onClick={() => handlePaymentSelection("CreditCard")}
              >
                Pay with Credit Card
              </button>
              <button
                className="bg-green-500 text-white px-8 py-4 rounded-lg text-xl hover:bg-green-600 transition"
                onClick={() => handlePaymentSelection("DebitCard")}
              >
                Pay with Debit Card
              </button>
              <button
                className="bg-yellow-500 text-white px-8 py-4 rounded-lg text-xl hover:bg-yellow-600 transition"
                onClick={() => handlePaymentSelection("Insurance")}
              >
                Pay with Insurance
              </button>
              <button
                className="bg-purple-500 text-white px-8 py-4 rounded-lg text-xl hover:bg-purple-600 transition"
                onClick={() => handlePaymentSelection("Government")}
              >
                Pay with Government
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-8">
              <div className="text-center text-gray-800">
                <p className="text-2xl">
                  You selected: <strong>{paymentType}</strong>
                </p>
                <p className="text-xl mt-4">
                  Hospital Type: <strong>{hospitalType}</strong>
                </p>
                <p className="text-xl mt-4">
                  Amount: <strong>${amount}</strong>
                </p>
              </div>
              <button
                className="bg-blue-500 text-white px-8 py-4 rounded-lg text-xl hover:bg-blue-600 transition"
                onClick={handlePaymentSubmit}
              >
                Confirm Payment
              </button>
              <button
                className="text-gray-600 underline text-lg mt-2"
                onClick={() => setStep(1)}
              >
                Go Back
              </button>
            </div>
          )}

          {loading && (
            <div className="flex-col gap-4 w-full flex items-center justify-center">
              <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
                <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"></div>
              </div>
            </div>
          )}

          {step === 3 && !loading && (
            <div className="text-center text-gray-800">
              {error ? (
                <p className="text-red-500 text-2xl">{error}</p>
              ) : (
                <p className="text-green-500 text-2xl">{resultMessage}</p>
              )}
              <button
                className="bg-blue-500 text-white px-8 py-4 rounded-lg text-xl hover:bg-blue-600 transition mt-6"
                onClick={() => {
                  setStep(1);
                  setPaymentType("");
                  setAmount(49.99); // Reset amount if needed
                  setResultMessage("");
                  setError(null);
                }}
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Payment;
