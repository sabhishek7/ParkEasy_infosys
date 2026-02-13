# ParkEase - Smart Parking System

A premium, glassmorphism-styled parking management interface with simulated backend integration.

## 🚀 Features

### Unique Innovations
1.  **Spot Sniper AI**: Predicitive availability engine (see User Dashboard sidebar).
2.  **Dynamic Pricing Heatmap**: Visual cues for pricing based on demand.
3.  **Admin Grid Management**: Click-to-maintain functionality for admins.

### Architecture
- **Frontend**: HTML5, CSS3 (Variables, Flexbox/Grid), Vanilla JS (ES Modules).
- **Backend Simulation**: `js/mock-api.js` uses `localStorage` to persist data and `setTimeout` to simulate network latency, making it ready for Spring Boot integration later.

## 🛠️ How to Run

Since this project uses ES Modules (`import`/`export`), you cannot simply double-click the HTML files due to browser security policies (CORS).

### Option 1: VS Code Live Server (Recommended)
1.  Open the project in VS Code.
2.  Right-click `index.html`.
3.  Select "Open with Live Server".

### Option 2: Python Simple Server
Open a terminal in the `ParkEase` folder and run:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.

### Option 3: Node.js Serve
```bash
npx serve .
```

## 🔐 Demo Credentials

| Role  | Email              | Password |
|-------|--------------------|----------|
| User  | user@parkease.com  | password |
| Admin | admin@parkease.com | password |

## 📂 Project Structure
- `css/styles.css` - Global theme and component styles.
- `js/mock-api.js` - The "Backend" logic (Data Service).
- `js/app.js` - User Dashboard Logic.
- `js/admin-app.js` - Admin Dashboard Logic.
