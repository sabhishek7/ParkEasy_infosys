# ParkEase API Specification (Spring Boot Integration)

This document outlines the API endpoints and data models required for the ParkEase backend using Spring Boot. Use this spec to build your `RestController` classes.

## Base URL
`http://localhost:8080/api`

---

## 1. Authentication (`/auth`)
**Controller:** `AuthController.java`

### POST /auth/login
Authenticate user and return JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "user",
    "role": "USER", // or ADMIN
    "token": "jwt_token_here"
  }
}
```

### POST /auth/register
Register a new user.

**Request:**
```json
{
  "email": "new@example.com",
  "password": "securePass123",
  "secretCode": "" // Optional, only for Admins
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully"
}
```

---

## 2. Locations (`/locations`)
**Controller:** `LocationController.java`

### GET /locations
Get all parking locations.

**Response:**
```json
[
  {
    "id": "loc_001",
    "name": "Central Plaza Garage",
    "address": "123 Main St",
    "price": 5.0,
    "slots": 12,
    "image": "url",
    "features": ["Covered", "CCTV"]
  }
]
```

### GET /locations/{id}
Get details of a specific location.

---

## 3. Bookings (`/bookings`)
**Controller:** `BookingController.java`

### POST /bookings
Create a new booking.

**Request:**
```json
{
  "userId": "1",
  "locId": "loc_001",
  "date": "2026-05-20",
  "time": "14:00",
  "duration": 2,
  "price": 10.0
}
```

**Response:**
```json
{
  "success": true,
  "booking": {
    "id": "BK-123456",
    "status": "UPCOMING"
  }
}
```

### GET /bookings/user/{userId}
Get all bookings for a user.

### PUT /bookings/{id}/cancel
Cancel a booking.

---

## 4. Admin Dashboard (`/admin`)
**Controller:** `AdminController.java`

### GET /admin/stats
Get dashboard statistics.

**Response:**
```json
{
  "revenue": 1240.0,
  "occupancy": 76,
  "activeSessions": 42,
  "issues": 3
}
```

### GET /admin/slots
Get status of all parking slots.

### POST /admin/slots/{id}/toggle
Toggle maintenance status of a slot.

---

## Database Models (JPA Entities)
- `User` (id, email, password, role)
- `Location` (id, name, address, price, totalSlots)
- `Booking` (id, user_id, location_id, time, status)
