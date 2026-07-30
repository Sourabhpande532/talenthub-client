import React from "react";
import { Hero } from "../../components/Hero/Hero";
import "../Landing/Landing.css";
import { FeatureStats } from "../../components/Stats/Stats";
import { FeaturedJob } from "../../components/FeaturedJob/FeaturedJob";

const Landing = () => {
  return (
    <div className='landing-page'>
      {/* Hero section */}
      <Hero />
      {/* Featured Jobs Section */}
      <FeaturedJob />
      {/* Stats/Features Section */}
      <FeatureStats />
    </div>
  );
};

export default Landing;
