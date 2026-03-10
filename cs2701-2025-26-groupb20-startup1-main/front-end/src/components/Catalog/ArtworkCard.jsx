import React from "react";

export default function ArtworkCard({ artwork, onBook }) {
  return (
    <div
      style={{
        backgroundColor: "var(--c-bg-surface)",
        borderRadius: "16px",
        padding: "16px",
        width: "280px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        border: "1px solid var(--c-border)",
        boxShadow: "var(--shadow-sm)",
        color: "var(--c-text-primary)",
      }}
    >
      <h3
        style={{
          fontSize: "18px",
          fontWeight: "700",
          margin: 0,
        }}
      >
        {artwork.name}
      </h3>

      <img
        src={artwork.image}
        alt={artwork.name}
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
          borderRadius: "12px",
        }}
      />

      <p
        style={{
          fontSize: "13px",
          color: "var(--c-text-secondary)",
          margin: 0,
        }}
      >
        {artwork.category}
      </p>

      <button
        onClick={onBook}
        style={{
          marginTop: "6px",
          padding: "8px 18px",
          borderRadius: "999px",
          border: "none",
          background: "linear-gradient(135deg, var(--c-brand-primary), var(--c-brand-primary-hover))",
          color: "white",
          fontSize: "14px",
          cursor: "pointer",
          alignSelf: "flex-start",
          boxShadow: "0 10px 20px rgba(99,102,241,0.2)",
        }}
      >
        Book now
      </button>
    </div>
  );
}
