import React from "react";
import Hero from "@/components/Landing/Hero.jsx";
import Features from "@/components/Landing/Features.jsx";
import Footer from "@/components/Landing/Footer.jsx";
import skyline from "@/assets/skyline.png";

export default function Landing() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, var(--c-bg-app), var(--c-bg-surface-hover))",
        color: "var(--c-text-primary)",
      }}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2rem" }}>
        <Hero />

        <div
          style={{
            marginTop: "40px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            backgroundImage: `url(${skyline})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "bottom center",
            padding: "120px 0 140px",
          }}
        >
          <Features />
        </div>
      </div>

      <Footer />
    </div>
  );
}

