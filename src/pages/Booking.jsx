// pages/Booking.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Booking.css";
import { Loader } from "react-feather"; // at top


const Booking = () => {
  const navigate = useNavigate();
  const selectedFlight = JSON.parse(localStorage.getItem("selectedFlight"));
  const [passenger, setPassenger] = useState({ name: "", age: "", email: "" });
  const [error, setError] = useState("");
  const [price, setPrice] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);


  useEffect(() => {
    if (!selectedFlight) navigate("/priyankaugale1/user");
    else setPrice(Math.floor(Math.random() * 5000 + 1000));
  }, [selectedFlight, navigate]);

  const handleChange = (e) => {
    setPassenger({ ...passenger, [e.target.name]: e.target.value });
  };

  const validateDetails = () => {
    if (!passenger.name || !passenger.age || !passenger.email) {
      toast.error("Please fill all fields");
      return false;
    }
    if (!/^[a-zA-Z\s]+$/.test(passenger.name)) {
      toast.error("Name should contain only letters");
      return false;
    }
    if (Number(passenger.age) < 1 || Number(passenger.age) > 120) {
      toast.error("Enter a valid age between 1 and 120");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(passenger.email)) {
      toast.error("Enter a valid email");
      return false;
    }
    return true;
  };

  const handlePayNow = () => {
    if (!validateDetails()) return;
    setShowPayment(true);
  };

  const simulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const success = Math.random() > 0.3;
      if (success) {
        const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
        const bookingId = "BK" + Date.now();
        const newBooking = {
          bookingId,
          flight: selectedFlight,
          passenger,
          price,
          date: new Date().toISOString(),
        };
        bookings.push(newBooking);
        localStorage.setItem("bookings", JSON.stringify(bookings));
        setPaymentSuccess(true); // show loader briefly
        setTimeout(() => {
          navigate("/priyankaugale1/confirmation", { state: { booking: newBooking } });
        }, 1000); // 1s loader before redirect
      } else {
        toast.error("Payment Failed. Try Again", { theme: "colored" });
      }
    }, 2000);
  };


  return (
    <div className="booking-container">
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="booking-card">
        <h2 className="booking-title">Flight Booking</h2>
        <div className="booking-flex">
          <div className="flight-summary">
            <h3>Booking Details</h3>
            {selectedFlight && (
              <>
                <p><strong>Airline:</strong> {selectedFlight.airline?.name}</p>
                <p><strong>Flight:</strong> {selectedFlight.flight?.iata}</p>
                <p><strong>From:</strong> {selectedFlight.departure?.iata}</p>
                <p><strong>To:</strong> {selectedFlight.arrival?.iata}</p>
                <p><strong>Departure:</strong> {new Date(selectedFlight.departure?.scheduled).toLocaleString()}</p>
                <p><strong>Price:</strong> ₹{price}</p>
              </>
            )}
          </div>

          <div className="passenger-form">
            <h3>Passenger Details</h3>
            <input name="name" placeholder="Name" onChange={handleChange} />
            <input name="age" placeholder="Age" type="number" onChange={handleChange} />
            <input name="email" placeholder="Email" type="email" onChange={handleChange} />

            {!showPayment ? (
              <button className="pay-btn" onClick={handlePayNow}>Proceed to Payment</button>
            ) : (
              <div className="payment-gateway">
                <h4>Secure Online Payment</h4>
                <p>Click below to complete your booking</p>
                <button className="pay-btn" onClick={simulatePayment} disabled={isProcessing}>
                  {isProcessing ? (
                    <span>
                      <Loader className="spin" size={18} /> Processing...
                    </span>
                  ) : "Pay Now"}

                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
