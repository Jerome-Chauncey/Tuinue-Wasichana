import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Welcome to Tuinue Wasichana</h1>
      <p>
        Support girls' education by providing sanitary towels and sanitation
        facilities.
      </p>
      <div>
        <Link to="/donor-signup">
          <button>Donate Now</button>
        </Link>
      </div>
      <div>
        <Link to="/charity-signup">
          <button>Apply to be a Charity</button>
        </Link>
      </div>
      <p>
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </div>
  );
};

export default Home;
