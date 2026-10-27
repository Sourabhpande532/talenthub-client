import React from "react";
import { Hero } from "../../components/Hero/Hero";
import "../Landing/Landing.css";
import { FeatureStats } from "../../components/Stats/Stats";
import { FeaturedJob } from "../../components/FeaturedJob/FeaturedJob";

const Landing = () => {
  return (
    <main className="landing-page">
      {/* Hero section */}
      <Hero />
      {/* Hiring Companies, Featured Jobs & Recently Posted Jobs */}
      <FeaturedJob />
      {/* Platform Capabilities Section */}
      <FeatureStats />
    </main>
  );
};

export default Landing;
