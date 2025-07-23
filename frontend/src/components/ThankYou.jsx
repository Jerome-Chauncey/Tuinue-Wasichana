import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/ThankYou.css";

const ThankYou = () => {
  const navigate = useNavigate();
  const donation = JSON.parse(localStorage.getItem("donorDonation") || "{}");
  const { name, amount, charity, frequency } = donation;

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#f8fbfc] group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7f0f3] px-10 py-3">
          <h2 className="text-[#0e181b] text-lg font-bold leading-tight tracking-[-0.015em]">
            Tuinue Wasichana
          </h2>
        </header>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <h2 className="text-[#0e181b] tracking-tight text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
              Thank you, {name === "Anonymous" ? "Donor" : name}!
            </h2>
            <p className="text-[#0e181b] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
              Your generous contribution will help provide educational resources
              and support to girls in sub-Saharan Africa.
            </p>
            <h3 className="text-[#0e181b] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Donation Summary
            </h3>
            <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d0e1e7] py-5">
                <p className="text-[#4e8597] text-sm font-normal leading-normal">
                  Amount
                </p>
                <p className="text-[#0e181b] text-sm font-normal leading-normal">
                  {amount}
                </p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d0e1e7] py-5">
                <p className="text-[#4e8597] text-sm font-normal leading-normal">
                  Charity
                </p>
                <p className="text-[#0e181b] text-sm font-normal leading-normal">
                  {charity}
                </p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d0e1e7] py-5">
                <p className="text-[#4e8597] text-sm font-normal leading-normal">
                  Frequency
                </p>
                <p className="text-[#0e181b] text-sm font-normal leading-normal">
                  {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 max-w-[480px] justify-center">
                <button
                  onClick={handleLogin}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#19b2e5] text-[#0e181b] text-sm font-bold leading-normal tracking-[0.015em] grow"
                >
                  <span className="truncate">Log In to View Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
