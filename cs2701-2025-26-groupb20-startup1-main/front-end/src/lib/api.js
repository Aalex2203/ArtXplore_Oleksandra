const NETWORK_LATENCY = { min: 350, max: 900 };

const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
});

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
            image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
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
            image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
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
            image: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
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
            image: 'https://images.unsplash.com/photo-1554188248-986adbb73be0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            price: 'Free',
            description: 'Guided walking tour of public sculptures in the Square Mile.'
        }
    ];

    return respond({ success: true, events });
}

// SAVED VENUES
export async function getSavedVenues() {
    console.info('[stub] GET /api/saved-venues');

    const savedVenues = [
        {
            id: 'saved-1',
            name: 'Tate Modern',
            type: 'museums',
            address: 'Bankside, London SE1 9TG',
            image: 'https://images.unsplash.com/photo-1565116147714-63bfb4621d46?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0',
            savedDate: '2 days ago'
        },
        {
            id: 'saved-2',
            name: 'Royal Opera House',
            type: 'theaters',
            address: 'Bow St, London WC2E 9DD',
            image: 'https://plus.unsplash.com/premium_photo-1661962571049-792ae9be2d79?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0',
            savedDate: '1 week ago'
        }
    ];

    return respond({ success: true, venues: savedVenues });
}

// RECENTLY VIEWED
export async function getRecentlyViewed() {
    console.info('[stub] GET /api/recently-viewed');

    const recentlyViewed = [
        {
            id: 'recent-1',
            name: 'Southbank Centre',
            type: 'cultural',
            address: 'Belvedere Rd, London SE1 8XX',
            image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=60',
            viewedDate: 'Today'
        },
        {
            id: 'recent-2',
            name: 'Apollo Theatre',
            type: 'theaters',
            address: 'Shaftesbury Ave, London W1D 7EZ ',
            image: 'https://images.unsplash.com/photo-1728175479221-54ae3f0e8683?q=80&w=824&auto=format&fit=crop&ixlib=rb-4.1.0',
            viewedDate: 'Yesterday'
        },
        {
            id: 'recent-3',
            name: 'O2 Arena',
            type: 'music',
            address: 'Peninsula Square, London SE10 0DX',
            image: 'https://images.unsplash.com/photo-1723338150317-4e9ee73bdcf9?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0',
            viewedDate: '3 days ago'
        }
    ];

    return respond({ success: true, venues: recentlyViewed });
}

// VENUES
export async function getVenues(filters = {}) {
    console.info('[stub] GET /api/venues', filters);
    const venues = [
        {
            id: 1,
            name: 'The White Cube',
            type: 'galleries',
            price: 2,
            lat: 51.505,
            lng: -0.09,
            address: '123 Art Street, London',
            description: 'A contemporary art gallery in the heart of London.'
        },
        {
            id: 2,
            name: 'London Museum of History',
            type: 'museums',
            price: 1,
            lat: 51.51,
            lng: -0.1,
            address: '45 History Lane, London',
            description: 'Explore the rich history of London.'
        },
        {
            id: 3,
            name: 'Royal Theater',
            type: 'theaters',
            price: 3,
            lat: 51.515,
            lng: -0.09,
            address: '78 Drama Road, London',
            description: 'Experience world-class theater performances.'
        },
        {
            id: 4,
            name: 'Jazz Club Soho',
            type: 'music',
            price: 2,
            lat: 51.512,
            lng: -0.13,
            address: '10 Jazz Court, London',
            description: 'Live jazz music every night.'
        },
        {
            id: 5,
            name: 'Community Arts Center',
            type: 'cultural',
            price: 0,
            lat: 51.52,
            lng: -0.08,
            address: '22 Community Way, London',
            description: 'A space for community art projects and workshops.'
        }
    ];

    // Simple mock filtering over here.
    const filteredVenues = venues.filter(venue => {
        return !(filters.type && filters.type[venue.type] === false);
    });

    return respond({ success: true, venues: filteredVenues });
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
