export class ApiService {
    static async login(email, password) {
        return this.post('/api/auth/login', { email, password });
    }

    static async register(email, password, adminCode = null) {
        const payload = { email, password };
        if (adminCode) payload.adminCode = adminCode;
        return this.post('/api/auth/register', payload);
    }

    static async getUserProfile(email) {
        return this.get(`/api/user/${email}`);
    }

    static async getUserBookings(email) {
        return this.get(`/api/user/${email}/bookings`);
    }

    static async createBooking(bookingData) {
        return this.post('/api/bookings/create', bookingData);
    }

    static async cancelBooking(bookingId) {
        return this.post(`/api/bookings/cancel/${bookingId}`, {});
    }

    // --- Helper Methods ---
    static async post(endpoint, body) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            return await response.json();
        } catch (error) {
            console.error(`POST ${endpoint} failed:`, error);
            return { success: false, message: 'Network error' };
        }
    }

    static async get(endpoint) {
        try {
            const response = await fetch(endpoint);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`GET ${endpoint} failed:`, error);
            return null; // or throw error depending on how you want to handle it
        }
    }
}
