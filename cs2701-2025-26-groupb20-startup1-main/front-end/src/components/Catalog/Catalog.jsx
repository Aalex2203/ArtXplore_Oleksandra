import React, { useState } from "react";
import ArtworkCard from "@/components/Catalog/ArtworkCard.jsx";
import CatalogFilterBar from "@/components/Catalog/CatalogFilterBar.jsx";
import CatalogSearchBar from "@/components/Catalog/CatalogSearchBar.jsx";

import bobImg from "@/assets/Bob Mazzer.png";
import pabloImg from "@/assets/Pablo Delgado.png";
import runImg from "@/assets/RUN.png";
import sickboyImg from "@/assets/SickBoy.png";
import stikImg from "@/assets/Stik.png";
import dfaceImg from "@/assets/Dface.png";

export default function Catalog() {
  const [selectedFilter, setSelectedFilter] = useState("All artworks");
  const [searchQuery, setSearchQuery] = useState("");

  // booking popup state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingArtist, setBookingArtist] = useState("");
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    date: "",
    message: "",
  });
  const [bookingErrors, setBookingErrors] = useState({});
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  // artwork data
  const artworks = [
    {
      id: 1,
      name: "Pablo Delgado",
      category: "Street Art",
      image: pabloImg,
    },
    {
      id: 2,
      name: "RUN",
      category: "Street Art",
      image: runImg,
    },
    {
      id: 3,
      name: "Sickboy",
      category: "Graffiti",
      image: sickboyImg,
    },
    {
      id: 4,
      name: "Bob Mazzer",
      category: "Photography",
      image: bobImg,
    },
    {
      id: 5,
      name: "Stik",
      category: "Street Art",
      image: stikImg,
    },
    {
      id: 6,
      name: "D*face",
      category: "Street Art",
      image: dfaceImg,
    },
  ];

  // filter + search
  const filteredArtworks = artworks.filter((art) => {
    const matchesFilter =
      selectedFilter === "All artworks" || art.category === selectedFilter;

    const matchesSearch =
      searchQuery.trim() === "" ||
      art.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // open popup with selected artist
  function openBooking(artistName) {
    setBookingArtist(artistName);
    setIsBookingOpen(true);
    setBookingSubmitted(false);
    setBookingErrors({});
  }

  // booking form handlers
  function handleBookingChange(event) {
    const { name, value } = event.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setBookingSubmitted(false);
  }

  function validateBooking() {
    const errors = {};

    if (!bookingData.name.trim()) {
      errors.name = "Please enter your name.";
    }
    if (!bookingData.email.trim()) {
      errors.email = "Please enter your email.";
    } else if (!bookingData.email.includes("@")) {
      errors.email = "Please enter a valid email address.";
    }
    if (!bookingData.date.trim()) {
      errors.date = "Please choose a date.";
    }
    if (!bookingData.message.trim()) {
      errors.message = "Please add a short message.";
    }

    return errors;
  }

  function handleBookingSubmit(event) {
    event.preventDefault();
    const errors = validateBooking();
    setBookingErrors(errors);

    if (Object.keys(errors).length === 0) {
      console.log("Booking request:", {
        artist: bookingArtist,
        ...bookingData,
      });
      setBookingSubmitted(true);
      // optional: clear form
      // setBookingData({ name: "", email: "", date: "", message: "" });
    }
  }

  function closeBooking() {
    setIsBookingOpen(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--c-bg-app)",
        color: "var(--c-text-primary)",
        padding: "40px 24px 80px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            marginBottom: "8px",
            color: "var(--c-brand-primary)",
            letterSpacing: "-0.02em",
          }}
        >
          Browse Catalog
        </h1>
        <p style={{ color: "var(--c-text-secondary)", margin: 0 }}>
          Explore featured artists and book time directly.
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <CatalogSearchBar value={searchQuery} onChange={setSearchQuery} />

          <CatalogFilterBar
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
          }}
        >
          {filteredArtworks.map((art) => (
            <ArtworkCard
              key={art.id}
              artwork={art}
              onBook={() => openBooking(art.name)}
            />
          ))}
        </div>
      </div>

      {isBookingOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "var(--c-bg-surface)",
              padding: "24px 28px",
              borderRadius: "18px",
              maxWidth: "500px",
              width: "90%",
              color: "var(--c-text-primary)",
              boxShadow: "var(--shadow-xl)",
              border: "1px solid var(--c-border)",
            }}
          >
            <button
              onClick={closeBooking}
              style={{
                border: "none",
                background: "none",
                color: "var(--c-text-secondary)",
                fontSize: "18px",
                float: "right",
                cursor: "pointer",
              }}
              aria-label="Close booking dialog"
            >
              ✕
            </button>

            <h2
              style={{
                marginTop: "0",
                marginBottom: "4px",
                fontSize: "24px",
              }}
            >
              Book {bookingArtist}
            </h2>

            <p
              style={{
                marginBottom: "18px",
                fontSize: "14px",
                color: "var(--c-text-secondary)",
              }}
            >
              Send a booking request for this artist. We&apos;ll review your details
              and respond by email.
            </p>

            <form
              onSubmit={handleBookingSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <BookingField
                label="Your name"
                name="name"
                value={bookingData.name}
                onChange={handleBookingChange}
                error={bookingErrors.name}
                placeholder="Enter your full name"
              />

              <BookingField
                label="Email address"
                name="email"
                type="email"
                value={bookingData.email}
                onChange={handleBookingChange}
                error={bookingErrors.email}
                placeholder="name@example.com"
              />

              <BookingField
                label="Preferred date"
                name="date"
                type="date"
                value={bookingData.date}
                onChange={handleBookingChange}
                error={bookingErrors.date}
              />

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label htmlFor="booking-message">Message / requirements</label>
                <textarea
                  id="booking-message"
                  name="message"
                  rows="4"
                  value={bookingData.message}
                  onChange={handleBookingChange}
                  style={{
                    ...bookingInputStyle,
                    resize: "vertical",
                  }}
                  placeholder="Tell us about your event or request..."
                />
                {bookingErrors.message && (
                  <span style={bookingErrorStyle}>{bookingErrors.message}</span>
                )}
              </div>

              <button
                type="submit"
                style={{
                  marginTop: "6px",
                  alignSelf: "flex-start",
                  padding: "10px 26px",
                  borderRadius: "999px",
                  border: "none",
                  fontSize: "15px",
                  cursor: "pointer",
                  background: "linear-gradient(135deg, var(--c-brand-primary), var(--c-brand-primary-hover))",
                  color: "white",
                  fontWeight: "600",
                  boxShadow: "0 10px 24px rgba(99,102,241,0.2)",
                }}
              >
                Send booking request
              </button>

              {bookingSubmitted && (
                <p
                  style={{
                    marginTop: "6px",
                    fontSize: "13px",
                    color: "var(--c-success)",
                  }}
                >
                  Thank you! Your booking request has been recorded.
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// small reusable field for the popup
function BookingField({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label htmlFor={`booking-${name}`}>{label}</label>
      <input
        id={`booking-${name}`}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        style={bookingInputStyle}
        placeholder={placeholder}
      />
      {error && <span style={bookingErrorStyle}>{error}</span>}
    </div>
  );
}

const bookingInputStyle = {
  padding: "8px 10px",
  borderRadius: "8px",
  border: "1px solid #404362",
  fontSize: "14px",
  outline: "none",
};

const bookingErrorStyle = {
  color: "#ff8080",
  fontSize: "12px",
};
