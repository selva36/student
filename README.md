# Student Management System (SMS)
### College Mini Project &bull; Java Programming
**Technologies:** Core Java | Java Servlets | JDBC | MySQL | HTML5 | CSS3 | JavaScript

---

## 1. Project Abstract
The **Student Management System** is a full-featured web-based academic administration platform developed as a mini project for the subject **Java Programming**. The system provides educational institutions and administrative staff with a centralized, automated platform to record, manage, update, and analyze student records. Built following the **Model-View-Controller (MVC)** architectural design pattern, the application integrates **Java Servlets** to process HTTP requests, **JDBC (Java Database Connectivity)** using `PreparedStatement` to ensure SQL-injection safe persistence, and a **MySQL** relational database for reliable storage. The presentation tier features a responsive **Blue and White** interface styled with modern CSS3, asynchronous JavaScript Fetch API for real-time interactions, client-side input validation, dynamic metric cards, and modal dialogs for update and delete confirmations.

---

## 2. Key Features
- **Admin Authentication:** Secure session-based login for administrators with logout and session expiration.
- **Interactive Dashboard:** Live KPI cards displaying **Total Students**, **Active Students**, **Department Count**, and **Graduated Students**, alongside an enrollment distribution breakdown and a **Recently Added Students** table.
- **Add Student Record:** Comprehensive registration form capturing Student ID, Name, Register Number, Date of Birth, Gender, Department, Academic Year, Email, Phone Number, and Address with multi-layer validation.
- **View All Students:** Tabular view of all enrolled students with dynamic avatar initials, department badges, year indicators, and direct action triggers.
- **Search & Multi-Filter:** Real-time search by Student ID, Name, or Register Number, combinable with Department, Year, and Status filter dropdowns.
- **Update Student Record:** In-place modal dialog pre-populated with student information for fast editing without leaving the page.
- **Delete Student Record:** Confirmation modal warning the administrator before executing a permanent SQL `DELETE` operation.
- **Dual Runtime Support:** Can be deployed to Apache Tomcat (connecting directly to MySQL via Java Servlets) or previewed immediately in any browser with smart local data persistence.

---

## 3. Java Programming Concepts Demonstrated

| Java OOP Concept | Implementation in Project | File Reference |
| :--- | :--- | :--- |
| **Classes & Objects** | Real-world entities modeled as Java classes (`Person`, `Student`, `Admin`). | `com.sms.model.Student` |
| **Inheritance** | `Student` and `Admin` extend the abstract base class `Person`, inheriting common properties (`name`, `email`, `phone`, `address`). | `com.sms.model.Person`<br>`com.sms.model.Student` |
| **Encapsulation** | All entity fields are `private`, accessed strictly through public getters and setters with validation logic. | `com.sms.model.Student` |
| **Polymorphism** | Abstract method `getRole()` in `Person` overridden in `Student` ("Student") and `Admin` ("Administrator"); `toString()` overridden; `StudentDAO` interface implementation. | `Person.java`<br>`StudentDAOImpl.java` |
| **Abstraction** | Data access layer separated through the `StudentDAO` interface, hiding JDBC details from Servlets. | `com.sms.dao.StudentDAO` |
| **Constructors** | Default, overloaded, and `super()` parameterized constructors for flexible object creation. | `Student.java` |
| **Exception Handling** | Custom exceptions (`StudentNotFoundException`, `DatabaseException`), try-with-resources for auto-closing JDBC resources. | `com.sms.exception.*` |
| **Collections Framework** | `List<Student>`, `ArrayList<Student>`, and `Map<String, Object>` for multi-record retrieval and analytics. | `StudentDAOImpl.java` |
| **JDBC Connectivity** | `DBConnection` singleton, `DriverManager`, `Connection`, `PreparedStatement`, `ResultSet`, transaction management. | `DBConnection.java` |

---

## 4. Project Directory Structure
```
student-management/
│── pom.xml                                   # Maven Build Configuration
│── README.md                                 # Complete Documentation & College Project Report
│── index.html                                # Welcome / Portal Landing Page
│── login.html                                # Admin Authentication Page
│── dashboard.html                            # Admin Dashboard & Statistics Overview
│── add-student.html                          # Student Registration Form
│── students.html                             # Student Records Table & Search/Filter/Actions
│── css/
│   └── style.css                             # Professional Blue & White Responsive Stylesheet
│── js/
│   └── script.js                             # Frontend Validation, Fetch Controller & Dynamic Rendering
│── database/
│   └── student_management.sql                # Complete MySQL Schema & Sample Records
└── src/
    └── main/
        ├── java/
        │   └── com/
        │       └── sms/
        │           ├── model/
        │           │   ├── Person.java       # Abstract Base Class (Inheritance)
        │           │   ├── Student.java      # Student Entity (Encapsulation, Extends Person)
        │           │   └── Admin.java        # Administrator Entity (Extends Person)
        │           ├── dao/
        │           │   ├── DBConnection.java # Singleton JDBC Connection Manager
        │           │   ├── StudentDAO.java   # DAO Interface (Abstraction)
        │           │   ├── StudentDAOImpl.java # PreparedStatement JDBC CRUD Implementation
        │           │   └── AdminDAO.java     # Admin Authentication DAO
        │           ├── controller/
        │           │   ├── StudentServlet.java # Controller for Student CRUD & Search
        │           │   ├── DashboardServlet.java # Controller for Metrics & Analytics
        │           │   ├── LoginServlet.java # Controller for Admin Authentication
        │           │   └── LogoutServlet.java # Controller for Session Invalidation
        │           ├── exception/
        │           │   ├── StudentNotFoundException.java # Custom Exception
        │           │   └── DatabaseException.java        # Custom Exception
        │           └── util/
        │               ├── ValidationUtil.java # Input Validation Routines
        │               └── JsonUtil.java       # Dependency-Free JSON Serializer
        └── webapp/
            ├── WEB-INF/
            │   └── web.xml                   # Servlet Deployment Descriptor
            ├── css/
            │   └── style.css
            ├── js/
            │   └── script.js
            ├── index.html
            ├── login.html
            ├── dashboard.html
            ├── add-student.html
            └── students.html
```

---

## 5. Database Schema & Setup

### MySQL Database: `student_management`

#### Table: `admins`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT | AUTO_INCREMENT, PRIMARY KEY | Unique admin identifier |
| `username` | VARCHAR(50) | NOT NULL, UNIQUE | Login username |
| `password` | VARCHAR(255) | NOT NULL | Login password |
| `full_name` | VARCHAR(100) | NOT NULL | Administrator's display name |
| `email` | VARCHAR(100) | NOT NULL, UNIQUE | Administrator email |
| `role` | VARCHAR(30) | DEFAULT 'Administrator' | System privilege level |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

#### Table: `students`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT | AUTO_INCREMENT, PRIMARY KEY | Internal record identifier |
| `student_id` | VARCHAR(20) | NOT NULL, UNIQUE | Institutional ID (e.g., STU-1001) |
| `name` | VARCHAR(100) | NOT NULL | Student's full name |
| `register_no` | VARCHAR(30) | NOT NULL, UNIQUE | University register number |
| `dob` | DATE | NOT NULL | Date of birth |
| `gender` | ENUM | 'Male', 'Female', 'Other' | Gender identification |
| `department` | VARCHAR(50) | NOT NULL | Academic branch |
| `year` | ENUM | '1st Year', '2nd Year', '3rd Year', '4th Year' | Academic progression |
| `email` | VARCHAR(100) | NOT NULL, UNIQUE | Student email address |
| `phone` | VARCHAR(20) | NOT NULL | Contact telephone |
| `address` | TEXT | NOT NULL | Residential address |
| `status` | ENUM | 'Active', 'Inactive', 'Graduated' | Academic status |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Admission timestamp |
| `updated_at` | TIMESTAMP | AUTO UPDATE | Last modification timestamp |

---

## 6. How to Set Up and Run the Project

### Prerequisites
1. **Java Development Kit (JDK 11 or higher / OpenJDK 17)**
2. **Apache Tomcat (Version 9.0.x or 10.1.x)**
3. **MySQL Server (Version 8.0 or higher / XAMPP / WampServer)**
4. **IDE:** Eclipse IDE for Enterprise Java (or IntelliJ IDEA / NetBeans / VS Code)

---

### Step 1: Database Setup
1. Start your MySQL Server (via MySQL Workbench, Command Line, or XAMPP Control Panel).
2. Open terminal or MySQL Command Line Client:
   ```bash
   mysql -u root -p
   ```
3. Execute the SQL database script:
   ```sql
   source /path/to/student-management/database/student_management.sql;
   ```
   *Or copy and paste the contents of `database/student_management.sql` into MySQL Workbench or phpMyAdmin.*

---

### Step 2: Configure Database Credentials in Java
Open `src/main/java/com/sms/dao/DBConnection.java`:
```java
private static final String DEFAULT_HOST = "localhost";
private static final String DEFAULT_PORT = "3306";
private static final String DEFAULT_DB   = "student_management";
private static final String DEFAULT_USER = "root";
private static final String DEFAULT_PASSWORD = "root"; // Update to match your MySQL password
```

---

### Step 3: Run the Application

#### Option A: Running in Eclipse IDE (Standard College Lab Procedure)
1. Open Eclipse &rarr; **File** &rarr; **Import** &rarr; **Existing Projects into Workspace** (or **Existing Maven Projects**).
2. Select the `student management` folder.
3. Configure Apache Tomcat 9:
   - Window &rarr; Preferences &rarr; Server &rarr; Runtime Environments &rarr; Add Apache Tomcat.
4. Right-click project &rarr; **Run As** &rarr; **Run on Server**.
5. The application will start at: `http://localhost:8080/student-management/`

#### Option B: Running with Maven
From the project root folder:
```bash
mvn clean compile tomcat7:run
```
Access at: `http://localhost:8080/student-management/`

#### Option C: Instant Frontend Preview
Simply double-click `index.html` or `dashboard.html` in your browser. The frontend includes built-in mock student data with active localStorage persistence, allowing you to preview and evaluate the complete UI even before starting Tomcat!

---

## 7. System Access Credentials
- **Admin Login Username:** `admin`
- **Admin Login Password:** `admin123`
- **Protected Student Records PIN (View All Students):** `7337` (Security verification required before viewing student records)

---

## 8. Conclusion
The **Student Management System** successfully fulfills all academic requirements for a Java Programming mini project. It demonstrates how core Object-Oriented principles, multi-tier MVC architecture, and secure database interactions via JDBC unite to create a production-grade web application. The system eliminates manual record-keeping errors, streamlines student admission and lookup, and provides a modern, responsive user experience.

