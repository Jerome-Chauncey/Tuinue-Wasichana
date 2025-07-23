import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/DonorSignup.css";

const DonorSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    charity: "",
    amount: "",
    frequency: "one-time",
    anonymous: false,
  });

  const charities = JSON.parse(
    localStorage.getItem("charities") || "[]"
  ).filter((c) => c.status === "approved");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, charity, amount, frequency, anonymous } =
      formData;

    // Validate form
    if (!name || !email || !password || !charity || !amount) {
      alert("Please fill in all fields");
      return;
    }

    // Update localStorage
    const charitiesData = JSON.parse(localStorage.getItem("charities") || "[]");
    const selectedCharity = charitiesData.find((c) => c.name === charity);
    if (!selectedCharity) {
      alert("Invalid charity selected");
      return;
    }

    const donation = {
      donor: anonymous ? "Anonymous" : name,
      email: anonymous ? "anonymous@email.com" : email,
      amount: `$${parseFloat(amount).toFixed(2)}`,
      date:
        frequency === "one-time"
          ? new Date().toISOString().split("T")[0]
          : undefined,
      startDate:
        frequency === "monthly"
          ? new Date().toISOString().split("T")[0]
          : undefined,
      billingDate:
        frequency === "monthly"
          ? new Date(new Date().setMonth(new Date().getMonth() + 1))
              .toISOString()
              .split("T")[0]
          : undefined,
    };

    if (frequency === "one-time") {
      selectedCharity.oneTimeDonations.push(donation);
    } else {
      selectedCharity.recurringDonations.push(donation);
    }

    localStorage.setItem("charities", JSON.stringify(charitiesData));

    const validCredentials = JSON.parse(
      localStorage.getItem("validCredentials") || "{}"
    );
    validCredentials.Donor = validCredentials.Donor || [];
    validCredentials.Donor.push({ email, password });
    localStorage.setItem("validCredentials", JSON.stringify(validCredentials));

    localStorage.setItem(
      "donorDonation",
      JSON.stringify({
        name: anonymous ? "Anonymous" : name,
        amount: donation.amount,
        charity,
        frequency,
      })
    );

    localStorage.setItem("loggedInDonorEmail", email);
    navigate("/thank-you");
  };

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
        </header>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#101618] tracking-tight text-[32px] font-bold leading-tight min-w-72">
                Choose a cause to support
              </p>
            </div>
            {charities.map((charity, index) => (
              <label
                key={index}
                className="flex items-center gap-4 bg-gray-50 px-4 min-h-[72px] py-2"
              >
                <input
                  type="radio"
                  name="charity"
                  value={charity.name}
                  onChange={handleChange}
                  className="h-5 w-5 border-2 border-[#d4dfe2] bg-transparent text-transparent checked:border-[#3f9fbf] checked:bg-[image:--radio-dot-svg] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#3f9fbf]"
                />
                <div className="flex flex-col justify-center">
                  <p className="text-[#101618] text-base font-medium leading-normal line-clamp-1">
                    {charity.name}
                  </p>
                  <p className="text-[#5c7e8a] text-sm font-normal leading-normal line-clamp-2">
                    {charity.description ||
                      `Support ${charity.name} in empowering girls.`}
                  </p>
                </div>
              </label>
            ))}
            <h3 className="text-[#101618] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Your Donation
            </h3>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#101618] text-base font-medium leading-normal pb-2">
                  Name
                </p>
                <input
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101618] focus:outline-0 focus:ring-0 border border-[#d4dfe2] bg-gray-50 focus:border-[#d4dfe2] h-14 placeholder:text-[#5c7e8a] p-[15px] text-base font-normal leading-normal"
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#101618] text-base font-medium leading-normal pb-2">
                  Email
                </p>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101618] focus:outline-0 focus:ring-0 border border-[#d4dfe2] bg-gray-50 focus:border-[#d4dfe2] h-14 placeholder:text-[#5c7e8a] p-[15px] text-base font-normal leading-normal"
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#101618] text-base font-medium leading-normal pb-2">
                  Password
                </p>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101618] focus:outline-0 focus:ring-0 border border-[#d4dfe2] bg-gray-50 focus:border-[#d4dfe2] h-14 placeholder:text-[#5c7e8a] p-[15px] text-base font-normal leading-normal"
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#101618] text-base font-medium leading-normal pb-2">
                  Amount
                </p>
                <input
                  name="amount"
                  type="number"
                  placeholder="$0"
                  value={formData.amount}
                  onChange={handleChange}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101618] focus:outline-0 focus:ring-0 border border-[#d4dfe2] bg-gray-50 focus:border-[#d4dfe2] h-14 placeholder:text-[#5c7e8a] p-[15px] text-base font-normal leading-normal"
                />
              </label>
            </div>
            <div className="flex flex-col gap-3 p-4">
              <label className="flex items-center gap-4 rounded-xl border border-solid border-[#d4dfe2] p-[15px]">
                <input
                  type="radio"
                  name="frequency"
                  value="one-time"
                  checked={formData.frequency === "one-time"}
                  onChange={handleChange}
                  className="h-5 w-5 border-2 border-[#d4dfe2] bg-transparent text-transparent checked:border-[#3f9fbf] checked:bg-[image:--radio-dot-svg] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#3f9fbf]"
                />
                <div className="flex grow flex-col">
                  <p className="text-[#101618] text-sm font-medium leading-normal">
                    One-time
                  </p>
                </div>
              </label>
              <label className="flex items-center gap-4 rounded-xl border border-solid border-[#d4dfe2] p-[15px]">
                <input
                  type="radio"
                  name="frequency"
                  value="monthly"
                  checked={formData.frequency === "monthly"}
                  onChange={handleChange}
                  className="h-5 w-5 border-2 border-[#d4dfe2] bg-transparent text-transparent checked:border-[#3f9fbf] checked:bg-[image:--radio-dot-svg] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#3f9fbf]"
                />
                <div className="flex grow flex-col">
                  <p className="text-[#101618] text-sm font-medium leading-normal">
                    Monthly
                  </p>
                </div>
              </label>
            </div>
            <div className="px-4">
              <label className="flex gap-x-3 py-3 flex-row">
                <input
                  type="checkbox"
                  name="anonymous"
                  checked={formData.anonymous}
                  onChange={handleChange}
                  className="h-5 w-5 rounded border-[#d4dfe2] border-2 bg-transparent text-[#3f9fbf] checked:bg-[#3f9fbf] checked:border-[#3f9fbf] checked:bg-[image:--checkbox-tick-svg] focus:ring-0 focus:ring-offset-0 focus:border-[#d4dfe2] focus:outline-none"
                />
                <p className="text-[#101618] text-base font-normal leading-normal">
                  Donate anonymously
                </p>
              </label>
            </div>
            <div className="flex px-4 py-3 justify-end">
              <button
                onClick={handleSubmit}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#3f9fbf] text-[#101618] text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Continue</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorSignup;
