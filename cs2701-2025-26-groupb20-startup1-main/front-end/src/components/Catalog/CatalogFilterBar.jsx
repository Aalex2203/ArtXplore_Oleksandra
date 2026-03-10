import React, { useState } from "react";

export default function CatalogFilterBar({ selectedFilter, onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const filterOptions = [
    "All artworks",
    "Graffiti",
    "Photography",
    "Digital Art",
    "Street Art",
  ];

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          background: "var(--c-bg-surface)",
          border: "1px solid var(--c-border)",
          borderRadius: "6px",
          color: "var(--c-text-primary)",
          padding: "8px 12px",
          cursor: "pointer",
        }}
      >
        {selectedFilter} ▼
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            marginTop: "6px",
            backgroundColor: "var(--c-bg-surface)",
            borderRadius: "8px",
            padding: "8px 0",
            minWidth: "180px",
            border: "1px solid var(--c-border)",
            boxShadow: "var(--shadow-md)",
            zIndex: 10,
          }}
        >
          {filterOptions.map((option) => (
            <button
              key={option}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                color: "var(--c-text-primary)",
                padding: "8px 16px",
                fontSize: "14px",
                cursor: "pointer",
              }}
              onClick={() => {
                onFilterChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
