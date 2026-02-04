# 31blume Website - User Guide

## Overview
Your new website is a **Static Web Application**. This means it runs entirely in the browser without needing a complex backend server for this initial version.

**Files Location**: `c:/Users/austinz/Desktop/Antigravity_Test/31Blume`

## How to Run
To view your website, simply **double-click** the `index.html` file in the folder. It will open in your default browser.

## Admin Access
To manage your availability and view bookings:
1. Open the website.
2. Navigate to `admin.html` (or type it in the address bar, e.g., `.../31Blume/admin.html`).
   - Note: A link is not in the main menu to keep it private.
3. Login with the password: **admin123**

### Admin Features
- **Bookings Tab**: View all incoming bookings sorted by date.
- **Settings Tab**:
  - **Working Hours**: Set your start and end times (e.g., 09:00 to 17:00).
  - **Block Dates**: Select a specific date (e.g., Holidays) to prevent anyone from booking it.

## Important Note on Data
Since this is a serverless prototype, all Booking Data and Settings are stored in your **Browser's Local Storage**.
- If you open the site in Chrome, book a session, and then open it in Edge, you will **NOT** see that booking in Edge.
- If you clear your browser history/cache, the data will be lost.
- **For Real World Use**: When you are ready to launch this to the public on the internet, you will need to connect it to a database service (like Firebase, Supabase, or Netlify Forms) to ensure specific client data is saved reliably across different devices.

## Editing Content
- **Text**: Open the `.html` files in any text editor (Notepad, VS Code) to change text like "Policies" or "Pricing".
- **Images**: The images are currently pulling from the URLs provided. To change them, replace the `src="..."` URLs in `index.html` or the CSS `background-image` URL in the `<style>` block.
