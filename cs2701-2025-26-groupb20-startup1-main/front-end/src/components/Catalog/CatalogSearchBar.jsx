import React from "react";

export default function CatalogSearchBar({ value, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "var(--c-bg-surface)",
        borderRadius: "6px",
        padding: "0 12px",
        height: "50px",
        width: "100%",
        maxWidth: "420px",
        border: "1px solid var(--c-border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <span
        style={{
          fontSize: "20px",
          marginRight: "8px",
        }}
      >
        🔍
      </span>

      <input
        type="text"
        placeholder="Search catalog..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          fontSize: "16px",
          background: "transparent",
          color: "var(--c-text-primary)",
        }}
      />
    </div>
  );
}
