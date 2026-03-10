import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { getSavedVenues, getRecentlyViewed } from '@/lib/api';
import 'leaflet/dist/leaflet.css';

const VENUE_TYPES = [
    { id: 'GALLERY', label: 'Art Galleries' },
    { id: 'MUSEUM', label: 'Museums' },
    { id: 'THEATER', label: 'Theaters' },
    { id: 'MUSIC', label: 'Music Venues' },
    { id: 'CULTURAL', label: 'Cultural Centers' }
];

// Mock coordinates for venues
const VENUE_COORDINATES = {
    'Tate Modern': { lat: 51.5076, lng: -0.0994 },
    'Royal Opera House': { lat: 51.5131, lng: -0.1223 },
    'Southbank Centre': { lat: 51.5055, lng: -0.1165 },
    'Apollo Theatre': { lat: 51.5115, lng: -0.1332 },
    'O2 Arena': { lat: 51.5030, lng: 0.0032 },
};

export default function Map() {
    const [filters, setFilters] = useState({
        galleries: false,
        museums: false,
        theaters: false,
        music: false,
        cultural: false
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [savedVenues, setSavedVenues] = useState([]);
    const [recentVenues, setRecentVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [savedMarkers, setSavedMarkers] = useState([]);
    const [showSavedOnMap, setShowSavedOnMap] = useState(false);
    const [allVenues, setAllVenues] = useState([]);
    const [activeVenues, setActiveVenues] = useState([]);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState(null);

 
    const toggleFilter = (id) => {
        console.log('Toggling filter:', id, 'current value:', filters[id]);
        setFilters(prev => ({ ...prev, [id]: !prev[id] }));
    };
    
    const handleAddToSaved = async (venue) => {
    const isAlreadySaved = savedVenues.some(v => v.id === venue.id);
    if (isAlreadySaved) {
        console.log('Venue already saved');
        return;
    }
    setSavedVenues(prev => [...prev, { ...venue, savedDate: 'Just now' }]);
    console.log('Added to saved:', venue.name);
};

const handleRemoveFromSaved = async (venueId) => {
    setSavedVenues(prev => prev.filter(venue => venue.id !== venueId));
    console.log('Removed from saved:', venueId);
};

    useEffect(() => {
        document.title = 'Venue Map · ArtXPlore';
        
        const fetchData = async () => {
            try {
                const [savedResponse, recentResponse] = await Promise.all([
                    getSavedVenues(),
                    getRecentlyViewed()
                ]);
                
                console.log('Saved venues:', savedResponse.venues);
                console.log('Recent venues:', recentResponse.venues);
                
                if (savedResponse.success) setSavedVenues(savedResponse.venues);
                if (recentResponse.success) setRecentVenues(recentResponse.venues);
                
                
                const combinedVenues = [
                    ...(savedResponse.success ? savedResponse.venues : []),
                    ...(recentResponse.success ? recentResponse.venues : [])
                ];
                
                console.log('All combined venues:', combinedVenues);
                
                
                const uniqueVenues = combinedVenues.filter((venue, index, self) =>
                    index === self.findIndex(v => v.name === venue.name)
                );
                
                console.log('Unique venues:', uniqueVenues);
                setAllVenues(uniqueVenues);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);


    useEffect(() => {
        console.log('Filters changed:', filters);
        const filteredVenues = allVenues.filter(venue => {
            const shouldShow = filters[venue.type];
            console.log(`Venue: ${venue.name}, Type: ${venue.type}, Show: ${shouldShow}`);
            return shouldShow;
        });
        console.log('Active venues after filtering:', filteredVenues.map(v => v.name));
        setActiveVenues(filteredVenues);
    }, [filters, allVenues]);

    
    useEffect(() => {
        if (map && activeVenues.length >= 0) {
            updateMapMarkers();
        }
    }, [activeVenues, map]);

    //Leaflet map
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const initMap = async () => {
                const L = await import('leaflet');
                
                // markers in Leaflet 
                delete L.Icon.Default.prototype._getIconUrl;
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                });

                const mapInstance = L.map('map-container').setView([51.505, -0.09], 13);

               
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    maxZoom: 18,
                }).addTo(mapInstance);

                setMap(mapInstance);
            };

            initMap();

            return () => {
                if (map) {
                    map.remove();
                }
            };
        }
    }, []);


    const updateMapMarkers = () => {
        if (!map || typeof window === 'undefined') return;
        const L = window.L;
        markers.forEach(marker => {
            map.removeLayer(marker);
        });

        const newMarkers = activeVenues.map(venue => {
            const coordinates = VENUE_COORDINATES[venue.name] || VENUE_COORDINATES.default;

            const isSaved = savedVenues.some(v => v.id === venue.id);
            
            return L.marker([coordinates.lat, coordinates.lng])
                .addTo(map)
                .bindPopup(`
                    <div style="min-width: 200px">
                        <b>${venue.name}</b><br>
                        ${venue.address}<br>
                        <em>${VENUE_TYPES.find(type => type.id === venue.type)?.label}</em>
                        <br><br>
                        <button 
                            onclick="window.saveVenue('${venue.id}', '${venue.name.replace(/'/g, "\\'")}', '${venue.type}', '${venue.address.replace(/'/g, "\\'")}', '${venue.image}')"
                            style="
                                background: ${isSaved ? '#10b981' : '#3b82f6'};
                                color: white;
                                border: none;
                                padding: 8px 12px;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 14px;
                                width: 100%;
                            "
                        >
                            ${isSaved ? '✓ Saved' : 'Save Venue'}
                        </button>
                    </div>
                `);
        });

        setMarkers(newMarkers);


        window.saveVenue = (id, name, type, address, image) => {
            handleAddToSaved({
                id,
                name,
                type,
                address,
                image
            });
            
 
            newMarkers.forEach(marker => {
                if (marker.getPopup().isOpen()) {
                    marker.closePopup();
                }
            });
        };
    };


    const toggleSavedOnMap = () => {
        if (typeof window === 'undefined' || !map) return;

        const L = window.L;

        if (!showSavedOnMap) {
       
            const newSavedMarkers = [];
            
            savedVenues.forEach((venue) => {
                const coordinates = VENUE_COORDINATES[venue.name] || VENUE_COORDINATES.default;
                
                const marker = L.marker([coordinates.lat, coordinates.lng])
                    .addTo(map)
                    .bindPopup(`<b>${venue.name}</b><br>${venue.address}<br><small>Saved venue</small>`)
                    .openPopup();

         
                marker.getElement().classList.add('saved-venue-marker');
                
                newSavedMarkers.push(marker);
            });

            setSavedMarkers(newSavedMarkers);
            setShowSavedOnMap(true);
        } else {
      
            savedMarkers.forEach(marker => {
                if (marker && map) {
                    map.removeLayer(marker);
                }
            });
            setSavedMarkers([]);
            setShowSavedOnMap(false);
        }
    };


    const resetFilters = () => {
        console.log('Resetting all filters');
        setFilters({
            galleries: false,
            museums: false,
            theaters: false,
            music: false,
            cultural: false
        });
        setShowSavedOnMap(false);
        savedMarkers.forEach(marker => {
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
                
                {/* Sidebar - Filters */}
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
                                {VENUE_TYPES.map(type => (
                                    <label key={type.id} style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '0.75rem',
                                        cursor: 'pointer',
                                        padding: '0.5rem',
                                        borderRadius: 'var(--radius-md)',
                                        transition: 'background 0.2s',
                                        background: filters[type.id] ? 'var(--c-bg-surface-hover)' : 'transparent'
                                    }}>
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

                        {/* Saved Section */}
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
                                    variant={showSavedOnMap ? "primary" : "secondary"}
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
                                    {savedVenues.map(venue => (
                                        <div key={venue.id} style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '0.75rem',
                                            padding: '0.75rem',
                                            background: showSavedOnMap ? 'var(--c-bg-surface-hover)' : 'var(--c-bg-subtle)',
                                            borderRadius: 'var(--radius-md)',
                                            border: showSavedOnMap ? '1px solid var(--c-brand-primary)' : 'none',
                                            transition: 'all 0.2s ease'
                                        }}>
                                            <img 
                                                src={venue.image} 
                                                alt={venue.name}
                                                style={{ 
                                                    width: '40px', 
                                                    height: '40px', 
                                                    borderRadius: 'var(--radius-sm)',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <p style={{ 
                                                    fontSize: '0.875rem', 
                                                    fontWeight: '500', 
                                                    margin: 0,
                                                    color: showSavedOnMap ? 'var(--c-brand-primary)' : 'inherit'
                                                }}>
                                                    {venue.name}
                                                </p>
                                                <p className="text-muted" style={{ fontSize: '0.75rem', margin: 0 }}>{venue.savedDate}</p>
                                            </div>
                                            {showSavedOnMap && (
                                                <div style={{
                                                    width: '8px',
                                                    height: '8px',
                                                    borderRadius: '50%',
                                                    background: 'var(--c-brand-primary)',
                                                    animation: 'pulse 2s infinite'
                                                }} />
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
                    </div>
                    
                    <div style={{ padding: '1.5rem', borderTop: '1px solid var(--c-border)' }}>
                         <Button className="w-full" variant="secondary" onClick={resetFilters}>
                            Reset Filters
                         </Button>
                    </div>
                </aside>

                {/* Main Map Area */}
                <div style={{ flex: 1, position: 'relative', background: '#e5e7eb' }}>
                    {/* Floating Search Bar */}
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
                            border: '1px solid var(--c-border)'
                        }}>
                             <input 
                                type="text"
                                placeholder="Search by location or name..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ 
                                    flex: 1, 
                                    border: 'none', 
                                    outline: 'none', 
                                    padding: '0.5rem 0.75rem',
                                    background: 'transparent',
                                    fontSize: '0.95rem'
                                }}
                            />
                            <Button size="sm" style={{ padding: '0.5rem 1rem' }}>Search</Button>
                        </div>
                    </div>

                    {/* Leaflet Map Container */}
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
            
            {/* CSS for Mobile Responsive Sidebar */}
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
