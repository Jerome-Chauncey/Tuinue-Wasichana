import { useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  // Static charity data
  const [charities] = useState([
    {
      id: 1,
      name: "Hope for Girls",
      email: "hopeforgirls@example.com",
      mission: "Providing sanitary towels to girls in rural Kenya.",
      image:
        "https://hopeforgirlsandwomen.files.wordpress.com/2018/02/flip-flops.jpg",
    },
    {
      id: 2,
      name: "Empower Sisters",
      email: "empowersisters@example.com",
      mission: "Building toilets for schools in underserved areas.",
      image:
        "https://peacekeeping.un.org/sites/default/files/styles/1200x500/public/field/image/school_mali_2013.jpg?itok=F1aMigvg",
    },
    {
      id: 3,
      name: "Bright Future",
      email: "brightfuture@example.com",
      mission: "Ensuring menstrual hygiene education for young girls.",
      image:
        "https://voodooneon.com/cdn/shop/files/the-future-is-bright-multi-color.jpg?v=1699932212&width=2000",
    },
  ]);

  // // Uncomment when backend is ready
  // const [charities, setCharities] = useState([]);
  // useEffect(() => {
  //   fetch('/api/charities')
  //     .then(response => response.json())
  //     .then(data => setCharities(data))
  //     .catch(error => console.error('Error fetching charities:', error));
  // }, []);

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#f9f8fc] group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#ebe7f3] px-10 py-3">
          <div className="flex items-center gap-4 text-[#120e1b]">
            <h2 className="text-[#120e1b] text-lg font-bold leading-tight tracking-[-0.015em]">
              Tuinue Wasichana
            </h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <Link
              to="/login"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#ebe7f3] text-[#120e1b] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Login</span>
            </Link>
          </div>
        </header>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="@container">
              <div className="p-4">
                <div
                  className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat gap-8 rounded-lg items-center justify-center p-4"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://www.thestatesman.com/wp-content/uploads/2023/05/students-iStock-1.jpg")',
                  }}
                >
                  <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] text-5xl font-black leading-tight tracking-[-0.033em]">
                      Empowering Girls Through Education
                    </h1>
                    <h2 className="text-white text-sm font-normal leading-normal text-base font-normal leading-normal">
                      Join us in supporting girls' education and well-being in
                      sub-Saharan Africa. Your recurring donations make a
                      lasting impact.
                    </h2>
                  </div>
                  <Link
                    to="/donor-signup"
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 h-12 px-5 bg-[#5a19e5] text-[#f9f8fc] text-sm font-bold leading-normal tracking-[0.015em] text-base font-bold leading-normal tracking-[0.015em]"
                  >
                    <span className="truncate">Donate Now</span>
                  </Link>
                </div>
              </div>
            </div>
            <h2 className="text-[#120e1b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Our Impact
            </h2>
            <p className="text-[#120e1b] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
              Tuinue Wasichana is dedicated to creating opportunities for girls
              in sub-Saharan Africa. We partner with local charities to provide
              access to quality education, mentorship, and resources that
              empower girls to reach their full potential.
            </p>
            <h2 className="text-[#120e1b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Featured Charities
            </h2>
            {charities.map((charity) => (
              <div className="p-4" key={charity.id}>
                <div className="flex items-stretch justify-between gap-4 rounded-lg bg-[#f9f8fc] p-4 shadow-[0_0_4px_rgba(0,0,0,0.1)]">
                  <div className="flex flex-[2_2_0px] flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-[#120e1b] text-base font-bold leading-tight">
                        {charity.name}
                      </p>
                      <p className="text-[#654e97] text-sm font-normal leading-normal">
                        {charity.mission}
                      </p>
                    </div>
                  </div>
                  <div
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg flex-1"
                    style={{ backgroundImage: `url("${charity.image}")` }}
                  ></div>
                </div>
              </div>
            ))}
            <h2 className="text-[#120e1b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Apply to be a Charity
            </h2>
            <p className="text-[#120e1b] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
              Are you a charity dedicated to girls' education and well-being in
              sub-Saharan Africa? Apply to join our network and receive
              recurring donations from our supporters.
            </p>
            <div className="flex px-4 py-3 justify-center">
              <Link
                to="/charity-signup"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#ebe7f3] text-[#120e1b] text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Apply Now</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
