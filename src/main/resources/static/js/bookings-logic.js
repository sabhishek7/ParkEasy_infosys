import { ApiService } from './api-service.js';
import { initAuth, showToast } from './app.js';

// Auth Check
const user = JSON.parse(localStorage.getItem('parkease_user'));
if (!user) window.location.href = 'login.html';

initAuth();

// Mobile Menu
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        navLinks.classList.contains('active') ? icon.classList.replace('fa-bars', 'fa-times') : icon.classList.replace('fa-times', 'fa-bars');
    });
}

const list = document.getElementById('bookingList');

// Load Data
setTimeout(async () => {
    try {
        const bookings = await ApiService.getUserBookings(user.id);
        renderBookings(bookings || []);
    } catch (err) {
        list.innerHTML = '<p class="text-center text-danger">Failed to load bookings</p>';
    }
}, 500);

function renderBookings(items) {
    list.innerHTML = '';

    if (items.length === 0) {
        list.innerHTML = `
            <div class="text-center" style="padding: 4rem 0;">
                <div style="width: 80px; height: 80px; background: #f1f5f9; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
                    <i class="far fa-calendar-times" style="font-size: 2rem; color: var(--text-muted);"></i>
                </div>
                <h3 style="color: var(--text-main);">No bookings found</h3>
                <p style="color: var(--text-muted); margin-bottom: 2rem;">You haven't made any parking reservations yet.</p>
                <a href="search.html" class="btn btn-primary">Find a Spot</a>
            </div>
        `;
        return;
    }

    items.forEach((book, index) => {
        const item = document.createElement('div');
        item.className = 'card';
        item.style.marginBottom = '1rem';
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.style.flexWrap = 'wrap';
        item.style.gap = '1rem';
        item.style.animation = `slideUp 0.5s ease forwards ${index * 0.1}s`;
        item.style.opacity = '0';

        // Format Date/Time
        const bookDate = new Date(book.startTime);
        const dateStr = bookDate.toLocaleDateString();
        const timeStr = bookDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Status Logic
        let statusColor = 'var(--success)';
        let statusBg = '#dcfce7';
        let btnAction = `<button onclick="window.cancelBooking('${book.id}')" class="btn btn-outline" style="border-color: var(--danger); color: var(--danger); font-size: 0.8rem; padding: 0.5rem 1rem;">Cancel</button>`;

        if (book.status === 'Cancelled') {
            statusColor = 'var(--danger)';
            statusBg = '#fee2e2';
            btnAction = `<span style="color: var(--text-muted); font-size: 0.8rem;">Cancelled</span>`;
            item.style.opacity = '0.7';
        }

        item.innerHTML = `
            <div class="flex items-center gap-2">
                <div style="width: 60px; height: 60px; background: var(--primary-light); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--primary); font-size: 1.5rem;">
                    <i class="fas fa-car-side"></i>
                </div>
                <div>
                    <h3 style="font-size: 1.1rem; margin-bottom: 0.25rem;">${book.locationName}</h3>
                    <div class="flex gap-2 text-muted" style="font-size: 0.85rem;">
                        <span><i class="far fa-calendar"></i> ${dateStr}</span>
                        <span><i class="far fa-clock"></i> ${timeStr}</span>
                        <span><i class="fas fa-hourglass-half"></i> ${book.durationInHours}h</span>
                    </div>
                </div>
            </div>
            
            <div class="flex items-center gap-4" style="flex-wrap: wrap;">
                <div style="text-align: right;">
                    <div class="price-tag" style="font-size: 1.1rem;">₹${book.totalPrice.toFixed(2)}</div>
                    <span style="background: ${statusBg}; color: ${statusColor}; padding: 2px 8px; border-radius: 4px; font-weight: 600; font-size: 0.75rem; display: inline-block;">${book.status}</span>
                </div>
                ${btnAction}
            </div>
        `;
        list.appendChild(item);
    });
}

window.cancelBooking = async (id) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
        const res = await ApiService.cancelBooking(id);
        if (res.success) {
            showToast('Booking Cancelled Successfully', 'success');
            setTimeout(() => window.location.reload(), 1000);
        } else {
            showToast('Failed to cancel booking', 'error');
        }
    }
};
