// pages/Confirmation.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Confirmation.css";
import { CheckCircle } from "react-feather";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timeout = setTimeout(() => {
      const data = location.state?.booking;
      setBooking(data);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [location]);

  if (loading) {
    return (
      <div className="confirmation-spinner">
        <div className="loader"></div>
        <p>Loading confirmation...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="confirmation-spinner">
        <h2>No booking found</h2>
        <button className="back-btn" onClick={() => navigate("/priyankaugale1/user")}>Back to Search</button>
      </div>
    );
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <div className="confirmation-header">
          <CheckCircle size={48} color="#28a745" />
          <h2>Booking Confirmed!</h2>
          <p>Your booking was successful. Details are below.</p>
        </div>

        <div className="confirmation-info">
          <div><strong>Booking ID:</strong> {booking.bookingId}</div>
          <div><strong>Passenger:</strong> {booking.passenger.name}</div>
          <div><strong>Email:</strong> {booking.passenger.email}</div>
          <div><strong>Flight:</strong> {booking.flight?.flight?.iata} - {booking.flight?.airline?.name}</div>
          <div><strong>From:</strong> {booking.flight?.departure?.iata}</div>
          <div><strong>To:</strong> {booking.flight?.arrival?.iata}</div>
          <div><strong>Departure:</strong> {new Date(booking.flight?.departure?.scheduled).toLocaleString()}</div>
          <div><strong>Total Paid:</strong> ₹{booking.price}</div>
        </div>

        <button className="back-btn" onClick={() => navigate("/priyankaugale1/user")}>Search More Flights</button>
      </div>
    </div>
  );
};

export default Confirmation;
