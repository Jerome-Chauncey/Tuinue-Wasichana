import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const Donate = () => {
  const [charities, setCharities] = useState([]);
  const [charityId, setCharityId] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("one-time");
  const [anonymous, setAnonymous] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/charities`);
        setCharities(response.data.filter(c => c.status === 'Active' || c.status === 'approved'));
      } catch (error) {
        console.error("Error fetching charities:", error);
        setMessage("Failed to load charities. Please refresh the page.");
      }
    };
    fetchCharities();
  }, []);

  const handleDonate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You must be logged in as a donor to donate.");
      setIsLoading(false);
      return;
    }

    // Enhanced validation
    if (!charityId) {
      setMessage("Please select a charity");
      setIsLoading(false);
      return;
    }

    const selectedCharity = charities.find(c => c.id === Number(charityId));
    if (!selectedCharity) {
      setMessage("Invalid charity selection. Please refresh the page.");
      setIsLoading(false);
      return;
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setMessage("Please enter a valid amount (minimum 1 KSH)");
      setIsLoading(false);
      return;
    }

    try {
      const donationData = {
        charity_id: Number(charityId), // Ensure number type
        amount: parseFloat(amount),
        frequency,
        anonymous
      };

      const res = await axios.post(
        `${API_BASE_URL}/api/donate`,
        donationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(`Donation successful! Thank you.`);
      // Reset form
      setAmount("");
      setCharityId("");
    } catch (err) {
      console.error("Donation error:", err);
      let errorMessage = "Donation failed. Please try again.";
      
      if (err.response) {
        errorMessage = err.response.data?.error || 
                      err.response.data?.message || 
                      errorMessage;
        
        // Specific handling for common errors
        if (err.response.status === 404) {
          errorMessage = "Charity not found. Please select another.";
        } else if (err.response.status === 400) {
          errorMessage = "Invalid data: " + (err.response.data?.details || errorMessage);
        }
      }
      
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="donate-container p-4 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Make a Donation</h2>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <form onSubmit={handleDonate} className="space-y-4">
        <div>
          <label className="block mb-1">Select Charity</label>
          <select
            value={charityId}
            onChange={(e) => setCharityId(e.target.value)}
            className="w-full border rounded p-2"
            required
          >
            <option value="">-- Choose a charity --</option>
            {charities.map((charity) => (
              <option key={charity.id} value={charity.id}>
                {charity.name} - {charity.mission}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Amount (KSH)</label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1">Frequency</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="one-time">One-time</option>
            <option value="recurring">Monthly (Recurring)</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            className="mr-2"
          />
          <label>Donate Anonymously</label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Donate
        </button>
      </form>
    </div>
  );
};

export default Donate;
