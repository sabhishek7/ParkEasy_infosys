import { ApiService } from './api-service.js';
import { initAuth, showToast } from './app.js';

const params = new URLSearchParams(window.location.search);
const locId = params.get('id');
let currentLocation = null;

// Auth Check (redirect to login if not logged in?) - No, let them view details, but prompt login on Book.
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

if (!locId) {
    window.location.href = 'search.html';
}

// Load Details - MOCK FOR NOW UNTIL WE HAVE LOCATION CONTROLLER
// We will simulate fetching details from locId (1, 2, 3...)
const MOCK_LOCATIONS = [
    { id: 1, name: "Central Plaza Garage", address: "123 Main St, Downtown", price: 5.00, image: "https://images.unsplash.com/photo-1470224114660-3f6686c562eb?w=500&h=300&fit=crop", slots: 12, rating: 4.8, features: ["CCTV", "Covered"] },
    { id: 2, name: "Mall of City Parking", address: "45 Shopping Ave", price: 3.50, image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=500&h=300&fit=crop", slots: 45, rating: 4.5, features: ["EV Charge", "Wide Spots"] },
    { id: 3, name: "Airport Long-Term", address: "Terminal 2, Int'l Airport", price: 8.00, image: "https://images.unsplash.com/photo-1590674899505-1256b3b55c3c?w=500&h=300&fit=crop", slots: 0, rating: 4.2, features: ["Shuttle", "24/7"] },
    { id: 4, name: "Beachside Parking", address: "Ocean View Dr", price: 6.00, image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=300&fit=crop", slots: 8, rating: 4.7, features: ["Open Air", "View"] },
    { id: 5, name: "Tech Park Block A", address: "Silicon Valley Rd", price: 4.00, image: "https://images.unsplash.com/photo-1549637642-90187f64f420?w=500&h=300&fit=crop", slots: 110, rating: 4.9, features: ["Secure", "Valet"] },
    { id: 6, name: "Stadium Parking", address: "Sports Complex", price: 10.00, image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=500&h=300&fit=crop", slots: 50, rating: 4.4, features: ["Event Rates", "Lighting"] }
];

setTimeout(async () => {
    // In real app: currentLocation = await ApiService.getLocationById(locId);
    currentLocation = MOCK_LOCATIONS.find(l => l.id == locId) || MOCK_LOCATIONS[0];

    if (!currentLocation) {
        document.getElementById('detailsCard').innerHTML = '<p class="text-center">Location not found.</p>';
        return;
    }

    renderDetails(currentLocation);
}, 500);

function renderDetails(loc) {
    const container = document.getElementById('detailsCard');
    const galleryImages = [
        loc.image,
        "https://images.unsplash.com/photo-1590674899505-1256b3b55c3c?w=120&h=100&fit=crop",
        "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=120&h=100&fit=crop",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&h=100&fit=crop"
    ];

    container.innerHTML = `
        <div class="grid-split animate-fade-in" style="gap: 3rem; height: auto; grid-template-columns: 1.2fr 0.8fr;">
            <div>
                <div style="position: relative; overflow: hidden; border-radius: 16px; box-shadow: var(--shadow-md);">
                        <img src="${loc.image}" style="width:100%; height:400px; object-fit:cover; transition: transform 0.3s;" alt="${loc.name}" class="hover:scale-105">
                        <div style="position: absolute; top: 1rem; right: 1rem; background: white; padding: 0.5rem 1rem; border-radius: 100px; font-weight: 700; color: var(--text-main); box-shadow: var(--shadow-sm);">
                        <i class="fas fa-star text-warning"></i> ${loc.reviews || '4.8'} (120+)
                        </div>
                </div>
                
                <div class="flex gap-2 mt-4 overflow-x-auto pb-2">
                    ${galleryImages.map(img => `
                        <img src="${img}" style="width: 100px; height: 80px; object-fit: cover; border-radius: 8px; cursor: pointer; border: 2px solid transparent; transition: all 0.2s;" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='transparent'">
                    `).join('')}
                </div>

                <div class="mt-4">
                        <h2 class="mb-2">About this location</h2>
                        <p class="text-muted" style="line-height: 1.8;">${loc.desc || 'Experience premium parking with 24/7 security, covered spots, and EV charging stations. Located in the heart of the city, giving you easy access to malls, offices, and tourist attractions.'}</p>
                        
                        <h3 class="mt-4 mb-2">Amenities</h3>
                        <div class="flex gap-2 flex-wrap">
                            <span class="badge" style="background: #f1f5f9; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 500;"><i class="fas fa-shield-alt text-primary mr-1"></i> 24/7 Security</span>
                            <span class="badge" style="background: #f1f5f9; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 500;"><i class="fas fa-wifi text-primary mr-1"></i> Free Wifi</span>
                            <span class="badge" style="background: #f1f5f9; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 500;"><i class="fas fa-wheelchair text-primary mr-1"></i> Accessibility</span>
                            ${loc.features ? loc.features.map(f => `<span class="badge" style="background: #f1f5f9; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 500;"><i class="fas fa-check text-success mr-1"></i> ${f}</span>`).join('') : ''}
                        </div>
                </div>
            </div>
            
            <div>
                <div class="card" style="position: sticky; top: calc(var(--nav-height) + 1rem);">
                    <h1 class="mb-1" style="font-size: 1.75rem;">${loc.name}</h1>
                    <p class="text-muted mb-4"><i class="fas fa-map-marker-alt text-danger"></i> ${loc.address}</p>
                    
                    <div class="flex justify-between items-center bg-blue-50 p-3 rounded-lg mb-4" style="border: 1px solid #bfdbfe;">
                        <div class="flex items-center gap-2">
                            <div style="background: white; padding: 0.5rem; border-radius: 50%; color: var(--primary);">
                                <i class="fas fa-tag"></i>
                            </div>
                            <div>
                                <div class="text-sm text-secondary">Hourly Rate</div>
                                <div class="font-bold text-primary">₹${loc.price.toFixed(2)}</div>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div class="text-sm text-secondary">Status</div>
                            <div class="text-success font-bold">Open Now</div>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label class="block mb-1 font-bold text-sm">Select Date</label>
                        <input type="date" id="dateInput" class="input-field" value="${new Date().toISOString().split('T')[0]}" style="background: #f8fafc;">
                    </div>

                    <div class="grid-2 gap-2 mb-4" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div>
                            <label class="block mb-1 font-bold text-sm">Start Time</label>
                            <input type="time" id="timeInput" class="input-field" value="12:00" style="background: #f8fafc;">
                        </div>
                        <div>
                            <label class="block mb-1 font-bold text-sm">Duration</label>
                            <select id="durationInput" class="input-field" style="background: #f8fafc; cursor: pointer;">
                                <option value="1">1 Hour</option>
                                <option value="2" selected>2 Hours</option>
                                <option value="3">3 Hours</option>
                                <option value="4">4 Hours</option>
                                <option value="5">5 Hours</option>
                            </select>
                        </div>
                    </div>

                    <div class="flex justify-between items-center mb-4 pt-4 border-t border-gray-100">
                        <span class="text-lg font-bold">Total Price</span>
                        <span class="price-tag text-2xl" id="totalPriceDisplay">₹${(loc.price * 2).toFixed(2)}</span>
                    </div>

                    <button id="bookBtn" class="btn btn-primary w-full" style="padding: 1rem; font-size: 1.1rem;">
                        Reserve Spot
                    </button>
                    
                    <p class="text-center text-xs text-muted mt-2"><i class="fas fa-lock"></i> Secure Payment Guaranteed</p>
                </div>
            </div>
        </div>
    `;

    setupBookingLogic(loc);
}

function setupBookingLogic(loc) {
    const durationInput = document.getElementById('durationInput');
    const totalDisplay = document.getElementById('totalPriceDisplay');
    const bookBtn = document.getElementById('bookBtn');
    const dateInput = document.getElementById('dateInput');
    const timeInput = document.getElementById('timeInput');

    // Update Price
    durationInput.addEventListener('change', () => {
        const hours = parseInt(durationInput.value);
        const totalPrice = loc.price * hours;
        totalDisplay.innerText = `₹${totalPrice.toFixed(2)}`;
    });

    bookBtn.addEventListener('click', () => {
        const user = JSON.parse(localStorage.getItem('parkease_user'));
        if (!user) {
            showToast('Please login to book a spot', 'error');
            setTimeout(() => window.location.href = 'login.html', 1500);
            return;
        }

        // Show Modal
        document.getElementById('modalLocName').innerText = loc.name;

        // Format Date
        const dateObj = new Date(dateInput.value + 'T' + timeInput.value);
        document.getElementById('modalTime').innerText = dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

        const hours = parseInt(durationInput.value);
        document.getElementById('modalDuration').innerText = `${hours} Hours`;
        document.getElementById('modalPrice').innerText = totalDisplay.innerText;

        document.getElementById('bookingModal').classList.add('active');
    });

    // Confirm Booking Action
    const confirmBtn = document.getElementById('confirmBtn');

    // Remove old listeners by replacing node
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    newConfirmBtn.addEventListener('click', async () => {
        const user = JSON.parse(localStorage.getItem('parkease_user'));
        newConfirmBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing...';
        newConfirmBtn.disabled = true;

        const hours = parseInt(durationInput.value);
        const totalPrice = loc.price * hours;
        const finalTime = `${dateInput.value}T${timeInput.value}:00`; // ISO Format for Backend

        const bookingData = {
            userId: user.id, // Now using custom ID (e.g. USER001)
            locationName: loc.name,
            startTime: finalTime,
            duration: hours,
            price: totalPrice
        };

        try {
            const res = await ApiService.createBooking(bookingData);

            if (res.success) {
                showToast('Booking Successful!', 'success');
                setTimeout(() => window.location.href = 'bookings.html', 1000);
            } else {
                showToast(res.message || 'Booking Failed', 'error');
                newConfirmBtn.disabled = false;
                newConfirmBtn.innerHTML = 'Confirm & Pay';
            }
        } catch (err) {
            console.error(err);
            showToast('Network Error', 'error');
            newConfirmBtn.disabled = false;
            newConfirmBtn.innerHTML = 'Confirm & Pay';
        }
    });
}

window.closeModal = () => {
    document.getElementById('bookingModal').classList.remove('active');
}
