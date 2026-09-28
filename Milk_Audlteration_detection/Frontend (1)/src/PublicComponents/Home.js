import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import background from "../background.png";

const Home = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <div
      className="home-container"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="overlay">
        {/* <h1 className="home-title">Smart Milk Booth System</h1> */}
        <button
          className="get-started-btn"
          onClick={handleClick}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
