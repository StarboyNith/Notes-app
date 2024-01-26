import React from "react";
import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContexts";
import Dashboard from "./components/Dashboard";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import Updateprofile from "./components/Updateprofile";

function PrivateRoute({ element }) {
  const { currentUser } = useAuth();

  return currentUser ? element : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/updateprofile" element={<PrivateRoute element={<Updateprofile />} />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
