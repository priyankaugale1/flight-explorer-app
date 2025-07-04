// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import { useAuth, AuthProvider } from "./context/AuthContext";
import FlightSearch from "./pages/FlightSearch";
import Booking from './pages/Booking';
import Confirmation from "./pages/Confirmation";
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './pages/Navbar';
import Footer from './pages/Footer';
import { ToastContainer } from "react-toastify";
import BookedDetails from "./pages/BookedDetails";

const UserDashboard = () => <FlightSearch />;

const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
};

// Reusable layout for authenticated routes
const Layout = () => (
  <>
    <Navbar />
    <main style={{ flex: 1 }}>
      <Outlet />
    </main>
    <Footer />
  </>
);

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Pages - No Navbar/Footer */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Pages - With Navbar/Footer */}
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/login" />} />

            <Route
              path="/user"
              element={
                <PrivateRoute role="user">
                  <UserDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute role="admin">
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/booking"
              element={
                <PrivateRoute role="user">
                  <Booking />
                </PrivateRoute>
              }
            />
            <Route
              path="/confirmation"
              element={
                <PrivateRoute role="user">
                  <Confirmation />
                </PrivateRoute>
              }
            />
            <Route path="/admin/bookings" element={
              <PrivateRoute role="admin">
                <BookedDetails />
              </PrivateRoute>
            } />
          </Route>
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
};

export default App;
