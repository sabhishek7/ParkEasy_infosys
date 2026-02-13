# ParkEase Project Documentation & Learning Guide

This document is divided into two parts:
1. **Current Static Flow**: How the application works right now (Admin ↔ User interaction).
2. **Backend Development Guide**: A step-by-step educational guide on how to make this dynamic using Spring Boot.

---

# Part 1: Current Application Flow (Static/Mock)

Currently, **ParkEase** is a "Static Web Application". This means it runs entirely in the browser without a real server or database. It uses **LocalStorage** (your browser's internal memory) to save data, simulating a database.

### 1. Admin Workflow
The Admin side is designed to manage the platform.

*   **Registration (`admin-login.html`)**:
    *   **Action**: You enter your email, password, and the **Secret Code** (`ADMIN2026`).
    *   **Logic**: The JavaScript checks if the code is correct. If yes, it creates a user object `{ role: 'admin', ... }` and saves it to LocalStorage.
*   **Dashboard (`admin.html`)**:
    *   **Security**: When the page loads, it checks LocalStorage. If the user's role is not `'admin'`, it kicks them out.
*   **Adding a Location (`admin-locations.html`)**:
    *   **Action**: You fill out the "Add Location" form (Name, Price, Image, etc.).
    *   **Logic**: The `mock-api.js` takes this data, adds a random ID, and saves it to a list in LocalStorage called `parkease_locations`.
    *   **Result**: The new parking spot is permanently "saved" in your browser.

### 2. User Workflow
The User side is for customers finding parking.

*   **Searching (`search.html` or `index.html`)**:
    *   **Action**: The user loads the page.
    *   **Logic**: The page asks `mock-api.js` for "all locations".
    *   **The Connection**: The API reads the *same* `parkease_locations` list from LocalStorage that the Admin just updated.
    *   **Result**: The user instantly sees the "Antigravity Spot" you added in the Admin panel.

### 3. Verification Flow
1.  **Admin** adds "Spot A".
2.  **Browser** saves "Spot A" to memory.
3.  **User** visits page.
4.  **Browser** reads "Spot A" from memory and displays it.

---

# Part 2: Making it Dynamic (Spring Boot Integration)

To make this a professional application, we move the "brain" and "memory" from the browser (LocalStorage) to a **Server** and **Database**.

### High-Level Concept: Client-Server Architecture

*   **Frontend (The Client)**: Your HTML/JS files. It simply *shows* data and captures user clicks. It knows *nothing* about business logic.
*   **Backend (The Server)**: Your Spring Boot Application. It contains the logic (Rules), Security, and talks to the Database.
*   **API (The Messenger)**: The designated language (JSON) and paths (Endpoints) they use to talk to each other.

---

## Step-by-Step Implementation Guide

### Step 1: The Database (Persistent Memory)
Instead of `LocalStorage`, we use a real database like **MySQL** or **PostgreSQL**.

1.  **Create a Schema**: You define tables.
    ```sql
    CREATE TABLE locations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255),
        address VARCHAR(255),
        price DOUBLE,
        slots INT
    );
    ```

### Step 2: The Backend (Spring Boot)
This is where you write the Java code.

**A. The Model (Entity)**
This Java class maps to your Database table.
```java
@Entity
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Double price;
    // ... getters and setters
}
```

**B. The Repository (Data Access)**
This magic interface lets you find/save data without writing SQL.
```java
public interface LocationRepository extends JpaRepository<Location, Long> {
}
```

**C. The Controller (The API Gatekeeper)**
This is the most important part for connecting to your frontend. It listens for URLs like `/api/locations`.

```java
@RestController
@RequestMapping("/api/locations")
@CrossOrigin("*") // Allow your frontend to access this
public class LocationController {

    @Autowired
    private LocationRepository repository;

    // 1. Frontend asks: "Give me all locations"
    @GetMapping
    public List<Location> getAllLocations() {
        return repository.findAll(); // Fetches from DB and returns JSON
    }

    // 2. Frontend says: "Save this new location"
    @PostMapping
    public Location addLocation(@RequestBody Location newLocation) {
        return repository.save(newLocation); // Saves to DB
    }
}
```

### Step 3: The Connection (Frontend Integation)
Now we change your JavaScript code to talk to Java instead of LocalStorage.

**Old Way (Mock API):**
```javascript
// Sync, fake, local
locations.push(newLocation);
```

**New Way (Fetch API):**
This is how we send a message across the internet to your server.

```javascript
/* 
   SCENARIO: Admin clicks "Save Location" 
*/

// 1. Prepare the Data
const locationData = {
    name: "Antigravity Spot",
    price: 15.0
};

// 2. Send the Request (The Call)
fetch('http://localhost:8080/api/locations', {
    method: 'POST',                 // Action: Create
    headers: {
        'Content-Type': 'application/json' // "I am sending JSON data"
    },
    body: JSON.stringify(locationData) // Convert JS Object -> JSON String
})
.then(response => {
    // 3. Handle Response (The Acknowledgment)
    if(response.ok) {
        alert("Saved to Server!"); 
    }
});
```

### Detailed Data Flow: "Adding a Location"

1.  **User Action**: You fill the form and click "Save".
2.  **Frontend (JS)**: packages the data into a **JSON** envelope.
3.  **Network**: The browser sends an **HTTP POST** request to `http://localhost:8080/api/locations`.
4.  **Backend (Controller)**: The `addLocation` method wakes up. It calculates the JSON envelope back into a Java `Location` object.
5.  **Backend (Repository)**: The repository tells the Database: "INSERT INTO locations...".
6.  **Database**: Saves the row. Assigns ID `501`.
7.  **Backend**: Sends a confirmation **200 OK** response back with the new ID.
8.  **Frontend**: Receives the "OK" and updates the screen.

### Summary Checklist for You
To complete this transition, follow these steps:

1.  [ ] **Set up Spring Boot**: Create a project with "Spring Web" and "Spring Data JPA" dependencies.
2.  [ ] **Connect Database**: Configure `application.properties` with your MySQL connection.
3.  [ ] **Create Files**: Copy the Java code structure above (Entity -> Repository -> Controller).
4.  [ ] **Run Server**: Start the Java application on Port 8080.
5.  [ ] **Update Frontend**: Open `admin-locations.html` and swap `import { API } from './js/mock-api.js'` with `./js/spring-boot-api.js`.

**Reference Files**:
*   `API_SPEC.md`: Your blueprint for the Java Controllers.
*   `js/spring-boot-api.js`: The JavaScript code already written for you to handle Step 3.
