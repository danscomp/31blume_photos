/**
 * 31blume Admin Dashboard Logic
 */

// Default Config (Should match booking.js defaults initially)
const DEFAULT_AVAILABILITY = {
    workingDays: [1, 2, 3, 4, 5],
    hoursStart: 9,
    hoursEnd: 17,
    blockedDates: []
};

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadDashboard();
    setupSettingsForm();

    // Tab Logic
    window.showTab = function (tabName) {
        document.getElementById('view-bookings').classList.add('hidden');
        document.getElementById('view-settings').classList.add('hidden');
        document.getElementById('tab-bookings').classList.remove('btn', 'btn-outline'); // Reset
        document.getElementById('tab-settings').classList.remove('btn', 'btn-outline'); // Reset

        if (tabName === 'bookings') {
            document.getElementById('view-bookings').classList.remove('hidden');
            document.getElementById('tab-bookings').classList.add('btn');
            document.getElementById('tab-settings').classList.add('btn-outline');
        } else {
            document.getElementById('view-settings').classList.remove('hidden');
            document.getElementById('tab-settings').classList.add('btn');
            document.getElementById('tab-bookings').classList.add('btn-outline');
        }
    };
});

function checkAuth() {
    const isAuth = sessionStorage.getItem('31blume_auth');
    const overlay = document.getElementById('login-overlay');

    if (isAuth === 'true') {
        overlay.style.display = 'none';
    } else {
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const pass = document.getElementById('admin-password').value;
            if (pass === 'ryan') { // Simple password for MVP
                sessionStorage.setItem('31blume_auth', 'true');
                overlay.style.display = 'none';
            } else {
                alert('Incorrect password');
            }
        });
    }

    document.getElementById('logout-btn').addEventListener('click', () => {
        sessionStorage.removeItem('31blume_auth');
        window.location.reload();
    });
}

function loadDashboard() {
    const bookings = JSON.parse(localStorage.getItem('31blume_bookings') || '[]');

    // Stats
    document.getElementById('total-bookings').textContent = bookings.length;
    const revenue = bookings.reduce((sum, b) => {
        const price = parseInt(b.price.replace('$', '').replace(',', ''));
        return sum + price;
    }, 0);
    document.getElementById('total-revenue').textContent = '$' + revenue.toLocaleString();

    // List
    const list = document.getElementById('booking-list');
    if (bookings.length > 0) {
        list.innerHTML = bookings.sort((a, b) => new Date(a.date) - new Date(b.date)).map(b => `
            <div class="booking-item">
                <div>
                    <strong>${new Date(b.date).toLocaleDateString()} @ ${b.time}</strong>
                    <div style="font-size: 0.9rem; margin-top: 4px;">${b.clientName} (${b.sessionName})</div>
                    <div style="font-size: 0.8rem; color: #666;">${b.clientEmail} • ${b.clientPhone}</div>
                </div>
                <div class="text-right">
                    <span class="badge badge-confirmed">Confirmed</span>
                    <div style="margin-top: 8px; font-weight: 600;">${b.price}</div>
                </div>
            </div>
        `).join('');
    }
}

function setupSettingsForm() {
    const avail = JSON.parse(localStorage.getItem('31blume_availability')) || DEFAULT_AVAILABILITY;

    // Populate Form
    document.querySelectorAll('input[name="day"]').forEach(cb => {
        if (avail.workingDays.includes(parseInt(cb.value))) cb.checked = true;
    });
    document.getElementById('hours-start').value = avail.hoursStart;
    document.getElementById('hours-end').value = avail.hoursEnd;
    document.getElementById('blocked-dates').value = avail.blockedDates.join(', ');

    // Handle Save
    document.getElementById('settings-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const selectedDays = Array.from(document.querySelectorAll('input[name="day"]:checked')).map(cb => parseInt(cb.value));
        const datesRaw = document.getElementById('blocked-dates').value;
        const blockedDates = datesRaw ? datesRaw.split(',').map(s => s.trim()) : [];

        const newAvail = {
            workingDays: selectedDays,
            hoursStart: parseInt(document.getElementById('hours-start').value),
            hoursEnd: parseInt(document.getElementById('hours-end').value),
            blockedDates: blockedDates
        };

        localStorage.setItem('31blume_availability', JSON.stringify(newAvail));

        // Success Feedback
        const msg = document.getElementById('save-msg');
        msg.style.opacity = '1';
        setTimeout(() => msg.style.opacity = '0', 2000);
    });
}
