import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import CharityDashboard from "./components/CharityDashboard";
import CharitySignUp from "./components/CharitySignup";
import CharityApplicationSubmitted from "./components/CharityApplicationSubmitted";
import CharityPending from "./components/CharityPending";
import CharityApproved from "./components/CharityApproved";
import CharityRejected from "./components/CharityRejected";
import DonorDashboard from "./components/DonorDashboard";
import DonorSignup from "./components/DonorSignup";
import ThankYou from "./components/ThankYou";
import Donations from "./components/Donations";
import Stories from "./components/Stories";
import Charities from "./components/Charities";
import Donate from "./components/Donate";
import Taskbar from "./components/Navbar"; 

const App = () => {
  return (
    <BrowserRouter>
    <Taskbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/charity-signup" element={<CharitySignUp />} />
        <Route path="/donate" element={<Donate />} /> {/* New route */}
        <Route
          path="/charity-application-submitted"
          element={<CharityApplicationSubmitted />}
        />
        <Route path="/charity-pending" element={<CharityPending />} />
        <Route path="/charity-approved" element={<CharityApproved />} />
        <Route path="/charity-rejected" element={<CharityRejected />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/charity-dashboard" element={<CharityDashboard />} />
        <Route path="/donor-dashboard" element={<DonorDashboard />}>
          <Route path="donations" element={<Donations />} />
          <Route path="stories" element={<Stories />} />
          <Route path="charities" element={<Charities />} />
        </Route>
        <Route path="/donor-signup" element={<DonorSignup />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;