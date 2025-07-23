import { useNavigate } from "react-router-dom";
import "../css/Login.css";

const CharityPending = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-gray-50 group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7f0f3] px-10 py-3">
          <div className="flex items-center gap-4 text-[#0e181b]">
            <h2 className="text-[#0e181b] text-lg font-bold leading-tight tracking-[-0.015em]">
              Tuinue Wasichana
            </h2>
          </div>
        </header>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <h1 className="text-[#0e181b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Application Status
            </h1>
            <div className="px-4 py-3">
              <p className="text-[#0e181b] text-sm font-normal leading-normal">
                Your application is still awaiting approval from the
                administrator, please log in at a later time.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#3f9fbf] text-[#0e181b] text-sm font-bold leading-normal tracking-[0.015em] mt-4"
              >
                <span className="truncate">Log In</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharityPending;
