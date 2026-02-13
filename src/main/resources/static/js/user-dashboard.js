import { ApiService } from './api-service.js';
import { initAuth } from './app.js';

// Auth Check
const user = JSON.parse(localStorage.getItem('parkease_user'));
if (!user) {
    window.location.href = 'login.html';
}

window.logout = () => {
    localStorage.removeItem('parkease_user');
    window.location.href = 'login.html';
};

// Fetch Real User Data
async function loadUserProfile() {
    try {
        const userData = await ApiService.getUserProfile(user.email);

        if (userData) {
            const userNameEl = document.getElementById('userName');
            if (userNameEl) userNameEl.innerText = userData.name;

            const userEmailEl = document.getElementById('userEmail');
            if (userEmailEl) userEmailEl.innerText = userData.email;

            // Update Wallet and Points
            const statCards = document.querySelectorAll('.stat-card p');
            if (statCards.length >= 3) {
                statCards[1].innerText = `₹${userData.walletBalance.toFixed(2)}`;
                statCards[2].innerText = userData.loyaltyPoints.toLocaleString();
            }

            // Also Sidebar Wallet
            const sidebarWallet = document.querySelector('.sidebar-menu .badge');
            if (sidebarWallet) sidebarWallet.innerText = `₹${userData.walletBalance.toFixed(2)}`;
        }
    } catch (error) {
        console.error("Failed to load user profile", error);
    }
}

// Load Recent Bookings
async function loadUserBookings() {
    const list = document.getElementById('recentBookingsList');
    if (!list) return;

    list.innerHTML = '<div class="skeleton mb-2" style="height: 60px;"></div>';

    try {
        const bookings = await ApiService.getUserBookings(user.email);

        list.innerHTML = '';

        if (!bookings || bookings.length === 0) {
            list.innerHTML = '<p class="text-muted text-sm text-center py-4">No recent bookings found.</p>';
            // Update Active Bookings count (1st stat card)
            const statCards = document.querySelectorAll('.stat-card p');
            if (statCards.length > 0) statCards[0].innerText = '0';
            return;
        }

        // Count Active Bookings
        const activeCount = bookings.filter(b => b.status === 'Active').length;
        const statCards = document.querySelectorAll('.stat-card p');
        if (statCards.length > 0) statCards[0].innerText = activeCount;

        // Show recent 3
        bookings.slice(0, 3).forEach(b => {
            const date = new Date(b.startTime).toLocaleDateString();
            const div = document.createElement('div');
            div.className = 'flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 transition rounded mb-1';
            div.innerHTML = `
                <div class="flex items-center gap-3">
                    <div style="width: 40px; height: 40px; background: #eff6ff; color: var(--primary); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-parking"></i>
                    </div>
                    <div>
                        <div class="font-bold text-sm">${b.locationName}</div>
                        <div class="text-xs text-muted">${date} • ${b.durationInHours}h</div>
                    </div>
                </div>
                <span class="badge" style="background: ${b.status === 'Cancelled' ? '#fee2e2' : '#dcfce7'}; color: ${b.status === 'Cancelled' ? '#991b1b' : '#166534'}; font-size: 0.7rem; padding: 2px 8px;">${b.status}</span>
             `;
            list.appendChild(div);
        });

    } catch (error) {
        console.error("Failed to load bookings", error);
        list.innerHTML = '<p class="text-danger text-sm text-center py-4">Error loading bookings.</p>';
    }
}

// Init
loadUserProfile();
loadUserBookings();
