import React from "react";
import image from "../images/heroimg.png";
import "../styles/hero.css";
import ShaderCanvas from "./ShaderCanvas";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
      <ShaderCanvas />
        <h1 className="title-font sm:text-6xl text-5xl mb-4 font-medium text-blue-100">
        Your Well-Being, <br />
        Our Promise
        </h1>
        <p>
        In a rapidly changing world, our commitment is to provide innovative healthcare solutions that prioritize patient well-being. We strive to enhance the quality of care through cutting-edge technology and dedicated support. 
        </p>
      </div>
      <div className="hero-img">
        <img
          src={image}
          alt="hero"
        />
      </div>
    </section>
  );
};

export default Hero;
