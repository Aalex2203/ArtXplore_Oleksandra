// React + UI imports
import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getDiscoverEvents } from '@/lib/api.js';

// Categories used for filtering and selecting
const EVENT_CATEGORIES = ['All', 'Exhibition', 'Music', 'Workshop', 'Tour', 'Theater'];

// LocalStorage key for demo-user created events
const STORAGE_KEY = 'artxplore_demo_events';

// Demo user email used to detect the demo account
const DEMO_EMAIL = 'alex@artxplore.com';

// Static fake profile shown in the modal
const DEMO_PROFILE = {
  fullName: 'Demo User Profile',
  role: 'Artist',
  location: 'London',
  bio: 'This is a demo artist profile used to preview how profiles could look in ArtXPlore.',
  website: 'https://example.com',
  email: 'demo@artxplore.test',
};

// Default state for creating a new event
const EMPTY_EVENT = {
  title: '',
  venue: '',
  date: '',
  time: '',
  price: 'Free',
  description: '',
  image: '',
  category: 'Exhibition',
};

// Reusable style for inputs
const inputStyle = {
  width: '100%',
  padding: '0.6rem 0.8rem',
  borderRadius: '0.5rem',
  border: '1px solid var(--c-border)',
  background: 'var(--c-bg-surface)',
  color: 'var(--c-text-primary)',
};

// Helper to detect if the event was created by the current logged-in user
const isOwnEvent = (event, currentUser) => {
  if (!currentUser) return false;

  if (event.createdByEmail && event.createdByEmail === currentUser.email) return true;
  if (event.createdByName && event.createdByName === currentUser.fullName) return true;

  // Local events have "local-" prefix → assume it's the user's
  if (!event.createdByEmail && !event.createdByName && String(event.id).startsWith('local-')) {
    return true;
  }

  return false;
};

export default function Discover({ currentUser }) {
  // Stores main event list
  const [events, setEvents] = useState([]);

  // Loading state for initial fetch
  const [loading, setLoading] = useState(true);

  // Filter states
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [freeOnly, setFreeOnly] = useState(false);

  // UI toggles
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // State for the event creation form
  const [newEvent, setNewEvent] = useState(EMPTY_EVENT);

  // Only allow "Post event" to artists
  const isArtist =
    currentUser &&
    typeof currentUser.role === 'string' &&
    currentUser.role.toLowerCase().includes('artist');

  // Detect if current user is the demo account
  const isDemoUser = currentUser && currentUser.email === DEMO_EMAIL;

  // Set browser tab title
  useEffect(() => {
    document.title = 'Discover · ArtXPlore';
  }, []);

  // Load events from the API + any saved local demo events
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getDiscoverEvents();
        const baseEvents = Array.isArray(res?.events) ? res.events : [];

        // If demo user is logged in, load their locally saved events
        let saved = [];
        if (isDemoUser) {
          try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) saved = JSON.parse(raw);
          } catch {
            saved = [];
          }
        }

        // Merge demo events above API events
        setEvents([...saved, ...baseEvents]);
      } catch (err) {
        console.error('Failed to fetch events', err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isDemoUser]);

  // Save demo-created events to LocalStorage
  const persistDemoEvents = (allEvents) => {
    if (!isDemoUser) return;
    const demoEvents = allEvents.filter((ev) => ev.createdByEmail === DEMO_EMAIL);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoEvents));
  };

  // Wrapper around setEvents that also syncs LocalStorage (demo only)
  const updateEvents = (updater) => {
    setEvents((prev) => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      persistDemoEvents(updated);
      return updated;
    });
  };

  // Controlled form input handler
  const handleCreateChange = (field) => (e) =>
    setNewEvent((prev) => ({ ...prev, [field]: e.target.value }));

  const resetNewEvent = () => setNewEvent(EMPTY_EVENT);

  // Create event form submit handler
  const handleCreateEventSubmit = (e) => {
    e.preventDefault();
    if (!isArtist || !currentUser) return;
    if (!newEvent.title.trim() || !newEvent.venue.trim()) return;

    setCreating(true);

    const created = {
      id: `local-${Date.now()}`, // unique id for local events
      ...newEvent,
      price: newEvent.price || 'Free',
      image: newEvent.image || 'https://placehold.co/800x600?text=Event+Image',
      createdByName: currentUser.fullName || 'You',
      createdByEmail: currentUser.email || '',
    };

    // Add new event at the top
    updateEvents((prev) => [created, ...prev]);

    resetNewEvent();
    setShowCreateForm(false);
    setCreating(false);
  };

  // Delete event by id
  const handleDeleteEvent = (id) => {
    updateEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  // Reset filters
  const handleClearFilters = () => {
    setCategory('All');
    setQuery('');
    setFreeOnly(false);
  };

  // Prepare search text
  const search = query.trim().toLowerCase();

  // Main filtered event list
  const filteredEvents = events.filter((event) => {
    const inCategory = category === 'All' || event.category === category;
    if (!inCategory) return false;

    const title = (event.title || '').toLowerCase();
    const venue = (event.venue || '').toLowerCase();
    const price = (event.price || '').toString().toLowerCase();

    const matchesSearch = !search || title.includes(search) || venue.includes(search);
    const matchesFree = !freeOnly || price.includes('free');

    return matchesSearch && matchesFree;
  });

  return (
    <div className="page fade-in">

      {/* ---------------------------------------------------
           HERO SECTION + CREATE FORM + FILTERS
         --------------------------------------------------- */}
      <section
        style={{
          padding: '6rem 0 3rem',
          textAlign: 'center',
          background: 'linear-gradient(180deg, var(--c-bg-surface-glass) 0%, transparent 100%)',
        }}
      >
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Discover Events</h1>
          <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
            Find and post creative events happening across London.
          </p>

          {/* Show "Post event" button only to artists */}
          {isArtist && (
            <div style={{ marginBottom: '1.5rem' }}>
              <Button
                type="button"
                onClick={() => setShowCreateForm((open) => !open)}
                style={{ borderRadius: '999px', padding: '0.6rem 1.4rem' }}
              >
                {showCreateForm ? 'Cancel event' : 'Post an upcoming event'}
              </Button>
            </div>
          )}

          {/* Create Event Form */}
          {showCreateForm && isArtist && (
            <form
              onSubmit={handleCreateEventSubmit}
              style={{
                maxWidth: '700px',
                margin: '0 auto 2rem',
                textAlign: 'left',
                padding: '1.5rem',
                borderRadius: '1rem',
                border: '1px solid var(--c-border)',
                background: 'var(--c-bg-surface)',
              }}
            >
              {/* Form Inputs */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1rem',
                }}
              >
                {/* Title */}
                <div>
                  <label style={{ fontSize: '0.85rem' }}>Title</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={handleCreateChange('title')}
                    required
                    style={inputStyle}
                  />
                </div>

                {/* Venue */}
                <div>
                  <label style={{ fontSize: '0.85rem' }}>Venue</label>
                  <input
                    type="text"
                    value={newEvent.venue}
                    onChange={handleCreateChange('venue')}
                    required
                    style={inputStyle}
                  />
                </div>

                {/* Date */}
                <div>
                  <label style={{ fontSize: '0.85rem' }}>Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={handleCreateChange('date')}
                    style={inputStyle}
                  />
                </div>

                {/* Time */}
                <div>
                  <label style={{ fontSize: '0.85rem' }}>Time</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={handleCreateChange('time')}
                    style={inputStyle}
                  />
                </div>

                {/* Category */}
                <div>
                  <label style={{ fontSize: '0.85rem' }}>Category</label>
                  <select
                    value={newEvent.category}
                    onChange={handleCreateChange('category')}
                    style={inputStyle}
                  >
                    {EVENT_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label style={{ fontSize: '0.85rem' }}>Price</label>
                  <input
                    type="text"
                    value={newEvent.price}
                    onChange={handleCreateChange('price')}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Optional Image URL */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem' }}>Image URL (optional)</label>
                <input
                  type="url"
                  value={newEvent.image}
                  onChange={handleCreateChange('image')}
                  placeholder="https://..."
                  style={inputStyle}
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem' }}>Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={handleCreateChange('description')}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    resetNewEvent();
                    setShowCreateForm(false);
                  }}
                  disabled={creating}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={creating} isLoading={creating}>
                  Post event
                </Button>
              </div>
            </form>
          )}

          {/* Non-artist message */}
          {!isArtist && (
            <p
              className="text-muted"
              style={{ fontSize: '0.9rem', marginBottom: '1.5rem', opacity: 0.75 }}
            >
              Sign up as an artist to post upcoming events.
            </p>
          )}

          {/* SEARCH + FILTERS */}
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            {/* Search Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--c-bg-surface)',
                borderRadius: '999px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                padding: '0.5rem',
                border: '1px solid var(--c-border)',
              }}
            >
              <input
                type="text"
                placeholder="Search events or venues..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: '1rem',
                  flex: 1,
                  fontSize: '1.05rem',
                  outline: 'none',
                  color: 'var(--c-text-primary)',
                }}
              />
              <Button
                type="button"
                style={{ borderRadius: '999px', padding: '0.75rem 1.5rem', marginRight: '0.25rem' }}
              >
                Search
              </Button>
            </div>

            {/* Free filter + event count */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                marginTop: '0.75rem',
                fontSize: '0.9rem',
                color: 'var(--c-text-secondary)',
                flexWrap: 'wrap',
              }}
            >
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={freeOnly}
                  onChange={(e) => setFreeOnly(e.target.checked)}
                />
                <span>Show free events only</span>
              </label>
              <span>
                {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
              </span>
            </div>

            {/* Category buttons */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.75rem',
                flexWrap: 'wrap',
                marginTop: '1.5rem',
              }}
            >
              {EVENT_CATEGORIES.map((cat) => {
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    style={{
                      padding: '0.6rem 1.5rem',
                      borderRadius: '999px',
                      border: '1px solid',
                      borderColor: active ? 'var(--c-brand-primary)' : 'var(--c-border)',
                      background: active ? 'var(--c-brand-primary)' : 'var(--c-bg-surface)',
                      color: active ? '#fff' : 'var(--c-text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------
           EVENTS GRID SECTION
         --------------------------------------------------- */}
      <section style={{ paddingBottom: '6rem' }}>
        <div className="container">
          {/* Loading state */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
              <span style={{ color: 'var(--c-text-secondary)' }}>Loading events...</span>
            </div>
          ) : filteredEvents.length === 0 ? (
            // Empty state
            <div className="text-center" style={{ padding: '4rem 0', color: 'var(--c-text-secondary)' }}>
              <p style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>
                No events found matching &quot;{query}&quot;
              </p>
              <Button variant="ghost" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            // Events grid
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '2rem',
              }}
            >
              {filteredEvents.map((event) => {
                const own = isOwnEvent(event, currentUser);

                return (
                  <Card
                    key={event.id}
                    style={{
                      padding: 0,
                      overflow: 'hidden',
                      border: own ? '2px solid var(--c-brand-primary)' : '1px solid var(--c-border)',
                    }}
                  >
                    {/* Image */}
                    {event.image && (
                      <div style={{ height: '200px', background: '#e5e7eb', overflow: 'hidden' }}>
                        <img
                          src={event.image}
                          alt={event.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Main content */}
                    <div style={{ padding: '1.5rem' }}>

                      {/* Title + category */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '0.5rem',
                          gap: '0.75rem',
                        }}
                      >
                        <div>
                          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{event.title}</h3>
                          <p
                            style={{
                              color: 'var(--c-brand-primary)',
                              fontSize: '0.95rem',
                              fontWeight: 600,
                            }}
                          >
                            {event.venue}
                          </p>
                        </div>

                        <span
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '999px',
                            border: '1px solid var(--c-border)',
                            alignSelf: 'flex-start',
                          }}
                        >
                          {event.category}
                        </span>
                      </div>

                      {/* Event ownership + buttons */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.75rem',
                          fontSize: '0.9rem',
                          color: 'var(--c-text-secondary)',
                          gap: '0.5rem',
                        }}
                      >
                        <span>{own ? 'Your event' : 'Community event'}</span>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {/* Delete only if it's your event */}
                          {own && (
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => handleDeleteEvent(event.id)}
                              style={{
                                borderRadius: '999px',
                                fontSize: '0.75rem',
                                padding: '0.25rem 0.7rem',
                              }}
                            >
                              Delete
                            </Button>
                          )}

                          {/* Always show "View profile" (modal) */}
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setShowProfile(true)}
                            style={{
                              borderRadius: '999px',
                              fontSize: '0.8rem',
                              padding: '0.35rem 0.9rem',
                            }}
                          >
                            View profile
                          </Button>
                        </div>
                      </div>

                      {/* Date + time */}
                      <div
                        style={{
                          display: 'flex',
                          gap: '1rem',
                          marginBottom: '1rem',
                          fontSize: '0.9rem',
                          color: 'var(--c-text-secondary)',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span>{event.date}</span>
                        <span>{event.time}</span>
                      </div>

                      {/* Description */}
                      <p
                        className="text-muted"
                        style={{ fontSize: '0.95rem', marginBottom: '1.25rem', lineHeight: '1.5' }}
                      >
                        {event.description}
                      </p>

                      {/* Price + CTA */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingTop: '1rem',
                          borderTop: '1px solid var(--c-border)',
                        }}
                      >
                        <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{event.price}</span>
                        <Button variant="secondary" type="button" style={{ borderRadius: '999px' }}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ---------------------------------------------------
           DEMO PROFILE OVERLAY (Modal)
         --------------------------------------------------- */}
      {showProfile && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
          onClick={() => setShowProfile(false)} // clicking background closes modal
        >
          <div
            onClick={(e) => e.stopPropagation()} // prevents closing when clicking modal
            style={{
              maxWidth: '500px',
              width: '100%',
              background: 'var(--c-bg-surface)',
              borderRadius: '1.5rem',
              padding: '2rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem' }}>{DEMO_PROFILE.fullName}</h2>
              <Button variant="ghost" type="button" onClick={() => setShowProfile(false)}>
                Close
              </Button>
            </div>

            <p style={{ marginBottom: '0.25rem', color: 'var(--c-text-secondary)' }}>
              {DEMO_PROFILE.role} • {DEMO_PROFILE.location}
            </p>

            <p style={{ margin: '1rem 0', lineHeight: '1.5' }}>{DEMO_PROFILE.bio}</p>

            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              <strong>Website:</strong>{' '}
              <a href={DEMO_PROFILE.website} target="_blank" rel="noreferrer">
                {DEMO_PROFILE.website}
              </a>
            </p>

            <p style={{ fontSize: '0.9rem' }}>
              <strong>Contact:</strong> {DEMO_PROFILE.email}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}