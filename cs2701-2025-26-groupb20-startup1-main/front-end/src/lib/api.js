const NETWORK_LATENCY = { min: 350, max: 900 };

const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
});

const BASE_URL = 'http://localhost:8080/api/v1/venues';
const USER_ID = '00000000-0000-0000-0000-000000000001';

const simulateNetwork = async () => {
    const duration = Math.floor(
        NETWORK_LATENCY.min + Math.random() * (NETWORK_LATENCY.max - NETWORK_LATENCY.min)
    );
    return new Promise((resolve) => setTimeout(resolve, duration));
};

const respond = async (payload) => {
    await simulateNetwork();
    return payload;
};

// AUTH
export async function submitSignUp(payload) {
    console.info('[stub] POST /api/auth/signup', payload);
    return respond({ success: true, message: `We will email ${payload.email} once invites open.` });
}

export async function submitSignIn(payload) {
    console.info('[stub] POST /api/auth/signin', payload);
    return respond({ success: true, message: `Preview unlocked for ${payload.email || 'your account'}.` });
}

// PROFILE
export async function saveProfileDetails(payload) {
    console.info('[stub] PUT /api/profile', payload);
    return respond({ success: true, profile: payload });
}

export async function upsertProfilePost(payload) {
    console.info('[stub] POST /api/posts', payload);
    const now = new Date();
    const post = {
        ...payload,
        id: payload.id ?? `post-${now.getTime()}`,
        createdAt: payload.createdAt ?? DATE_FORMAT.format(now),
        updatedAt: now.toISOString(),
    };
    return respond({ success: true, post });
}

export async function deleteProfilePost(postId) {
    console.info('[stub] DELETE /api/posts/' + postId);
    return respond({ success: true });
}

// RATINGS
export async function recordRatingEntry(payload) {
    console.info('[stub] POST /api/ratings', payload);
    const now = new Date();
    const entry = {
        ...payload,
        id: payload.id ?? `rating-${now.getTime()}`,
    };
    return respond({ success: true, entry });
}

export async function deleteRatingEntry(entryId) {
    console.info('[stub] DELETE /api/ratings/' + entryId);
    return respond({ success: true });
}

// COMMUNITY
export async function publishCommunityEntry(payload) {
    console.info('[stub] POST /api/community', payload);
    const now = new Date();
    const entry = {
        ...payload,
        id: payload.id ?? `community-${now.getTime()}`,
        date: DATE_FORMAT.format(now),
    };
    return respond({ success: true, entry });
}

export async function removeCommunityEntry(entryId) {
    console.info('[stub] DELETE /api/community/' + entryId);
    return respond({ success: true });
}

// DISCOVER EVENTS
export async function getDiscoverEvents(filters = {}) {
    console.info('[stub] GET /api/discover/events', filters);

    const events = [
        {
            id: 1,
            title: 'Neon Horizons Exhibition',
            venue: 'The Tate Modern',
            date: 'Nov 24, 2025',
            time: '18:00 - 21:00',
            category: 'Exhibition',
            ImageUrl: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            price: '£15.00',
            description: 'A retrospective of digital light art featuring prominent London artists.'
        },
        {
            id: 2,
            title: 'Acoustic Sessions: Riverside',
            venue: 'Southbank Centre',
            date: 'Nov 26, 2025',
            time: '20:00 - 23:00',
            category: 'Music',
            ImageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            price: '£22.50',
            description: 'Intimate acoustic performances by emerging indie-folk artists.'
        },
        {
            id: 3,
            title: 'Contemporary Dance Workshop',
            venue: "Sadler's Wells",
            date: 'Nov 28, 2025',
            time: '10:00 - 14:00',
            category: 'Workshop',
            ImageUrl: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            price: '£45.00',
            description: 'An open-level workshop exploring movement and improvisation techniques.'
        },
        {
            id: 4,
            title: 'Sculpture in the City Tour',
            venue: 'Barbican Centre (Meeting Point)',
            date: 'Dec 02, 2025',
            time: '11:00 - 13:00',
            category: 'Tour',
            ImageUrl: 'https://images.unsplash.com/photo-1554188248-986adbb73be0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            price: 'Free',
            description: 'Guided walking tour of public sculptures in the Square Mile.'
        }
    ];

    return respond({ success: true, events });
}

// SAVED VENUES
export async function getSavedVenues() {
    console.info('[real] GET /api/v1/venues/saved/' + USER_ID);

    try {
        const response = await fetch(`${BASE_URL}/saved/${USER_ID}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch saved venue IDs: ${response.status}`);
        }

        const data = await response.json();
        const venueIds = data.venueIds || [];

        if (venueIds.length === 0) {
            return { success: true, venues: [] };
        }

        const detailsResponse = await fetch(`${BASE_URL}/details`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(venueIds)
        });

        if (!detailsResponse.ok) {
            throw new Error(`Failed to fetch saved venue details: ${detailsResponse.status}`);
        }

        const venues = await detailsResponse.json();

        return {
            success: true,
            venues: venues.map((venue) => ({
                ...venue,
                ImageUrl: venue.ImageUrl || 'https://via.placeholder.com/40?text=V',
                savedDate: 'Recently'
            }))
        };
    } catch (error) {
        console.error('getSavedVenues error:', error);
        return { success: false, venues: [] };
    }
}

// RECENTLY VIEWED
export async function getRecentlyViewed() {
    console.info('[real] GET /api/v1/venues/viewed/' + USER_ID);

    try {
        const response = await fetch(`${BASE_URL}/viewed/${USER_ID}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch recently viewed venue IDs: ${response.status}`);
        }

        const data = await response.json();
        const venueIds = data.venueIds || [];

        if (venueIds.length === 0) {
            return { success: true, venues: [] };
        }

        const detailsResponse = await fetch(`${BASE_URL}/details`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(venueIds)
        });

        if (!detailsResponse.ok) {
            throw new Error(`Failed to fetch recently viewed venue details: ${detailsResponse.status}`);
        }

        const venues = await detailsResponse.json();

        return {
            success: true,
            venues: venues.map((venue) => ({
                ...venue,
                ImageUrl: venue.ImageUrl || 'https://via.placeholder.com/40?text=V',
                viewedDate: 'Recently'
            }))
        };
    } catch (error) {
        console.error('getRecentlyViewed error:', error);
        return { success: false, venues: [] };
    }
}

// VENUES
export async function getVenues() {
    try {
        const response = await fetch('http://localhost:8080/api/v1/venues');

        if (!response.ok) {
            throw new Error(`Failed to fetch venues: ${response.status}`);
        }

        const data = await response.json();

        const venues = Array.isArray(data)
            ? data
            : Array.isArray(data.venues)
                ? data.venues
                : Array.isArray(data.content)
                    ? data.content
                    : [];

        return { success: true, venues };
    } catch (error) {
        console.error('getVenues error:', error);
        return { success: false, venues: [] };
    }
}


// SEARCH BAR
export async function searchVenuesByName(query) {
    console.info('[real] GET /api/v1/venues/search?query=' + query);

    try {
        if (!query || !query.trim()) {
            return { success: true, venues: [] };
        }

        const searchResponse = await fetch(
            `${BASE_URL}/search?query=${encodeURIComponent(query.trim())}`
        );

        if (!searchResponse.ok) {
            throw new Error(`Failed to search venues: ${searchResponse.status}`);
        }

        const data = await searchResponse.json();
        const venueIds = data.venueIds || [];

        if (venueIds.length === 0) {
            return { success: true, venues: [] };
        }

        const detailsResponse = await fetch(`${BASE_URL}/details`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(venueIds)
        });

        if (!detailsResponse.ok) {
            throw new Error(`Failed to fetch searched venue details: ${detailsResponse.status}`);
        }

        const venues = await detailsResponse.json();

        return {
            success: true,
            venues: venues.map((venue) => ({
                ...venue,
                ImageUrl: venue.ImageUrl || 'https://via.placeholder.com/40?text=V'
            }))
        };
    } catch (error) {
        console.error('searchVenuesByName error:', error);
        return { success: false, venues: [] };
    }
}

// SAVE VENUE
export async function saveVenueForUser(venueId) {
    console.info('[real] POST /api/v1/venues/saved/' + USER_ID + '/' + venueId);

    try {
        const response = await fetch(`${BASE_URL}/saved/${USER_ID}/${venueId}`, {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error(`Failed to save venue: ${response.status}`);
        }

        return { success: true };
    } catch (error) {
        console.error('saveVenueForUser error:', error);
        return { success: false };
    }
}

// REMOVE SAVED VENUE
export async function removeSavedVenueForUser(venueId) {
    console.info('[real] DELETE /api/v1/venues/saved/' + USER_ID + '/' + venueId);

    try {
        const response = await fetch(`${BASE_URL}/saved/${USER_ID}/${venueId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Failed to remove venue: ${response.status}`);
        }

        return { success: true };
    } catch (error) {
        console.error('removeSavedVenueForUser error:', error);
        return { success: false };
    }
}

// PROFILE POSTS
export async function getProfilePosts(userId) {
    console.info('[stub] GET /api/posts', userId);

    const posts = [
        {
            id: 'post-1',
            userId: userId,
            content: 'Just finished my latest installation piece! Check it out at the Neon Horizons Exhibition.',
            image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&auto=format&fit=crop&q=60',
            createdAt: '2 hours ago',
            likes: 12,
            comments: 3
        },
        {
            id: 'post-2',
            userId: userId,
            content: 'Looking for collaborators for a new mural project in Shoreditch. DM me if interested!',
            image: null,
            createdAt: '1 day ago',
            likes: 8,
            comments: 1
        }
    ];

    return respond({ success: true, posts });
}