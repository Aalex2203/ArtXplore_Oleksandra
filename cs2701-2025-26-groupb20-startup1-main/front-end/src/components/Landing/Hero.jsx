import React from "react";

export default function Hero() {
  return (
    <div className="hero-bg">
      <section
        style={{
          textAlign: "center",
          padding: "20px 24px 60px",
          maxWidth: "900px",
          margin: "0 auto",
          color: "var(--c-text-primary)",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 800,
            marginBottom: "25px",
            color: "var(--c-brand-primary)",
            letterSpacing: "-0.03em",
          }}
        >
          ArtXplore
        </h1>

        <p
          style={{
            fontSize: "1.2rem",
            lineHeight: 1.6,
            marginBottom: "32px",
            color: "var(--c-text-secondary)",
          }}
        >
          Xplore bridges artists, galleries, residencies, and collectors in one
          seamless platform built for the future of creativity.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <button style={primaryButtonStyle}>Browse artists</button>
          <button style={secondaryButtonStyle}>Start creating</button>
        </div>
      </section>
    </div>
  );
}

const baseButton = {
  border: "none",
  padding: "12px 28px",
  borderRadius: "999px",
  fontSize: "16px",
  cursor: "pointer",
  transition: "all 0.2s",
};

const primaryButtonStyle = {
  ...baseButton,
  background: "linear-gradient(135deg, var(--c-brand-primary), var(--c-brand-primary-hover))",
  color: "#fff",
  boxShadow: "0 10px 24px rgba(99,102,241,0.2)",
};

const secondaryButtonStyle = {
  ...baseButton,
  background: "var(--c-bg-surface)",
  color: "var(--c-text-primary)",
  border: "1px solid var(--c-border)",
};
