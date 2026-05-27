import React from "react";
import BannerSlider from "../components/BannerSlider";
import { useApp } from "../context/AppContext";

export default function HeroSection({ navigate }) {
  const { slides } = useApp();
  const activeSlides = slides.filter((s) => s.active);
  return <BannerSlider slides={activeSlides} navigate={navigate} />;
}
