# ParkEase API Documentation & Core Logic Map

This document outlines how each frontend page/tab connects to the backend APIs and which files contain the logic.

## 1. Authentication (Login / Register)
*   **Frontend Page**: `login.html`, `admin-login.html`
*   **Frontend Logic**: `src/main/resources/static/js/login-logic.js`
*   **Backend Controller**: `src/main/java/com/parkease/controller/AuthController.java`

| Feature | HTTP Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Login** | `POST` | `/api/auth/login` | Authenticates user/admin. Returns User object. |
| **Register** | `POST` | `/api/auth/register` | Registers new user. Accepts `adminCode` for admin creation. |

---

## 2. User Dashboard (Overview Tab)
*   **Frontend Page**: `user.html`
*   **Frontend Logic**: `src/main/resources/static/js/user-dashboard.js`
*   **Backend Controller**: `src/main/java/com/parkease/controller/UserController.java`

| Feature | HTTP Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Get Profile** | `GET` | `/api/user/{email}` | Fetches name, wallet balance, loyalty points. |
| **Active Bookings**| `GET` | `/api/user/{email:.+}/bookings` | Fetches counts for "Active Bookings" widget. |

---

## 3. "My Bookings" Tab
*   **Frontend Page**: `bookings.html`
*   **Frontend Logic**: `src/main/resources/static/js/bookings-logic.js`
*   **Backend Controller**: `src/main/java/com/parkease/controller/BookingController.java` & `UserController.java`

| Feature | HTTP Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **List Bookings** | `GET` | `/api/user/{email:.+}/bookings` | Fetches full list of user's booking history. |
| **Create Booking**| `POST` | `/api/bookings/create` | (Planned) Creates a new reservation. |
| **Cancel Booking**| `POST` | `/api/bookings/cancel/{id}` | Cancels an active booking by ID. |

---

## 4. "Find Parking" (Search) Tab
*   **Frontend Page**: `search.html`
*   **Frontend Logic**: Currently `mock-api.js` *(Needs migration to real API)*.
*   **Backend Controller**: (Planned) `LocationController.java`

| Feature | HTTP Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Search Locations**| `GET` | `/api/locations/search?query={term}` | (Planned) Search spots by name/address. |
| **Get All Spots** | `GET` | `/api/locations` | (Planned) Get all available parking spots. |

---

## 5. Admin Dashboard
*   **Frontend Page**: `admin.html`
*   **Frontend Logic**: Currently `admin-app.js` (Mock Data).
*   **Backend Controller**: (Needs Implementation)

---

## 🛠️ Data Models (Backend Entities)
*   **User**: `src/main/java/com/parkease/model/User.java` (Stores ID, email, password, role, wallet, points).
*   **Booking**: `src/main/java/com/parkease/model/Booking.java` (Stores User link, location name, time, duration, price, status).

## 📂 Key JavaScript Files
*   **`api-service.js`**: Centralized file for all `fetch` calls. located at `src/main/resources/static/js/api-service.js`.
