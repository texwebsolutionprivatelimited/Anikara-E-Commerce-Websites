import React from "react";
import BannerSlider from "../components/BannerSlider";

// Local banner slides for development/production (removes Firebase dependency)
const LOCAL_SLIDES = [
  {
    id: "local-slide-1",
    subtitle: "New Arrival",
    title: "Upgrade Your Style",
    desc: "Discover premium apparel and trends curated just for you.",
    image: "/5.png",
    mobileImage: "/111.jpeg",
    navigatePage: "products",
    navigateParams: {},
    active: true,
    isFullWidth: true
  },
  {
    id: "local-slide-2",
    subtitle: "Exclusive Collection",
    title: "Deal of the Day",
    desc: "Up to 50% off on top-selling garments. High quality guaranteed.",
    image: "/6.png",
    mobileImage: "/44.jpeg",
    navigatePage: "products",
    navigateParams: {},
    active: true,
    isFullWidth: true
  },
  {
    id: "local-slide-3",
    subtitle: "Trending Sale",
    title: "Season Clearance",
    desc: "Explore amazing deals on seasonal favorites while stocks last.",
    image: "/7.png",
    mobileImage: "/1.jpeg",
    navigatePage: "products",
    navigateParams: {},
    active: true,
    isFullWidth: true
  },
  {
    id: "local-slide-4",
    subtitle: "Luxury Fabrics",
    title: "Premium Cotton Collection",
    desc: "Experience ultimate comfort with our handpicked premium cotton fabrics.",
    image: "/9.png",
    mobileImage: "/2.jpeg",
    navigatePage: "products",
    navigateParams: {},
    active: true,
    isFullWidth: true
  },
  {
    id: "local-slide-5",
    subtitle: "Ethnic Wear",
    title: "Traditional Elegance",
    desc: "Timeless designs and embroidery crafted for every celebration.",
    image: "/10.png",
    mobileImage: "/4.jpeg",
    navigatePage: "products",
    navigateParams: {},
    active: true,
    isFullWidth: true
  }
];

// Fallback banner slide if LOCAL_SLIDES is empty or has no active slides
const DEFAULT_FALLBACK_SLIDE = {
  id: "fallback-default",
  subtitle: "Welcome to Anikara",
  title: "Premium Fashion Collection",
  desc: "Discover beautiful, high-quality styles designed for you.",
  image: "/1.jpeg",
  mobileImage: "/1.jpeg",
  navigatePage: "products",
  navigateParams: {},
  active: true,
  isFullWidth: true
};

export default function HeroSection({ navigate }) {
  // Use active slides from the local array
  const activeSlides = (LOCAL_SLIDES || []).filter((s) => s.active);
  
  // If no slides exist (or none are active), fallback to a default banner
  const slidesToRender = activeSlides.length > 0 ? activeSlides : [DEFAULT_FALLBACK_SLIDE];

  return <BannerSlider slides={slidesToRender} navigate={navigate} />;
}

