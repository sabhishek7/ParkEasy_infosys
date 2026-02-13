# 🚗 ParkEase - Smart Parking Spot Finder

**ParkEase** is a dynamic web application designed to simplify the parking experience. It allows users to find available parking spots, view details, and make bookings seamlessly. The system enables administrators to manage parking locations and view bookings.

## 🛠️ Tech Stack

-   **Frontend**: HTML5, CSS3, JavaScript (Vanilla), FontAwesome
-   **Backend**: Spring Boot 3.2.2 (Java 17)
-   **Database**: MySQL 8.0
-   **ORM**: Spring Data JPA / Hibernate
-   **Build Tool**: Maven

## 🚀 Features

-   **User Authentication**:
    -   Secure Login and Registration.
    -   Role-based access (User vs. Admin).
-   **Dynamic Dashboard**:
    -   Real-time fetching of user data.
    -   Interactive UI with responsive design.
-   **Parking Management**:
    -   Admin can add/remove parking locations.
    -   Users can search and view parking spot details.

## ⚙️ Setup & Installation

### 1. Prerequisites
-   Java JDK 17+
-   MySQL Server
-   Maven

### 2. Database Configuration
1.  Create a MySQL database named `parkeasy`:
    ```sql
    CREATE DATABASE parkeasy;
    ```
2.  Configure your credentials in `src/main/resources/application.properties`:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/parkeasy?createDatabaseIfNotExist=true&useSSL=false
    spring.datasource.username=YOUR_USERNAME
    spring.datasource.password=YOUR_PASSWORD
    ```

### 3. Run the Application
Navigate to the project root and run:
```bash
mvn spring-boot:run
```
The application will start on `http://localhost:8080`.

### 4. Access the App
-   **Login Page**: [http://localhost:8080/login.html](http://localhost:8080/login.html)
-   **Test Credentials** (after registration):
    -   Register a new user via the "Create Account" link.

## 📂 Project Structure

```
ParkEaseSystem/
├── src/
│   ├── main/
│   │   ├── java/com/parkease/
│   │   │   ├── controller/   # API Controllers (AuthController, etc.)
│   │   │   ├── model/        # JPA Entities (User, etc.)
│   │   │   ├── repository/   # Data Access Layer
│   │   │   ├── service/      # Business Logic
│   │   │   └── ParkEaseApplication.java
│   │   └── resources/
│   │       ├── static/       # Frontend Assets (HTML, CSS, JS)
│   │       └── application.properties
├── Documentation/            # Detailed setup guides
└── pom.xml                   # Maven dependencies
```

## 🤝 Contributing
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/Feature`).
3.  Commit your changes (`git commit -m 'Add some Feature'`).
4.  Push to the branch (`git push origin feature/Feature`).
5.  Open a Pull Request.
