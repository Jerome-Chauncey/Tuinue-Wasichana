import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/CreateStory.css";

const CreateStory = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    donor_id: "",
    beneficiary_id: "",
    inventory: "",
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [donors, setDonors] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "charity") {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/charity-dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setDonors(data.donors || []);
        setBeneficiaries(
          data.stories?.map((s) => ({
            id: s.beneficiary_id,
            name: s.beneficiary,
          })) || []
        );
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("donor_id", formData.donor_id);
    form.append("beneficiary_id", formData.beneficiary_id);
    form.append("inventory", formData.inventory);
    if (image) form.append("image", image);

    try {
      const response = await fetch("http://localhost:5000/api/create-story", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });
      if (!response.ok) throw new Error("Failed to create story");
      navigate("/charity-dashboard/stories");
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="flex items-center justify-between border-b border-[#eaeff1] px-10 py-3">
        <h2 className="text-[#101618] text-lg font-bold">Tuinue Wasichana</h2>
        <button
          onClick={() => navigate("/charity-dashboard")}
          className="px-3 py-2 text-[#101618] text-sm font-medium"
        >
          Back to Dashboard
        </button>
      </header>
      <div className="flex flex-1 justify-center py-5">
        <div className="flex flex-col max-w-[960px] w-full">
          <h1 className="text-[#101618] text-[32px] font-bold p-4">
            Create a Story
          </h1>
          <form onSubmit={handleSubmit} className="p-4">
            <div className="mb-4">
              <label className="block text-[#101618] text-sm font-medium">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border border-[#d4dfe2] rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-[#101618] text-sm font-medium">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border border-[#d4dfe2] rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-[#101618] text-sm font-medium">
                Donor
              </label>
              <select
                name="donor_id"
                value={formData.donor_id}
                onChange={handleChange}
                className="w-full p-2 border border-[#d4dfe2] rounded"
                required
              >
                <option value="">Select Donor</option>
                {donors.map((donor) => (
                  <option key={donor.email} value={donor.email}>
                    {donor.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-[#101618] text-sm font-medium">
                Beneficiary
              </label>
              <select
                name="beneficiary_id"
                value={formData.beneficiary_id}
                onChange={handleChange}
                className="w-full p-2 border border-[#d4dfe2] rounded"
                required
              >
                <option value="">Select Beneficiary</option>
                {beneficiaries.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-[#101618] text-sm font-medium">
                Inventory
              </label>
              <input
                type="text"
                name="inventory"
                value={formData.inventory}
                onChange={handleChange}
                className="w-full p-2 border border-[#d4dfe2] rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-[#101618] text-sm font-medium">
                Image
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full p-2 border border-[#d4dfe2] rounded"
                accept="image/*"
                required
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#101618] text-white rounded"
            >
              Submit Story
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateStory;
