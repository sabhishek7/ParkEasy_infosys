import { API } from './mock-api.js';

const grid = document.getElementById('adminParkingGrid');
// Mock selectors aligned with admin.html structure
const revenueEl = document.querySelector('.fa-dollar-sign').parentElement.previousElementSibling.querySelector('p');
const occupancyEl = document.querySelector('.fa-car').parentElement.previousElementSibling.querySelector('p');
const activeEl = document.querySelector('.fa-clock').parentElement.previousElementSibling.querySelector('p');
const issuesEl = document.querySelector('.fa-exclamation-triangle').parentElement.previousElementSibling.querySelector('p');

const activityLog = document.querySelector('ul'); // Select the first UL (Recent Activity)

document.addEventListener('DOMContentLoaded', async () => {
    // Auth Check
    const user = JSON.parse(localStorage.getItem('parkease_user'));
    if (!user || user.role !== 'admin') {
        // In a real app, redirect. For demo, we might allow viewing or show warning.
        console.warn("Unauthorized access attempting to view admin panel");
    }

    // Initial Load
    await loadAdminData();

    // Auto-refresh stats every 30s
    // setInterval(loadStats, 30000); 
});

async function loadAdminData() {
    try {
        const stats = await API.getStats();
        if (revenueEl) revenueEl.innerText = `$${stats.revenue}`;
        if (occupancyEl) occupancyEl.innerText = `${stats.occupancy}%`;
        if (activeEl) activeEl.innerText = stats.activeSessions;
        if (issuesEl) issuesEl.innerText = stats.issues;

        const slots = await API.getAdminSlots();
        renderGrid(slots);
    } catch (e) {
        console.error("Failed to load admin data", e);
    }
}

function renderGrid(slots) {
    if (!grid) return;
    grid.innerHTML = '';

    slots.forEach(slot => {
        const div = document.createElement('div');
        div.className = 'slot-item';
        div.style.width = '40px';
        div.style.height = '40px';
        div.style.borderRadius = '8px';
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'center';
        div.style.fontSize = '0.75rem';
        div.style.fontWeight = 'bold';
        div.style.cursor = 'pointer';
        div.style.transition = 'all 0.2s';
        div.style.border = '1px solid transparent';

        // Status Colors
        // FREE: Green, OCCUPIED: Red, RESERVED: Orange, MAINTENANCE: Gray
        if (slot.status === 'FREE') {
            div.style.background = '#dcfce7';
            div.style.color = '#166534';
            div.style.borderColor = '#bbf7d0';
        } else if (slot.status === 'OCCUPIED') {
            div.style.background = '#fee2e2';
            div.style.color = '#991b1b';
            div.style.borderColor = '#fecaca';
        } else if (slot.status === 'RESERVED') {
            div.style.background = '#fef3c7';
            div.style.color = '#92400e';
            div.style.borderColor = '#fde68a';
        } else {
            div.style.background = '#f1f5f9';
            div.style.color = '#64748b';
            div.style.borderColor = '#e2e8f0';
        }

        div.innerText = slot.id.split('-')[1]; // Just number
        div.title = `Slot ${slot.id}: ${slot.status}`;

        div.onclick = () => handleSlotClick(slot, div);
        grid.appendChild(div);
    });
}

async function handleSlotClick(slot, element) {
    if (slot.status === 'OCCUPIED') {
        alert(`Slot ${slot.id} is currently occupied by a vehicle.`);
        return;
    }

    if (confirm(`Toggle maintenance status for Slot ${slot.id}?`)) {
        // Optimistic UI update
        const originalStatus = slot.status;
        const newStatus = originalStatus === 'MAINTENANCE' ? 'FREE' : 'MAINTENANCE';

        // Visual update immediately
        slot.status = newStatus;
        updateSlotVisual(element, newStatus);
        logActivity(`Admin changed Slot ${slot.id} to ${newStatus}`);

        // API Call
        await API.toggleSlotStatus(slot.id, originalStatus);
    }
}

function updateSlotVisual(div, status) {
    if (status === 'FREE') {
        div.style.background = '#dcfce7';
        div.style.color = '#166534';
        div.style.borderColor = '#bbf7d0';
    } else {
        div.style.background = '#f1f5f9';
        div.style.color = '#64748b';
        div.style.borderColor = '#e2e8f0';
    }
}

function logActivity(msg) {
    if (!activityLog) return;

    const li = document.createElement('li');
    li.style.padding = '0.75rem 0';
    li.style.borderBottom = '1px solid var(--border-color)';
    li.style.display = 'flex';
    li.style.gap = '1rem';
    li.style.alignItems = 'flex-start';

    li.innerHTML = `
        <div style="width: 8px; height: 8px; background: var(--secondary); border-radius: 50%; margin-top: 6px;"></div>
        <div>
            <p style="font-size: 0.9rem; font-weight: 600;">System Update</p>
            <p style="font-size: 0.8rem; color: var(--text-muted);">${msg} • Just now</p>
        </div>
    `;

    // Insert after the first item (header if any, or just prepend)
    if (activityLog.firstChild) {
        activityLog.insertBefore(li, activityLog.firstChild);
    } else {
        activityLog.appendChild(li);
    }
}
