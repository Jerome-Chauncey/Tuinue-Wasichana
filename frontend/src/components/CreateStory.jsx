import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/CreateStory.css";

const CreateStory = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    donor: "",
    beneficiary: "",
    inventory: "",
  });
  const [charity, setCharity] = useState(null);
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem("loggedInCharityEmail");
    const charities = JSON.parse(localStorage.getItem("charities") || "[]");
    const selectedCharity = charities.find(
      (c) => c.email === email && c.status === "approved"
    );
    if (!selectedCharity) {
      navigate("/login");
      return;
    }
    setCharity(selectedCharity);
    setDonors([
      ...new Set([
        ...selectedCharity.oneTimeDonations.map((d) => d.donor),
        ...selectedCharity.recurringDonations.map((d) => d.donor),
      ]),
    ]);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, description, image, donor, beneficiary, inventory } =
      formData;
    if (
      !title ||
      !description ||
      !image ||
      !donor ||
      !beneficiary ||
      !inventory
    ) {
      alert("Please fill in all fields");
      return;
    }

    const charities = JSON.parse(localStorage.getItem("charities") || "[]");
    const charityIndex = charities.findIndex(
      (c) => c.email === localStorage.getItem("loggedInCharityEmail")
    );
    charities[charityIndex].stories.push({
      title,
      description,
      image,
      donor,
      beneficiary,
      inventory,
    });
    localStorage.setItem("charities", JSON.stringify(charities));

    navigate("/charity-dashboard/stories");
  };

  if (!charity) return null;

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-gray-50 group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#eaeff1] px-10 py-3">
          <h2 className="text-[#101618] text-lg font-bold leading-tight tracking-[-0.015em]">
            Tuinue Wasichana
          </h2>
          <button
            onClick={() => navigate("/login")}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#eaeff1] text-[#101618] text-sm font-bold leading-normal tracking-[0.015em]"
          >
            <span className="truncate">Log Out</span>
          </button>
        </header>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#101618] tracking-tight text-[32px] font-bold leading-tight min-w-72">
                Create a Story
              </p>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#101618] text-base font-medium leading-normal pb-2">
                  Story Title
                </p>
                <input
                  name="title"
                  placeholder="Enter story title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101618] focus:outline-0 focus:ring-0 border border-[#d4dfe2] bg-gray-50 focus:border-[#d4dfe2] h-14 placeholder:text-[#5c7e8a] p-[15px] text-base font-normal leading-normal"
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#101618] text-base font-medium leading-normal pb-2">
                  Story Content
                </p>
                <textarea
                  name="description"
                  placeholder="Write your story here..."
                  value={formData.description}
                  onChange={handleChange}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101618] focus:outline-0 focus:ring-0 border border-[#d4dfe2] bg-gray-50 focus:border-[#d4dfe2] min-h-36 placeholder:text-[#5c7e8a] p-[15px] text-base font-normal leading-normal"
                ></textarea>
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#101618] text-base font-medium leading-normal pb-2">
                  Image URL
                </p>
                <input
                  name="image"
                  placeholder="Enter image URL"
                  value={formData.image}
                  onChange={handleChange}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101618] focus:outline-0 focus:ring-0 border border-[#d4dfe2] bg-gray-50 focus:border-[#d4dfe2] h-14 placeholder:text-[#5c7e8a] p-[15px] text-base font-normal leading-normal"
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#101618] text-base font-medium leading-normal pb-2">
                  Donor
                </p>
                <select
                  name="donor"
                  value={formData.donor}
                  onChange={handleChange}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101618] focus:outline-0 focus:ring-0 border border-[#d4dfe2] bg-gray-50 focus:border-[#d4dfe2] h-14 bg-[image:--select-button-svg] placeholder:text-[#5c7e8a] p-[15px] text-base font-normal leading-normal"
                >
                  <option value="">Select a donor</option>
                  {donors.map((donor, index) => (
                    <option key={index} value={donor}>
                      {donor}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#101618] text-base font-medium leading-normal pb-2">
                  Beneficiary Name
                </p>
                <input
                  name="beneficiary"
                  placeholder="Enter beneficiary name"
                  value={formData.beneficiary}
                  onChange={handleChange}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101618] focus:outline-0 focus:ring-0 border border-[#d4dfe2] bg-gray-50 focus:border-[#d4dfe2] h-14 placeholder:text-[#5c7e8a] p-[15px] text-base font-normal leading-normal"
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#101618] text-base font-medium leading-normal pb-2">
                  Inventory Sent
                </p>
                <input
                  name="inventory"
                  placeholder="Enter inventory sent"
                  value={formData.inventory}
                  onChange={handleChange}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101618] focus:outline-0 focus:ring-0 border border-[#d4dfe2] bg-gray-50 focus:border-[#d4dfe2] h-14 placeholder:text-[#5c7e8a] p-[15px] text-base font-normal leading-normal"
                />
              </label>
            </div>
            <div className="flex px-4 py-3 justify-end">
              <button
                onClick={handleSubmit}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#3f9fbf] text-[#101618] text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Publish Story</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStory;
