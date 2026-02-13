/**
 * SPRING BOOT API SERVICE - ParkEase
 * Use this file to connect to your real Spring Boot Backend.
 * 
 * To use this:
 * 1. Ensure your Spring Boot app is running on http://localhost:8080
 * 2. In your HTML files, change the import:
 *    FROM: import { API } from './js/mock-api.js';
 *    TO:   import { API } from './js/spring-boot-api.js';
 */

const BASE_URL = 'http://localhost:8080/api'; // Change if your backend runs on a different port

export const API = {

    // ============================
    // 1. AUTHENTICATION (Login/Register)
    // ============================

    // Send Login Data to Spring Boot
    login: async (email, password) => {
        try {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }) // Sending JSON data
            });

            const data = await response.json();

            if (response.ok) {
                // Spring Boot should return: { success: true, user: { ... }, token: "..." }
                return { success: true, user: data.user, token: data.token };
            } else {
                return { success: false, message: data.message || 'Login failed' };
            }
        } catch (error) {
            console.error("API Error:", error);
            return { success: false, message: 'Server connection error' };
        }
    },

    // Send Registration Data (including optional Admin Code)
    register: async (email, password, adminSecretCode = '') => {
        try {
            const response = await fetch(`${BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    secretCode: adminSecretCode // Spring Boot checks this to assign ADMIN role
                })
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message || 'Registration failed' };
            }
        } catch (error) {
            return { success: false, message: 'Server connection error' };
        }
    },

    logout: async () => {
        localStorage.removeItem('parkease_user');
        window.location.href = 'index.html';
    },

    // ============================
    // 2. LOCATIONS (Fetching Parking Spots)
    // ============================

    // Fetch all parking locations from Backend
    getLocations: async () => {
        try {
            const response = await fetch(`${BASE_URL}/locations`);
            if (response.ok) {
                return await response.json(); // Returns array of locations
            }
            return [];
        } catch (error) {
            console.error("Failed to load locations", error);
            return [];
        }
    },

    getLocationById: async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/locations/${id}`);
            if (response.ok) return await response.json();
            return null;
        } catch (error) {
            return null;
        }
    },

    // Add New Location (Admin Only)
    addLocation: async (locData) => {
        try {
            const user = JSON.parse(localStorage.getItem('parkease_user'));
            const response = await fetch(`${BASE_URL}/locations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(locData)
            });

            if (response.ok) return { success: true };
            return { success: false, message: 'Failed to add location' };
        } catch (error) {
            return { success: false, message: 'Server error' };
        }
    },

    // Delete Location (Admin Only)
    deleteLocation: async (id) => {
        try {
            const user = JSON.parse(localStorage.getItem('parkease_user'));
            const response = await fetch(`${BASE_URL}/locations/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            if (response.ok) return { success: true };
            return { success: false };
        } catch (error) {
            return { success: false };
        }
    },

    // ============================
    // 3. BOOKINGS (Saving Data)
    // ============================

    // Save a new booking to the database
    saveBooking: async (bookingData) => {
        // bookingData looks like: { userId: 1, locId: "loc_001", date: "...", time: "..." }
        try {
            const token = JSON.parse(localStorage.getItem('parkease_user'))?.token; // Get JWT if using security

            const response = await fetch(`${BASE_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Send Token for security
                },
                body: JSON.stringify(bookingData)
            });

            const data = await response.json();
            if (response.ok) return { success: true, booking: data };
            return { success: false, message: data.message };
        } catch (error) {
            return { success: false, message: 'Booking failed' };
        }
    },

    // Get user's bookings
    getBookings: async () => {
        try {
            const user = JSON.parse(localStorage.getItem('parkease_user'));
            if (!user) return [];

            const response = await fetch(`${BASE_URL}/bookings/user/${user.id}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            if (response.ok) return await response.json();
            return [];
        } catch (error) {
            return [];
        }
    },

    cancelBooking: async (id) => {
        try {
            const user = JSON.parse(localStorage.getItem('parkease_user'));
            const response = await fetch(`${BASE_URL}/bookings/${id}/cancel`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            return { success: response.ok };
        } catch (error) {
            return { success: false };
        }
    },

    // ============================
    // 4. ADMIN STATS
    // ============================
    getStats: async () => {
        try {
            const user = JSON.parse(localStorage.getItem('parkease_user'));
            const response = await fetch(`${BASE_URL}/admin/stats`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (response.ok) return await response.json();
            return null;
        } catch (error) {
            return null;
        }
    }
};
