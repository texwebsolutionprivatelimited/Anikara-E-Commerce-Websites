import React from "react";
import BannerSlider from "../components/BannerSlider";

const HERO_SLIDES = [
  {
    id: 1,
    title: "Summer Sale 50% OFF",
    subtitle: "SEASONAL EDIT",
    desc: "Luxe silhouettes for warmer days. Woven in French linen, soft organic cottons, and breezy satin silk fits.",
    navigatePage: "products",
    navigateParams: { badge: "50% OFF" },
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80"
  },
  {
    id: 2,
    title: "Trending Co-word Sets",
    subtitle: "MINIMAL MODERNIST",
    desc: "Effortless coordinating sets crafted to transition seamlessly from morning lounge to sunset styling.",
    navigatePage: "products",
    navigateParams: { category: "Co-ords" },
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80"
  },
  {
    id: 3,
    title: "New Ethnic Collection",
    subtitle: "FESTIVE BLOCKPRINT",
    desc: "Intricate handloom Chanderi silk sarees and detailed blockprint embroidered kurta sets.",
    navigatePage: "products",
    navigateParams: { category: "Ethnic Wear" },
    image: "https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=1600&q=80"
  },
  {
    id: 4,
    title: "Cozy Sleepwear Deals",
    subtitle: "NIGHT SUIT ESSENTIALS",
    desc: "Indulge in nightly luxury. Liquid satin pajama sets and organic cotton sleep shirts starting from ₹1,899.",
    navigatePage: "products",
    navigateParams: { category: "Night Suit" },
    image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=1600&q=80"
  }
];

export default function HeroSection({ navigate }) {
  return (
    <BannerSlider slides={HERO_SLIDES} navigate={navigate} />
  );
}
