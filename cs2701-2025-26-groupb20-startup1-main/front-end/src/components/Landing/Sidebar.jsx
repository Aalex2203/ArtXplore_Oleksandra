import React from "react";
import { Link, useLocation } from "react-router-dom";

const links = [
  { label: "Home", path: "/", accent: true },
  { label: "Discover", path: "/discover" },
  { label: "Venues", path: "/map" },
  { label: "Profile", path: "/profile" },
  { label: "Catalog", path: "/catalog" },
];

export default function Sidebar() {
  const location = useLocation();

  const navButtonStyle = (active, accent) => ({
    padding: "8px 0",
    width: "100%",
    textAlign: "left",
    background: "none",
    border: "none",
    color: accent ? "#3fffff" : active ? "#ffffff" : "#bbbbc5",
    fontWeight: accent || active ? "700" : "400",
    fontSize: accent ? "16px" : "15px",
    cursor: "pointer",
  });

  return (
    <div
      style={{
        width: "180px",
        backgroundColor: "#050713",
        padding: "32px 16px 24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRight: "1px solid #ffffff33",
      }}
    >
      <div>
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {links.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link key={link.path} to={link.path} style={{ textDecoration: "none" }}>
                <button style={navButtonStyle(active, link.accent)}>{link.label}</button>
              </Link>
            );
          })}
        </nav>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <span style={{ color: "#6f6fff", fontSize: "14px" }}>ArtXplore</span>
      </div>
    </div>
  );
}
