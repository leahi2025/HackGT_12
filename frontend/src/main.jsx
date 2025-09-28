import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Appointment from "./Appointment.jsx";
import App from "./App.jsx";
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";
import Profile from "./Profile.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProtectedRoute> <Profile /> </ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
        <Route path="/appointments/:id" element={<ProtectedRoute> <Appointment /> </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
