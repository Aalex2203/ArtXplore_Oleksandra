import React from "react";

const cards = [
  {
    title: "Gallery Management",
    body: "Showcase your portfolio, requirements, and availability in one professional link.",
  },
  {
    title: "Artist Profiles",
    body: "Manage exhibitions, open calls, and artist contracts from one dashboard.",
  },
  {
    title: "Discovery Engine",
    body: "Discover collaborations, local shows, and residency opportunities tailored to your criteria.",
  },
];

export default function Features() {
  return (
    <section
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "24px",
          maxWidth: "1000px",
          width: "100%",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {cards.map((card) => (
          <div
            key={card.title}
            style={{
              backgroundColor: "var(--c-bg-surface)",
              padding: "22px 26px",
              borderRadius: "24px",
              width: "280px",
              boxShadow: "var(--shadow-lg)",
              color: "var(--c-text-primary)",
              border: "1px solid var(--c-border)",
            }}
          >
            <h3
              style={{
                margin: 0,
                marginBottom: "10px",
                fontSize: "18px",
                fontWeight: "700",
                color: "var(--c-brand-primary)",
              }}
            >
              {card.title}
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: "13px",
                lineHeight: 1.6,
                color: "var(--c-text-secondary)",
              }}
            >
              {card.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
