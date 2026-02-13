import { ApiService } from './api-service.js';
import { showToast } from './app.js';

// Redirect if already logged in
if (localStorage.getItem('parkease_user')) {
    window.location.href = 'index.html';
}

const form = document.getElementById('authForm');
const title = document.getElementById('title');
const submitBtn = document.getElementById('submitBtn');
const toggleLink = document.getElementById('toggleLink');
const toggleText = document.getElementById('toggleText');

// Admin toggle elements
const adminSection = document.getElementById('adminSection');
const isAdminCheckbox = document.getElementById('isAdmin');
const adminCodeGroup = document.getElementById('adminCodeGroup');
const adminCodeInput = document.getElementById('adminCode');

let isLogin = true;

// Toggle Login/Register
toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    title.innerText = isLogin ? 'Welcome Back' : 'Create Account';
    submitBtn.innerHTML = isLogin ? 'Sign In <i class="fas fa-arrow-right" style="margin-left: 0.5rem;"></i>' : 'Create Account <i class="fas fa-user-plus" style="margin-left: 0.5rem;"></i>';
    toggleText.innerText = isLogin ? "Don't have an account?" : "Already have an account?";
    toggleLink.innerText = isLogin ? 'Create Account' : 'Sign In';

    // Show/Hide Admin Section
    if (adminSection) adminSection.style.display = isLogin ? 'none' : 'block';

    // Animation reset
    form.style.animation = 'none';
    form.offsetHeight; /* trigger reflow */
    form.style.animation = 'fadeIn 0.5s ease';
});

// Toggle Admin Code Input (if exists)
if (isAdminCheckbox) {
    isAdminCheckbox.addEventListener('change', (e) => {
        adminCodeGroup.style.display = e.target.checked ? 'block' : 'none';
    });
}


form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;

    // Get admin code if applicable
    let adminCode = null;
    if (!isLogin && isAdminCheckbox && isAdminCheckbox.checked) {
        adminCode = adminCodeInput.value;
    }

    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing...';

    try {
        let res;
        if (isLogin) {
            res = await ApiService.login(email, pass);
        } else {
            res = await ApiService.register(email, pass, adminCode);
        }

        if (res.success) {
            showToast(res.message || (isLogin ? "Welcome back!" : "Account created successfully!"), "success");

            if (res.user) {
                localStorage.setItem('parkease_user', JSON.stringify(res.user));
            }

            setTimeout(() => {
                if (res.user.role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'index.html';
                }
            }, 1000);
        } else {
            showToast(res.message || "Invalid credentials", "error");
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
        }

    } catch (err) {
        console.error(err);
        showToast("An error occurred. Is the backend running?", "error");
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
    }
});
