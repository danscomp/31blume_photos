/**
 * 31blume Booking Logic
 * Handles session selection, calendar rendering, time slots, and form submission.
 */

// State
const state = {
    step: 1,
    sessionType: null, // 'mini' | 'full'
    selectedDate: null,
    selectedTime: null,
    currentMonth: new Date(),
    availability: {}, // Will load from localStorage
    bookings: [] // Will load from localStorage
};

// Config
const SESSION_CONFIG = {
    mini: { name: 'Mini Session', price: '$175', duration: 30 },
    full: { name: 'Full Session', price: '$250', duration: 60 }
};

// Mock Availability (Default if empty)
const DEFAULT_AVAILABILITY = {
    workingDays: [1, 2, 3, 4, 5], // Mon-Fri
    hoursStart: 9, // 9 AM
    hoursEnd: 17, // 5 PM
    blockedDates: []
};

// Init
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderCalendar();

    // Check URL params for session type pre-selection
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    if (type && SESSION_CONFIG[type]) {
        selectSession(type);
    }
});

function loadData() {
    const storedAvail = localStorage.getItem('31blume_availability');
    const storedBookings = localStorage.getItem('31blume_bookings');

    state.availability = storedAvail ? JSON.parse(storedAvail) : DEFAULT_AVAILABILITY;
    state.bookings = storedBookings ? JSON.parse(storedBookings) : [];
}

// Navigation
function goToStep(step) {
    // Validation
    if (step === 2 && !state.sessionType) return alert('Please select a session type.');
    if (step === 3 && (!state.selectedDate || !state.selectedTime)) return alert('Please select a date and time.');

    // Hide all steps
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));

    // Show target step
    document.getElementById(`step-${step}`).classList.add('active');
    state.step = step;

    // Refresh views if needed
    if (step === 2) renderCalendar();
    if (step === 3) updateSummary();

    // Scroll top
    window.scrollTo(0, 0);
}

function selectSession(type) {
    state.sessionType = type;
    goToStep(2);
}

// Calendar
function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    const monthLabel = document.getElementById('current-month');
    grid.innerHTML = '';

    const year = state.currentMonth.getFullYear();
    const month = state.currentMonth.getMonth();

    // Update Header
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthLabel.textContent = `${monthNames[month]} ${year}`;

    // Headers (Sun-Sat)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(d => {
        const el = document.createElement('div');
        el.className = 'calendar-day-header';
        el.textContent = d;
        grid.appendChild(el);
    });

    // Days logic
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Empty slots before first day
    for (let i = 0; i < firstDay; i++) {
        grid.appendChild(document.createElement('div')); // Placeholder
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        const dayOfWeek = date.getDay();
        const dateStr = date.toISOString().split('T')[0];

        const el = document.createElement('div');
        el.className = 'calendar-day';
        el.textContent = d;

        // Availability Check
        let isAvailable = true;

        // 1. Past date
        if (date < today) isAvailable = false;

        // 2. Working days (Admin config)
        if (!state.availability.workingDays.includes(dayOfWeek)) isAvailable = false;

        // 3. Blocked specific dates
        if (state.availability.blockedDates.includes(dateStr)) isAvailable = false;

        // Render state
        if (!isAvailable) {
            el.classList.add('disabled');
        } else {
            el.onclick = () => selectDate(dateStr, el);
            if (state.selectedDate === dateStr) el.classList.add('selected');
        }

        if (date.getTime() === today.getTime()) el.classList.add('today');

        grid.appendChild(el);
    }
}

// Month Nav
document.getElementById('prev-month').addEventListener('click', () => {
    state.currentMonth.setMonth(state.currentMonth.getMonth() - 1);
    renderCalendar();
});
document.getElementById('next-month').addEventListener('click', () => {
    state.currentMonth.setMonth(state.currentMonth.getMonth() + 1);
    renderCalendar();
});

function selectDate(dateStr, el) {
    // UI Update
    document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
    el.classList.add('selected');

    state.selectedDate = dateStr;
    state.selectedTime = null; // Reset time when date changes
    renderTimeSlots(dateStr);
}

function renderTimeSlots(dateStr) {
    const container = document.getElementById('time-slots-container');
    container.innerHTML = '';

    const startHour = state.availability.hoursStart; // e.g. 9
    const endHour = state.availability.hoursEnd; // e.g. 17

    // Generate slots
    for (let h = startHour; h < endHour; h++) {
        // Simple hourly slots for MVP
        const timeLabel = formatTime(h); // "9:00 AM"
        const slotId = `${dateStr}T${h}:00`;

        const el = document.createElement('div');
        el.className = 'time-slot';
        el.textContent = timeLabel;

        // Check existing bookings
        const isBooked = state.bookings.some(b => b.date === dateStr && b.time === timeLabel);

        if (isBooked) {
            el.style.opacity = '0.3';
            el.style.textDecoration = 'line-through';
            el.style.pointerEvents = 'none';
        } else {
            el.onclick = () => {
                document.querySelectorAll('.time-slot').forEach(t => t.classList.remove('selected'));
                el.classList.add('selected');
                state.selectedTime = timeLabel;

                // Auto advance optional? Let's just create a "Next" button effect or rely on user scroll
                // For now, user clicks "Next" at bottom of step 2 (not implementing dynamic next btn visibility yet, kept it simple in HTML)
                // Actually, I missed a NEXT button on Step 2 in HTML. Let me add auto-advance or a button via JS?
                // Let's add a "Continue" button dynamically or just let them scroll down.
                // Re-reading HTML Step 2.. it ends after time slots grid.
                // Let's inject a Continue button if valid.
                checkStep2Valid();
            };
        }

        container.appendChild(el);
    }
}

function checkStep2Valid() {
    if (state.selectedDate && state.selectedTime) {
        let btn = document.getElementById('step-2-next');
        if (!btn) {
            btn = document.createElement('button');
            btn.id = 'step-2-next';
            btn.className = 'btn btn-block';
            btn.style.marginTop = '2rem';
            btn.textContent = 'Continue to Details';
            btn.onclick = () => goToStep(3);
            document.getElementById('step-2').appendChild(btn);
        }
        // Ensure visibility
        btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function formatTime(hour) {
    return hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
}

// Summary Step
function updateSummary() {
    const config = SESSION_CONFIG[state.sessionType];
    document.getElementById('summary-type').textContent = config.name;
    document.getElementById('summary-price').textContent = config.price;
    document.getElementById('summary-date').textContent = new Date(state.selectedDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('summary-time').textContent = state.selectedTime;
}

// Submission
function handleBookingSubmit(e) {
    e.preventDefault();

    const clientName = document.getElementById('client-name').value;
    const clientEmail = document.getElementById('client-email').value;

    // Create Booking Object
    const newBooking = {
        id: Date.now().toString(), // Simple ID
        created: new Date().toISOString(),
        clientName,
        clientEmail,
        clientPhone: document.getElementById('client-phone').value,
        notes: document.getElementById('client-notes').value,
        sessionType: state.sessionType,
        sessionName: SESSION_CONFIG[state.sessionType].name,
        price: SESSION_CONFIG[state.sessionType].price,
        date: state.selectedDate,
        time: state.selectedTime,
        status: 'confirmed'
    };

    // Save
    state.bookings.push(newBooking);
    localStorage.setItem('31blume_bookings', JSON.stringify(state.bookings));

    // Show Success
    document.getElementById('success-name').textContent = clientName;
    document.getElementById('success-email').textContent = clientEmail;
    goToStep(4);
}
