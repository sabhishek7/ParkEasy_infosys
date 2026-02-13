export function initAuth() {
    const user = JSON.parse(localStorage.getItem('parkease_user'));

    // Target both mobile and desktop containers
    const containers = [
        document.getElementById('authLinks'),
        document.getElementById('authLinksDesktop')
    ];

    containers.forEach(container => {
        if (!container) return;

        if (user) {
            container.innerHTML = `
                <div class="auth-user-container">
                    <div class="auth-user-info">
                        <span class="auth-user-welcome">Welcome back,</span>
                        <span class="auth-user-name">${user.name}</span>
                    </div>
                    <button class="btn btn-outline" onclick="logout()" style="padding: 0.5rem 1rem; font-size: 0.85rem;">Logout</button>
                </div>
            `;
        } else {
            container.innerHTML = `<a href="login.html" class="btn btn-primary">Login</a>`;
        }
    });

    // Mobile specific: If logged in, maybe show "My Bookings" more prominently?
    // Current nav already has "My Bookings" link.
}

export function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.style.position = 'fixed';
    toast.style.bottom = '2rem';
    toast.style.right = '2rem';
    toast.style.padding = '1rem 2rem';
    toast.style.background = type === 'success' ? '#10b981' : '#ef4444';
    toast.style.color = 'white';
    toast.style.borderRadius = '12px';
    toast.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
    toast.style.zIndex = '9999';
    toast.style.transform = 'translateY(100px)';
    toast.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

    toast.innerText = message;
    document.body.appendChild(toast);

    // Animate In
    requestAnimationFrame(() => {
        toast.style.transform = 'translateY(0)';
    });

    // Animate Out
    setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Global Logout
window.logout = () => {
    localStorage.removeItem('parkease_user');
    window.location.reload();
};

// Intersection Observer for Scroll Animations
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide-up');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card').forEach(el => observer.observe(el));
});
