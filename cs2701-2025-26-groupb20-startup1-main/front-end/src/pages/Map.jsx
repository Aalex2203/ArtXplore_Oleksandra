import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import {
    getVenues,
    getSavedVenues,
    getRecentlyViewed,
    searchVenuesByName,
    saveVenueForUser,
    removeSavedVenueForUser
} from '@/lib/api';
import 'leaflet/dist/leaflet.css';

const VENUE_TYPES = [
    { id: 'GALLERY', label: 'Art Galleries' },
    { id: 'MUSEUM', label: 'Museums' },
    { id: 'THEATRE', label: 'Theatres' },
    { id: 'MUSIC', label: 'Music Venues' },
    { id: 'CULTURAL', label: 'Cultural Centers' }
];

const VENUE_IMAGES = {
    'Tate Modern': '/venues/tatemodern.jpeg',
    'National Theatre': '/venues/nationaltheatre.jpeg',
    'British Museum': '/venues/britishmuseum.jpg',
    'Royal Albert Hall': '/venues/Royal_Albert_Hall.jpg',
    'Barbican Centre': '/venues/barbican.webp',
    'Village Underground': '/venues/villageUnder.webp',
    'Somerset House': '/venues/somerset.jpg',
    'Southbank Centre': '/venues/southbankcentre.jpg',
    'Design Museum': '/venues/the-design-museum.jpg',
    'Saatchi Gallery': '/venues/saatchi.jpeg',
    'Whitechapel Gallery': '/venues/whitechapel.jpeg',
    'Victoria and Albert Museum': '/venues/VAmuseum.jpg',
    'V&A Museum': '/venues/VAmuseum.jpg',
    'V&A': '/venues/VAmuseum.jpg',
    'Shakespeare’s Globe': '/venues/globe.avif',
    'O2 Arena': '/venues/o2.jpg',
    'The O2': '/venues/o2.jpg',
    'Roundhouse': '/venues/roundhouse.jpeg',
    'The Old Vic': '/venues/old_vic.jpg',
    'Camden Assembly': '/venues/camden.jpeg',
    'Serpentine Gallery': '/venues/Serpentine_Gallery.jpg',
    'Apollo Theatre': '/venues/apollo_theatre.jpg',
    'Science Museum': '/venues/science.avif'
};

const FALLBACK_IMAGE = '/venues/default.jpeg';

const normalizeVenueType = (type) => {
    if (!type) return '';

    const value = String(type).trim().toUpperCase();

    if (value === 'GALLERY' || value === 'GALLERIES') return 'GALLERY';
    if (value === 'MUSEUM' || value === 'MUSEUMS') return 'MUSEUM';
    if (value === 'THEATRE' || value === 'THEATRES' || value === 'THEATER' || value === 'THEATERS') return 'THEATRE';
    if (value === 'MUSIC' || value === 'MUSIC VENUE' || value === 'MUSIC VENUES') return 'MUSIC';
    if (value === 'CULTURAL' || value === 'CULTURAL CENTER' || value === 'CULTURAL CENTRE' || value === 'CULTURAL CENTERS' || value === 'CULTURAL CENTRES') return 'CULTURAL';

    return value;
};

const slugifyVenueName = (name) => {
    if (!name) return '';
    return String(name)
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/['".,]/g, '')
        .replace(/\s+/g, '')
        .replace(/-/g, '')
        .replace(/[^\w]/g, '');
};

const getVenueImage = (venue) => {
    if (!venue) return FALLBACK_IMAGE;

    if (VENUE_IMAGES[venue.name]) {
        return VENUE_IMAGES[venue.name];
    }

    const slug = slugifyVenueName(venue.name);
    if (slug) {
        return `/venues/${slug}.jpeg`;
    }

    return FALLBACK_IMAGE;
};

const normalizeVenue = (venue) => ({
    ...venue,
    type: normalizeVenueType(venue.type),
    latitude: venue.latitude ?? venue.lat ?? null,
    longitude: venue.longitude ?? venue.lng ?? null,
    image: getVenueImage(venue)
});

export default function Map() {
    const [filters, setFilters] = useState({
        GALLERY: false,
        MUSEUM: false,
        THEATRE: false,
        MUSIC: false,
        CULTURAL: false
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [savedVenues, setSavedVenues] = useState([]);
    const [recentVenues, setRecentVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [savedMarkers, setSavedMarkers] = useState([]);
    const [showSavedOnMap, setShowSavedOnMap] = useState(false);
    const [allVenues, setAllVenues] = useState([]);
    const [activeVenues, setActiveVenues] = useState([]);

    const toggleFilter = (id) => {
        setFilters((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const addToRecentlyViewed = (venue) => {
        setRecentVenues((prev) => {
            const withoutCurrent = prev.filter((v) => String(v.id) !== String(venue.id));

            return [
                {
                    ...venue,
                    image: getVenueImage(venue),
                    viewedDate: 'Recently'
                },
                ...withoutCurrent
            ].slice(0, 2);
        });
    };

    const handleAddToSaved = async (venue) => {
        const alreadySaved = savedVenues.some((v) => String(v.id) === String(venue.id));
        if (alreadySaved) return;

        setSavedVenues((prev) => [
            ...prev,
            {
                ...venue,
                image: getVenueImage(venue),
                savedDate: 'Just now'
            }
        ]);

        try {
            await saveVenueForUser(venue.id);
        } catch (error) {
            console.error('Failed to save venue in backend:', error);
        }
    };

    const handleRemoveFromSaved = async (venueId) => {
        const venue = savedVenues.find((v) => String(v.id) === String(venueId));

        setSavedVenues((prev) =>
            prev.filter((savedVenue) => String(savedVenue.id) !== String(venueId))
        );

        if (showSavedOnMap) {
            savedMarkers.forEach((marker) => {
                if (marker && map) {
                    map.removeLayer(marker);
                }
            });
            setSavedMarkers([]);
            setShowSavedOnMap(false);
        }

        try {
            await removeSavedVenueForUser(venueId);
        } catch (error) {
            console.error('Failed to remove venue from backend:', error);
        }
    };

    useEffect(() => {
        document.title = 'Venue Map · ArtXPlore';

        const fetchData = async () => {
            try {
                const [venuesResponse, savedResponse, recentResponse] = await Promise.all([
                    getVenues(),
                    getSavedVenues(),
                    getRecentlyViewed()
                ]);

                if (venuesResponse.success) {
                    const normalizedVenues = (venuesResponse.venues || []).map(normalizeVenue);
                    setAllVenues(normalizedVenues);
                } else {
                    setAllVenues([]);
                }

                if (savedResponse.success) {
                    const normalizedSavedVenues = (savedResponse.venues || []).map(normalizeVenue);
                    setSavedVenues(normalizedSavedVenues);
                } else {
                    setSavedVenues([]);
                }

                if (recentResponse.success) {
                    const normalizedRecentVenues = (recentResponse.venues || [])
                        .map(normalizeVenue)
                        .slice(0, 2);

                    setRecentVenues(normalizedRecentVenues);
                } else {
                    setRecentVenues([]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setAllVenues([]);
                setSavedVenues([]);
                setRecentVenues([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const selectedTypes = Object.keys(filters).filter((type) => filters[type]);

        if (selectedTypes.length === 0) {
            setActiveVenues([]);
            return;
        }

        const filteredVenues = allVenues.filter((venue) => {
            const normalizedType = normalizeVenueType(venue.type);
            return selectedTypes.includes(normalizedType);
        });

        setActiveVenues(filteredVenues);

        if (map && filteredVenues.length > 0) {
            const firstVenueWithCoordinates = filteredVenues.find(
                (venue) => venue.latitude != null && venue.longitude != null
            );

            if (firstVenueWithCoordinates) {
                map.setView(
                    [
                        Number(firstVenueWithCoordinates.latitude),
                        Number(firstVenueWithCoordinates.longitude)
                    ],
                    13
                );
            }
        }
    }, [filters, allVenues, map]);

    useEffect(() => {
        if (map) {
            updateMapMarkers();
        }
    }, [activeVenues, savedVenues, map]);

    const handleSearch = async () => {
        try {
            if (!searchQuery.trim()) {
                setErrorMessage('Please enter a venue name');
                setActiveVenues([]);
                return;
            }

            const response = await searchVenuesByName(searchQuery);

            if (response.success && response.venues.length > 0) {
                setErrorMessage('');
                const normalizedVenues = (response.venues || []).map(normalizeVenue);

                setActiveVenues(normalizedVenues);

                const firstVenueWithCoordinates = normalizedVenues.find(
                    (venue) => venue.latitude != null && venue.longitude != null
                );

                if (firstVenueWithCoordinates && map) {
                    map.setView(
                        [
                            Number(firstVenueWithCoordinates.latitude),
                            Number(firstVenueWithCoordinates.longitude)
                        ],
                        15
                    );
                }
            } else {
                setActiveVenues([]);
                setErrorMessage('No venues found');
            }
        } catch (error) {
            console.error('Search failed:', error);
            setErrorMessage('Something went wrong. Please try again.');
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const initMap = async () => {
                const L = await import('leaflet');

                delete L.Icon.Default.prototype._getIconUrl;
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                });

                window.L = L;

                const mapInstance = L.map('map-container').setView([51.505, -0.09], 13);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    maxZoom: 18,
                }).addTo(mapInstance);

                setMap(mapInstance);
            };

            initMap();
        }

        return () => {
            if (map) {
                map.remove();
            }
        };
    }, []);

    const buildPopupHtml = (venue, isSaved) => `
        <div style="min-width: 220px">
            <img
                src="${getVenueImage(venue)}"
                alt="${venue.name}"
                style="
                    width: 100%;
                    height: 120px;
                    object-fit: cover;
                    border-radius: 8px;
                    margin-bottom: 8px;
                    display: block;
                "
                onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'"
            />
            <b>${venue.name}</b><br>
            ${venue.address || 'No address available'}<br>
            <em>${VENUE_TYPES.find((type) => type.id === normalizeVenueType(venue.type))?.label || venue.type || 'Venue'}</em>
            <br><br>
            <button
                onclick="window.toggleSaveVenue('${venue.id}')"
                style="
                    background: ${isSaved ? '#ef4444' : '#3b82f6'};
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    width: 100%;
                "
            >
                ${isSaved ? 'Remove Venue' : 'Save Venue'}
            </button>
        </div>
    `;

    const updateMapMarkers = () => {
        if (!map || typeof window === 'undefined' || !window.L) return;

        const L = window.L;

        markers.forEach((marker) => {
            map.removeLayer(marker);
        });

        const newMarkers = activeVenues
            .filter((venue) => venue.latitude != null && venue.longitude != null)
            .map((venue) => {
                const isSaved = savedVenues.some((v) => String(v.id) === String(venue.id));

                const marker = L.marker([Number(venue.latitude), Number(venue.longitude)])
                    .addTo(map)
                    .bindPopup(buildPopupHtml(venue, isSaved));

                marker.on('click', () => {
                    addToRecentlyViewed(venue);
                });

                return marker;
            });

        setMarkers(newMarkers);

        window.toggleSaveVenue = (id) => {
            const venue = activeVenues.find((v) => String(v.id) === String(id));
            if (!venue) return;

            const isSaved = savedVenues.some((v) => String(v.id) === String(id));

            if (isSaved) {
                handleRemoveFromSaved(id);
            } else {
                handleAddToSaved(venue);
            }

            newMarkers.forEach((marker) => {
                if (marker.getPopup().isOpen()) {
                    marker.closePopup();
                }
            });
        };
    };

    const toggleSavedOnMap = () => {
        if (typeof window === 'undefined' || !map || !window.L) return;

        const L = window.L;

        if (!showSavedOnMap) {
            const newSavedMarkers = [];

            savedVenues.forEach((venue) => {
                if (venue.latitude == null || venue.longitude == null) return;

                const marker = L.marker([Number(venue.latitude), Number(venue.longitude)])
                    .addTo(map)
                    .bindPopup(`
                        <div style="min-width: 220px">
                            <img
                                src="${getVenueImage(venue)}"
                                alt="${venue.name}"
                                style="
                                    width: 100%;
                                    height: 120px;
                                    object-fit: cover;
                                    border-radius: 8px;
                                    margin-bottom: 8px;
                                    display: block;
                                "
                                onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'"
                            />
                            <b>${venue.name}</b><br>
                            ${venue.address || 'No address available'}<br>
                            <small>Saved venue</small>
                        </div>
                    `);

                marker.getElement()?.classList.add('saved-venue-marker');
                newSavedMarkers.push(marker);
            });

            setSavedMarkers(newSavedMarkers);
            setShowSavedOnMap(true);
        } else {
            savedMarkers.forEach((marker) => {
                if (marker && map) {
                    map.removeLayer(marker);
                }
            });

            setSavedMarkers([]);
            setShowSavedOnMap(false);
        }
    };

    const resetFilters = () => {
        setFilters({
            GALLERY: false,
            MUSEUM: false,
            THEATRE: false,
            MUSIC: false,
            CULTURAL: false
        });

        setActiveVenues([]);
        setSearchQuery('');
        setErrorMessage('');
        setShowSavedOnMap(false);

        savedMarkers.forEach((marker) => {
            if (marker && map) {
                map.removeLayer(marker);
            }
        });

        setSavedMarkers([]);

        if (map) {
            map.setView([51.505, -0.09], 13);
        }
    };

    return (
        <div className="page fade-in" style={{ height: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flex: 1, width: '100%', overflow: 'hidden', position: 'relative' }}>
                <aside style={{
                    width: '320px',
                    background: 'var(--c-bg-surface)',
                    borderRight: '1px solid var(--c-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 20,
                    boxShadow: 'var(--shadow-md)'
                }} className="sidebar-panel">
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--c-border)' }}>
                        <h1 style={{ fontSize: '1.25rem', margin: 0 }}>Explore Venues</h1>
                        <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                            Filter by type and manage your saved venues
                        </p>
                    </div>

                    <div style={{
                        padding: '1.5rem',
                        overflowY: 'auto',
                        flex: 1,
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }}>
                        <style>{`
                            .sidebar-panel div::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>

                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                marginBottom: '1rem',
                                color: 'var(--c-text-secondary)'
                            }}>
                                Venue Type
                            </h3>

                            <div className="flex flex-col gap-2">
                                {VENUE_TYPES.map((type) => (
                                    <label
                                        key={type.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            cursor: 'pointer',
                                            padding: '0.5rem',
                                            borderRadius: 'var(--radius-md)',
                                            transition: 'background 0.2s',
                                            background: filters[type.id] ? 'var(--c-bg-surface-hover)' : 'transparent'
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={filters[type.id]}
                                            onChange={() => toggleFilter(type.id)}
                                            style={{
                                                width: '16px',
                                                height: '16px',
                                                accentColor: 'var(--c-brand-primary)',
                                                cursor: 'pointer'
                                            }}
                                        />
                                        <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{type.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    color: 'var(--c-text-secondary)'
                                }}>
                                    Saved
                                </h3>

                                <Button
                                    size="sm"
                                    variant={showSavedOnMap ? 'primary' : 'secondary'}
                                    style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                                    onClick={toggleSavedOnMap}
                                >
                                    {showSavedOnMap ? 'Hide from map' : 'Show on map'}
                                </Button>
                            </div>

                            {loading ? (
                                <div style={{ padding: '1rem', background: 'var(--c-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                                    <p className="text-muted" style={{ fontSize: '0.875rem', textAlign: 'center', margin: 0 }}>
                                        Loading...
                                    </p>
                                </div>
                            ) : savedVenues.length === 0 ? (
                                <div style={{ padding: '1rem', background: 'var(--c-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                                    <p className="text-muted" style={{ fontSize: '0.875rem', textAlign: 'center', margin: 0 }}>
                                        No saved venues yet
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {savedVenues.map((venue) => (
                                        <div
                                            key={venue.id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                padding: '0.75rem',
                                                background: showSavedOnMap ? 'var(--c-bg-surface-hover)' : 'var(--c-bg-subtle)',
                                                borderRadius: 'var(--radius-md)',
                                                border: showSavedOnMap ? '1px solid var(--c-brand-primary)' : 'none',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <img
                                                src={getVenueImage(venue)}
                                                alt={venue.name}
                                                onError={(e) => {
                                                    e.currentTarget.src = FALLBACK_IMAGE;
                                                }}
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: 'var(--radius-sm)',
                                                    objectFit: 'cover'
                                                }}
                                            />

                                            <div style={{ flex: 1 }}>
                                                <p
                                                    style={{
                                                        fontSize: '0.875rem',
                                                        fontWeight: '500',
                                                        margin: 0,
                                                        color: showSavedOnMap ? 'var(--c-brand-primary)' : 'inherit'
                                                    }}
                                                >
                                                    {venue.name}
                                                </p>
                                                <p className="text-muted" style={{ fontSize: '0.75rem', margin: 0 }}>
                                                    {venue.savedDate || 'Recently'}
                                                </p>
                                            </div>

                                            {showSavedOnMap && (
                                                <div
                                                    style={{
                                                        width: '8px',
                                                        height: '8px',
                                                        borderRadius: '50%',
                                                        background: 'var(--c-brand-primary)',
                                                        animation: 'pulse 2s infinite'
                                                    }}
                                                />
                                            )}

                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => handleRemoveFromSaved(venue.id)}
                                                style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                marginBottom: '1rem',
                                color: 'var(--c-text-secondary)'
                            }}>
                                Recently Viewed
                            </h3>

                            {loading ? (
                                <div style={{ padding: '1rem', background: 'var(--c-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                                    <p className="text-muted" style={{ fontSize: '0.875rem', textAlign: 'center', margin: 0 }}>
                                        Loading...
                                    </p>
                                </div>
                            ) : recentVenues.length === 0 ? (
                                <div style={{ padding: '1rem', background: 'var(--c-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                                    <p className="text-muted" style={{ fontSize: '0.875rem', textAlign: 'center', margin: 0 }}>
                                        No recently viewed venues
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {recentVenues.map((venue) => (
                                        <div
                                            key={venue.id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                padding: '0.75rem',
                                                background: 'var(--c-bg-subtle)',
                                                borderRadius: 'var(--radius-md)'
                                            }}
                                        >
                                            <img
                                                src={getVenueImage(venue)}
                                                alt={venue.name}
                                                onError={(e) => {
                                                    e.currentTarget.src = FALLBACK_IMAGE;
                                                }}
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: 'var(--radius-sm)',
                                                    objectFit: 'cover'
                                                }}
                                            />

                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: '0.875rem', fontWeight: '500', margin: 0 }}>
                                                    {venue.name}
                                                </p>
                                                <p className="text-muted" style={{ fontSize: '0.75rem', margin: 0 }}>
                                                    {venue.viewedDate || 'Recently'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ padding: '1.5rem', borderTop: '1px solid var(--c-border)' }}>
                        <Button className="w-full" variant="secondary" onClick={resetFilters}>
                            Reset Filters
                        </Button>
                    </div>
                </aside>

                <div style={{ flex: 1, position: 'relative', background: '#e5e7eb' }}>
                    <div style={{
                        position: 'absolute',
                        top: '1.5rem',
                        left: '1.5rem',
                        zIndex: 1000,
                        width: 'min(500px, calc(100% - 3rem))',
                    }}>
                        <div style={{
                            display: 'flex',
                            gap: '0.5rem',
                            background: 'var(--c-bg-surface)',
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: 'var(--shadow-lg)',
                            border: errorMessage ? '1px solid #ef4444' : '1px solid var(--c-border)'
                        }}>
                            <input
                                type="text"
                                placeholder="Search by location or name..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setErrorMessage('');
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch();
                                    }
                                }}
                                style={{
                                    flex: 1,
                                    border: 'none',
                                    outline: 'none',
                                    padding: '0.5rem 0.75rem',
                                    background: 'transparent',
                                    fontSize: '0.95rem'
                                }}
                            />

                            <Button
                                size="sm"
                                style={{ padding: '0.5rem 1rem' }}
                                onClick={handleSearch}
                            >
                                Search
                            </Button>
                        </div>

                        {errorMessage && (
                            <div style={{
                                marginTop: '0.5rem',
                                color: '#ef4444',
                                fontSize: '0.85rem',
                                background: '#fee2e2',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '6px',
                                border: '1px solid #fecaca'
                            }}>
                                {errorMessage}
                            </div>
                        )}
                    </div>

                    <div
                        id="map-container"
                        style={{
                            width: '100%',
                            height: '100%',
                            zIndex: 1
                        }}
                    />
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .sidebar-panel {
                        display: none !important;
                    }
                }
                .leaflet-top, .leaflet-bottom {
                    z-index: 500;
                }
                .saved-venue-marker .leaflet-marker-icon {
                    filter: hue-rotate(120deg) saturate(2);
                }
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    );
}