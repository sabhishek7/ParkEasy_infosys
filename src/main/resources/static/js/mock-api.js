/**
 * MOCK API SERVICE - ParkEase v2
 * Data simulation with LocalStorage for bookings
 */

export const mockLocations = [
    {
        id: "loc_001",
        name: "Central Plaza Garage",
        address: "123 Main St, Downtown",
        price: 5.00,
        slots: 12,
        image: "https://images.unsplash.com/photo-1470224114660-3f6686c562eb?q=80&w=600&auto=format&fit=crop",
        desc: "Secure multi-level parking with EV charging stations. Located right next to the Central Business District.",
        reviews: 4.5,
        features: ["Covered", "CCTV", "EV Charging", "24/7 Access"],
        coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    {
        id: "loc_002",
        name: "Mall of ParkEase",
        address: "456 Market Ave, Westside",
        price: 3.50,
        slots: 45,
        image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=600&auto=format&fit=crop",
        desc: "Direct access to shopping mall. First hour free on weekends. Spacious spots suitable for SUVs.",
        reviews: 4.2,
        features: ["Covered", "Disabled Access", "Car Wash"],
        coordinates: { lat: 40.7282, lng: -73.7949 }
    },
    {
        id: "loc_003",
        name: "Airport Long-Term",
        address: "789 Airport Blvd",
        price: 12.00,
        slots: 8,
        image: "https://images.unsplash.com/photo-1590674899505-1c5c41949430?q=80&w=600&auto=format&fit=crop",
        desc: "Open-air lot with shuttle service to terminals every 15 minutes. Fenced and guarded.",
        reviews: 3.8,
        features: ["Shuttle", "Fenced", "Long Term"],
        coordinates: { lat: 40.6413, lng: -73.7781 }
    },
    {
        id: "loc_004",
        name: "Stadium Event Parking",
        address: "101 Sports Way",
        price: 8.00,
        slots: 0, // FULL
        image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=600&auto=format&fit=crop",
        desc: "Closest parking to the arena. Pre-booking mandatory during events. Tailgating allowed.",
        reviews: 4.8,
        features: ["Event Rates", "Open Air", "Lighting"],
        coordinates: { lat: 40.8296, lng: -73.9262 }
    },
    {
        id: "loc_005",
        name: "Riverside Parking",
        address: "22 River Rd, Northside",
        price: 4.00,
        slots: 20,
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        desc: "Scenic parking spot near the river walk. Perfect for joggers and tourists.",
        reviews: 4.6,
        features: ["Scenic", "Paved", "24/7 Access"],
        coordinates: { lat: 40.8000, lng: -74.0000 }
    }
];

// simulate delay
const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const API = {
    // --- LOCATIONS ---
    getLocations: async () => {
        await delay(600);
        const storedLocs = JSON.parse(localStorage.getItem('parkease_locations') || '[]');
        // Combine default mock locations with user-added ones, prioritizing user ones if ID conflicts (though we use unique IDs)
        return [...mockLocations, ...storedLocs];
    },

    getLocationById: async (id) => {
        await delay(400);
        const storedLocs = JSON.parse(localStorage.getItem('parkease_locations') || '[]');
        const allLocs = [...mockLocations, ...storedLocs];
        return allLocs.find(l => l.id === id) || null;
    },

    addLocation: async (locData) => {
        await delay(800);
        const storedLocs = JSON.parse(localStorage.getItem('parkease_locations') || '[]');

        const newLoc = {
            ...locData,
            id: `loc_custom_${Date.now()}`,
            coordinates: { lat: 40.7128 + (Math.random() - 0.5) * 0.1, lng: -74.0060 + (Math.random() - 0.5) * 0.1 } // Random nearby coords
        };

        storedLocs.push(newLoc);
        localStorage.setItem('parkease_locations', JSON.stringify(storedLocs));
        return { success: true, location: newLoc };
    },

    deleteLocation: async (id) => {
        await delay(500);
        // Only deletes custom locations from localStorage for now
        const storedLocs = JSON.parse(localStorage.getItem('parkease_locations') || '[]');
        const updatedLocs = storedLocs.filter(l => l.id !== id);

        if (storedLocs.length !== updatedLocs.length) {
            localStorage.setItem('parkease_locations', JSON.stringify(updatedLocs));
            return { success: true };
        }

        // Cannot delete default mock locations in this simple mock setup without more complex logic
        return { success: false, message: "Cannot delete demo data" };
    },

    // --- BOOKINGS ---
    getBookings: async () => {
        await delay(300); // Simulate network fetch
        const stored = localStorage.getItem('parkease_bookings');
        return stored ? JSON.parse(stored) : [];
    },

    saveBooking: async (bookingData) => {
        await delay(800);
        const stored = localStorage.getItem('parkease_bookings');
        const bookings = stored ? JSON.parse(stored) : [];

        const newBooking = {
            ...bookingData,
            id: `BK-${Date.now().toString().slice(-6)}`, // Short clean ID
            status: 'Upcoming',
            timestamp: new Date().toISOString()
        };

        bookings.push(newBooking);
        localStorage.setItem('parkease_bookings', JSON.stringify(bookings));

        // Also update local slot count mock (optional, resets on reload)
        const locIndex = mockLocations.findIndex(l => l.id === bookingData.locId);
        if (locIndex > -1 && mockLocations[locIndex].slots > 0) {
            mockLocations[locIndex].slots--;
        }

        return { success: true, booking: newBooking };
    },

    cancelBooking: async (id) => {
        await delay(500);
        const stored = localStorage.getItem('parkease_bookings');
        if (!stored) return { success: false, message: 'No bookings found' };

        const bookings = JSON.parse(stored);
        const updated = bookings.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b);

        localStorage.setItem('parkease_bookings', JSON.stringify(updated));
        return { success: true };
    },

    // --- AUTH ---
    login: async (email, password) => {
        await delay(800);

        // 1. Check Registered Users DB
        const dbString = localStorage.getItem('parkease_users_db');
        if (dbString) {
            const db = JSON.parse(dbString);
            const foundUser = db.find(u => u.email === email && u.password === password);
            if (foundUser) {
                // Return found user (without password)
                const { password, ...safeUser } = foundUser;
                const sessionUser = { ...safeUser, token: 'mock-jwt-' + Date.now() };
                localStorage.setItem('parkease_user', JSON.stringify(sessionUser));
                return { success: true, user: sessionUser };
            }
        }

        // 2. Fallback Mock Logic (Legacy/Demo)
        if (email && password && password.length >= 6) {
            const user = {
                id: 'u_' + Math.floor(Math.random() * 1000),
                email,
                name: email.split('@')[0],
                role: email.includes('admin') ? 'admin' : 'user',
                token: 'mock-jwt-token-' + Date.now()
            };

            // Don't save to DB, just session
            localStorage.setItem('parkease_user', JSON.stringify(user));
            return { success: true, user };
        }
        return { success: false, message: 'Invalid credentials. Password must be 6+ chars.' };
    },

    register: async (email, password, adminSecretCode = '') => {
        await delay(1200);
        if (!email || !password) return { success: false, message: 'Missing fields' };

        // Save to Mock DB
        const dbString = localStorage.getItem('parkease_users_db');
        const db = dbString ? JSON.parse(dbString) : [];

        if (db.find(u => u.email === email)) {
            return { success: false, message: 'Email already exists' };
        }

        // --- ADMIN VERIFICATION LOGIC ---
        // If code matches "ADMIN2026", role is admin. Else, role is user.
        let role = 'user';
        if (adminSecretCode === 'ADMIN2026') {
            role = 'admin';
        }
        // --------------------------------

        const newUser = {
            id: 'u_' + Date.now(),
            email,
            password, // In real app, hash this!
            name: email.split('@')[0],
            role
        };

        db.push(newUser);
        localStorage.setItem('parkease_users_db', JSON.stringify(db));

        return { success: true, message: role === 'admin' ? 'Admin Account created!' : 'Account created! Please login.' };
    },

    logout: async () => {
        await delay(200);
        localStorage.removeItem('parkease_user');
        window.location.href = 'index.html';
    },

    // --- ADMIN ---
    getStats: async () => {
        await delay(500);
        return {
            revenue: 1240,
            occupancy: 76,
            activeSessions: 42,
            issues: 3
        };
    },

    getAdminSlots: async () => {
        await delay(400);
        // Generate mock slots
        const slots = [];
        const statuses = ['FREE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE'];
        for (let i = 1; i <= 30; i++) {
            slots.push({
                id: `A-${i}`,
                status: statuses[Math.floor(Math.random() * (i % 5 === 0 ? 4 : 2))] // Mostly free/occupied, occasional maintenance
            });
        }
        return slots;
    },

    toggleSlotStatus: async (slotId, currentStatus) => {
        await delay(300);
        return {
            success: true,
            newStatus: currentStatus === 'FREE' ? 'MAINTENANCE' : 'FREE'
        };
    }
};
