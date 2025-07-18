import { BrowserRouter, Routes, Route } from "react-router-dom";
import DonorSignup from "./components/DonorSignup";
import CharitySignup from "./components/CharitySignup";
import Login from "./components/Login";
import Home from "./components/Home";
import DonorDashboard from "./components/DonorDashboard";
import CharityDashboard from "./components/CharityDashboard";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donor-signup" element={<DonorSignup />} />
        <Route path="/charity-signup" element={<CharitySignup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/donor" element={<DonorDashboard />} />
        <Route path="/charity" element={<CharityDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
