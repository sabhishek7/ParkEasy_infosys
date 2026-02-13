# Spring Boot Authentication Guide for ParkEase

This guide focuses specifically on how to build the **Login & Registration** system in your Spring Boot backend.

---

## 🏗️ The Architecture (How it works)

1.  **Frontend (HTML/JS)** sends a JSON packet with `email` and `password`.
2.  **Backend (Controller)** receives it.
3.  **Service Layer** checks the Database:
    *   Does this email exist?
    *   Does the password match?
4.  **Backend** responds:
    *   **Success**: Returns a "Token" (like a digital ID card) and user info.
    *   **Failure**: Returns "401 Unauthorized".

---

## 🚀 Step-by-Step Implementation

### Step 1: user Model (`User.java`)
This represents a user in your database.

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;

    private String password; // In real apps, this should be Hashed (encrypted)

    private String role; // "USER" or "ADMIN"

    // Constructors, Getters, Setters...
}
```

### Step 2: Repository (`UserRepository.java`)
This allows us to talk to the "users" table.

```java
public interface UserRepository extends JpaRepository<User, Long> {
    // Custom method to find a user by their email
    Optional<User> findByEmail(String email);
    
    // Check if email exists
    Boolean existsByEmail(String email);
}
```

### Step 3: Auth Controller (`AuthController.java`)
This is the API that your frontend calls.

```java
@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*") // Allow frontend to call this
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // --- 1. LOGIN API ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        
        // A. Find User
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // B. Check Password (Simple string comparison for learning)
            if (user.getPassword().equals(loginRequest.getPassword())) {
                
                // C. Success! Return User Data + Fake Token
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("token", "dummy-jwt-token-" + user.getId()); 
                response.put("user", user);
                
                return ResponseEntity.ok(response);
            }
        }
        
        // D. Failure
        return ResponseEntity.status(401).body(Map.of("success", false, "message", "Invalid Credentials"));
    }

    // --- 2. REGISTER API ---
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        
        // A. Check if user exists
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().body("Email already taken!");
        }

        // B. Determine Role (Admin Secret Code Logic)
        String role = "USER";
        if ("ADMIN2026".equals(req.getSecretCode())) {
            role = "ADMIN";
        }

        // C. Create User
        User newUser = new User();
        newUser.setEmail(req.getEmail());
        newUser.setPassword(req.getPassword());
        newUser.setRole(role);

        userRepository.save(newUser);

        return ResponseEntity.ok(Map.of("success", true, "message", "User registered successfully!"));
    }
}
```

### Step 4: Data Transfer Objects (DTOs)
These are simple classes to hold the data coming from the frontend.

**LoginRequest.java**
```java
public class LoginRequest {
    private String email;
    private String password;
    // getters setters
}
```

**RegisterRequest.java**
```java
public class RegisterRequest {
    private String email;
    private String password;
    private String secretCode; // The optional Admin Code
    // getters setters
}
```

---

## 🔗 Connecting the Frontend

In your `login.html` or `admin-login.html`, the JavaScript (which I have already prepared in `spring-boot-api.js`) sends data to these endpoints:

```javascript
// Example of what authentication.js does under the hood:
fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: "admin@test.com", password: "123" })
})
.then(res => res.json())
.then(data => {
    if (data.success) {
        // Save the "Token" and User Info
        localStorage.setItem('parkease_user', JSON.stringify(data.user));
        
        // Redirect based on Role
        if (data.user.role === "ADMIN") {
            window.location.href = "admin.html";
        } else {
            window.location.href = "index.html";
        }
    }
});
```

### Security Note (For Production)
The above code uses **plain text passwords** for simplicity so you can learn the flow.
*   In a real job, you **MUST** use `BCryptPasswordEncoder` to hash passwords before saving them.
*   You **MUST** use a real library (like `jjwt`) to generate secure tokens, not just "dummy-token".
