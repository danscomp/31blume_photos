/**
 * 31blume Data Store
 * Handles persistence via localStorage
 */

const STORAGE_KEY = '31blume_data';

const DEFAULT_SETTINGS = {
  workingHours: { start: '09:00', end: '17:00' },
  blockedDates: [], // Strings 'YYYY-MM-DD'
  daysAvailable: [1, 2, 3, 4, 5], // Mon-Fri (0=Sun)
  slotDuration: 60, // minutes (base)
  bufferTime: 30 // minutes
};

const DEFAULT_DATA = {
  bookings: [], // Array of booking objects
  settings: DEFAULT_SETTINGS
};

const Store = {
  init() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      this.save(DEFAULT_DATA);
      console.log('Store initialized with defaults');
    }
  },

  getAll() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_DATA;
  },

  save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  // Bookings
  getBookings() {
    return this.getAll().bookings;
  },

  addBooking(booking) {
    const data = this.getAll();
    // Simple ID generation
    booking.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    booking.createdAt = new Date().toISOString();
    data.bookings.push(booking);
    this.save(data);
    return booking;
  },

  // Settings
  getSettings() {
    return this.getAll().settings;
  },

  updateSettings(newSettings) {
    const data = this.getAll();
    data.settings = { ...data.settings, ...newSettings };
    this.save(data);
  },

  reset() {
    localStorage.removeItem(STORAGE_KEY);
    this.init();
  }
};

// Auto-init on load
Store.init();

// Expose globally for simplicity in this stack
window.Store = Store;
