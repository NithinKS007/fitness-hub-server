# FT-Hub Backend Server - Connect with Your Personal Trainer

A Node.js/Express backend service for the FT-Hub platform, connecting fitness enthusiasts with professional trainers. This service powers online booking, real-time chat, content management, video-calling, subscription handling, and progress tracking, with integrations for MongoDB, Cloudinary, Stripe, and Socket.IO.

## 🌐 Live Application
The backend is hosted on **AWS** and serves the frontend hosted on **Vercel**.
Try the live application at [https://fitness-hub-client.vercel.app](https://fitness-hub-client.vercel.app).

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Security](#security)
- [Development](#development)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

🌟 Features

1.  **User Authentication** : Secure JWT-based sign-up, sign-in, and token refresh.
2.  **Trainer-User Connection** : APIs to browse, filter, and connect with trainers.
3.  **Online Booking System** : Manage trainer availability and session bookings.
4.  **Real-Time Chat** : Integrated Socket.IO for instant messaging between users and trainers.
5.  **Content Management** : Upload and manage workout videos, routines, and guides via Cloudinary.
6.  **Subscription Plans** : Process subscription payments and manage access using Stripe.
7.  **Progress Tracking** : Store and retrieve user fitness goals and workout logs.
8.  **Email Verification** : OTP-based user verification using Nodemailer.
9.  **Secure File Uploads** : Handle media uploads with Cloudinary.
10. **Error Handling** : Centralized middleware for consistent error responses.

## 🚀 Tech Stack

This project uses the following technologies:

### 1. **Backend Framework**
- **[Express](https://expressjs.com/)**: A minimal and flexible Node.js web application framework used to build RESTful APIs and handle HTTP requests.
- **[Express Rate Limit](https://www.npmjs.com/package/express-rate-limit)**: Middleware to limit repeated requests to public APIs to prevent abuse.
- **[Cookie-parser](https://www.npmjs.com/package/cookie-parser)**: Middleware for parsing cookies in the request.
- **[Cors](https://www.npmjs.com/package/cors)**: Middleware to enable Cross-Origin Resource Sharing (CORS) for handling requests from different origins.

### 2. **Authentication & Security**
- **[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)**: A package to generate and verify JSON Web Tokens (JWT) for secure user authentication.
- **[Bcrypt](https://www.npmjs.com/package/bcrypt)**: Library for hashing and comparing passwords securely.
- **[express-validator](https://www.npmjs.com/package/express-validator)**: Middleware for validating and sanitizing request data.
- **[google-auth-library](https://www.npmjs.com/package/google-auth-library)**: Library for integrating Google OAuth authentication.

### 3. **Database**
- **[Mongoose](https://mongoosejs.com/)**: MongoDB object modeling tool that provides a straightforward way to work with MongoDB in a Node.js environment.

### 4. **Real-Time Communication**
- **[Socket.IO](https://socket.io/)**: Real-time, bidirectional communication between clients and the server for building real-time features like chat, notifications, etc.

### 5. **Payment Processing**
- **[Stripe](https://stripe.com/)**: Payment gateway for processing subscriptions and transactions securely.

### 6. **Email & Notifications**
- **[Nodemailer](https://nodemailer.com/)**: A module for sending emails via SMTP.
- **[OTP-Generator](https://www.npmjs.com/package/otp-generator)**: Used for generating OTPs (One-Time Passwords) for user verification.

### 7. **File Management**
- **[Cloudinary](https://cloudinary.com/)**: A cloud-based service for managing and delivering media (images, videos, etc.).

### 8. **Development Tools**
- **[TypeScript](https://www.typescriptlang.org/)**: A superset of JavaScript that adds static typing to the language, improving developer experience and code reliability.
- **[Nodemon](https://www.npmjs.com/package/nodemon)**: A tool that automatically restarts the server during development whenever changes are made to the source code.
- **[ts-node](https://www.npmjs.com/package/ts-node)**: TypeScript execution engine for running TypeScript code directly without compiling to JavaScript.
- **[typescript](https://www.npmjs.com/package/typescript)**: TypeScript compiler for compiling TypeScript code to JavaScript.

### 9. **Logging & Error Handling**
- **[Winston](https://www.npmjs.com/package/winston)**: A versatile logging library used to log information, errors, and warnings.
- **[Morgan](https://www.npmjs.com/package/morgan)**: HTTP request logger middleware for Node.js, often used to log requests for debugging and monitoring.

### 10. **Other Utilities**
- **[dotenv](https://www.npmjs.com/package/dotenv)**: Loads environment variables from a `.env` file for configuration management.
- **[dayjs](https://day.js.org/)**: A lightweight JavaScript date library for manipulating, parsing, and formatting dates.
- **[cloudinary](https://cloudinary.com/)**: A cloud service for managing images and videos.

## 🚀 Getting Started

### 📋 Prerequisites

- Node.js (v22.15.0 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for media storage)
- Stripe account (for payment processing)
- Google account
- Git

## ⚙️ Installation

1. Clone the repository:

```bash

git clone https://github.com/yourusername/fitness-hub-server.git

cd fitness-hub-server

```

2. Install dependencies:

```bash

npm install

```

3. Create a `.env` file in the root directory with the following variables:

```env

# Server Configuration
PORT=9000

# Database Configurations
COMPASS_DATABASE_CONFIG="mongodb://localhost:27017/compassdb" # Replace with your Compass DB URL
ATLAS_DATABASE_CONFIG="mongodb+srv://your-username:your-password@cluster0.mongodb.net/mydb" # Replace with your Atlas DB URL

# CORS Client Origins
CLIENT_ORIGINS="http://localhost:3000"

# JWT Configuration
JWT_SECRET="your-secret-key-here"
JWT_EXPIRATION="1h"
JWT_REFRESH_SECRET="your-refresh-secret-key-here"
JWT_REFRESH_EXPIRATION="7d"

# Node Environment (Development or Production)
NODE_ENV="development"  # Change to 'production' when deploying

# Email Configuration
EMAIL_USER="your-email@example.com"
EMAIL_PASS="your-email-password"

# Google OAuth Configuration
GOOGLE_CLIENT_ID="your-google-client-id"

# Cloudinary Configuration for Media Uploads
CLOUDINARY_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
CLOUDINARY_PROFILE_PIC_FOLDER="FitnessHub/profile-pics"
CLOUDINARY_TRAINER_CERTIFICATES_FOLDER="FitnessHub/trainer-certificates"
CLOUDINARY_THUMBNAIL_FOLDER="FitnessHub/Vids/thumbnails"
CLOUDINARY_VIDEOS_FOLDER="FitnessHub/Vids/videos"

# Stripe Configuration for Payments
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRETKEY="your-stripe-webhook-secret-key"
STRIPE_SUCCESS_URL="https://your-frontend-url.com/payment-success"
STRIPE_FAILURE_URL="https://your-frontend-url.com/payment-failure"

```

## 🏃‍♂️ Running the Server

Development mode:

```bash
npm run dev
```

The server will start on `http://localhost:9000` by default.

## 📁 Project Structure

```
server/
│
├── .env                    # Environment variables
├── .gitignore              # Git ignore patterns
├── package.json            # Dependencies and scripts
├── package-lock.json       # Dependency lock file
├── README.md               # Project documentation
├── tsconfig.json           # TypeScript configuration
│
├── src/                    # Source code
│   ├── application/        # Application logic
│   │   ├── dtos/           # Data Transfer Objects for API payloads
│   │   ├── interfaces/     # Interfaces for application services
│   │   └── usecases/       # Business use cases (e.g., booking, chat)
│   │
│   ├── config/             # Configuration files (e.g.,Server configuration)
│   │
│   ├── domain/             # Business entities and rules
│   │   ├── entities/       # Core entities (e.g., User, Booking)
│   │   └── interfaces/     # Interfaces for domain logic
│   │
│   ├── infrastructure/     # External services and persistence
│   │   ├── config/         # Infrastructure-specific configurations
│   │   ├── databases/      # Database connections (e.g., MongoDB)
│   │   ├── logging/        # Logging utilities
│   │   └── services/       # External services (e.g., Cloudinary, Stripe)
│   │
│   ├── presentation/       # API layer
│   │   ├── controllers/    # API request handlers
│   │   ├── middlewares/    # Request processing (e.g., auth, error handling)
│   │   └── routes/         # API route definitions
│   │
│   ├── shared/             # Shared utilities and constants
│   │   ├── constants/      # Application-wide constants
│   │   └── utils/          # Utility functions (e.g.,password hashing,send response )
│   │
│   └── server.ts           # server entry point
│
├── dist/                   # Compiled JavaScript files
└── node_modules/           # Node.js dependencies

```

## API Documentation
Detailed API documentation should be generated using tools like Swagger or Postman. 

## 🚀 Deployment
1. Build the project: `npm run build`
2. Deploy to AWS EC2:
   - Configure an EC2 instance with Node.js and MongoDB.
   - Use PM2 to manage the Node.js process: `pm2 start dist/server.js`.
3. Set environment variables in your production environment.
4. Configure a reverse proxy (e.g., Nginx) for load balancing.

## 🔒 Security

### 1. **JWT Authentication**

- **Package Used**: `jsonwebtoken`
- Tokens are generated and sent to users on login, providing access control. Token expiration and refresh functionality is implemented for secure, time-limited access.

### 2. **Password Hashing**

- **Package Used**: `bcrypt`
- User passwords are hashed and salted using **bcrypt**, making it nearly impossible for attackers to retrieve the original password from the hash.

### 3. **Email Verification**

- **Packages Used**: `nodemailer`, `otp-generator`
- **OTP-based** user verification ensures that users' email addresses are valid and prevents malicious sign-ups.

### 4. **CORS (Cross-Origin Resource Sharing)**

- **Package Used**: `cors`
- Only allowed origins (your frontend URLs) can access the backend API, preventing unauthorized domains from making requests.

### 5. **Rate Limiting**

- **Package Used**: `express-rate-limit`
- Limits the number of requests a user can make to prevent brute-force attacks or DDoS (Distributed Denial of Service) attempts.

### 6. **Logging**

- **Packages Used**: `winston`, `morgan`
- Logs HTTP requests and server errors. This helps in monitoring malicious activity, debugging, and auditing system events.

### 7. **Secure Cookie Handling**

- **Package Used**: `cookie-parser`
- Cookies (for session management or storing tokens) are handled securely with flags like `httpOnly`, `secure`, and `SameSite` to prevent **XSS** and **CSRF** attacks.

### 8. **Environment Variables**

- **Package Used**: `dotenv`
- Sensitive information (API keys, database credentials, JWT secrets) is stored in environment variables (`.env`), keeping them out of the source code and version control.

## ⚠️ Error Handling
The server includes **centralized error handling middleware** that ensures all errors are caught and handled in a consistent manner. It processes various types of errors that occur within the application, such as validation failures, database issues, unauthorized access, and more.

### Custom Error Classes

The error handling system defines several custom error classes that extend from a base `AppError` class. Each error class represents a specific type of error with an associated HTTP status code:

- **`AppError`**: The base class for all custom errors. It includes a `statusCode` property that defines the HTTP status code associated with the error.
  
- **Specific Error Classes**:
  - **`validationError`** (HTTP 400): Used when input validation fails (e.g., required fields missing or data in an incorrect format).
  - **`NotFoundError`** (HTTP 404): Used when a requested resource is not found.
  - **`UnauthorizedError`** (HTTP 401): Used when a user is not authorized to access a resource.
  - **`DatabaseError`** (HTTP 500): Used for server-side or database-related errors.
  - **`ForbiddenError`** (HTTP 403): Used when a user does not have permission to access a resource.


## 🛠️ Development

### Adding New Features

Follow the steps below when adding new features to the project:

1. **Define New Routes**  
   Define new API routes in the `src/presentation/routes/` directory. This is where all endpoint routes for incoming requests are specified.

2. **Implement Logic in Controllers**  
   Implement the business logic for the new routes in the `src/presentation/controllers/` directory. Controllers handle the incoming requests, invoke use cases, and return responses to the client.

3. **Add Necessary Middleware**  
   If the feature requires additional processing (such as authentication, logging, error handling, etc.), add the necessary middleware in the `src/presentation/middlewares/` directory.

4. **Update Application Logic**  
   If the feature involves business use cases or changes to the logic, update or add the necessary files in the `src/application/` directory:
   - **DTOs**: Update or create new Data Transfer Objects in `src/application/dtos/` to represent the data being passed through the application.
   - **Interfaces**: Add or modify service interfaces in `src/application/interfaces/` if the feature interacts with other services or external systems.
   - **Use Cases**: Implement business logic for the feature in `src/application/usecases/`.

5. **Update Domain Models**  
   If the new feature affects core business entities (like User, Booking, etc.), update the models in the `src/domain/entities/` directory. This is where all the domain entities are defined.
   
6. **Update Domain Interfaces**  
   If the feature involves changes to the business rules or logic, update the corresponding interfaces in the `src/domain/interfaces/` directory to reflect any changes in the domain logic.

7. **Add Database Integration**  
   If the feature involves changes to the database schema or new collections, add the necessary database connection and schema updates in `src/infrastructure/databases/`.

8. **Configure External Services**  
   For features involving external services (such as Cloudinary for media, Stripe for payments, etc.), add the configuration and integration code in `src/infrastructure/services/`. This includes adding service functions, API integrations, and configuration settings.

9. **Logging and Error Handling**  
   Add any required logging or error handling in the `src/infrastructure/logging/` directory. This is where all the logging utilities and centralized error-handling logic should reside.

10. **Configuration Changes**  
    If you need to update any environment-specific settings or configurations (e.g., server settings, third-party integrations), update the configuration files in `src/config/`.

11. **Real-Time Features (Sockets)**  
    For any real-time features (like chat or notifications), add the event handlers in the `src/infrastructure/services/sockets/` directory to manage socket events and connections.

12. **Update Shared Utilities**  
    If the new feature introduces reusable utilities, helper functions, or constants, add them in the `src/shared/utils/` directory for general use across the application. Constants for global values should go into `src/shared/constants/`.

13. **Run the Application**  
    After making all the necessary changes, run the application in the development environment to test the new feature. You can use `npm run dev` to start the server locally.

14. **Build and Deploy**  
    Once development and testing are complete, run `npm run build` to compile the TypeScript files. Then deploy the compiled code in the `dist/` folder.


### Code Style

- Use async/await for asynchronous operations
- Implement error handling middleware for all async operations
- Follow the existing project structure
- Use meaningful variable and function names

🤝 Contributing

Fork the repository.
Create a feature branch: git checkout -b feature/my-feature.
Commit changes: git commit -am 'Add my feature'.
Push to the branch: git push origin feature/my-feature.
Submit a pull request.

🆘 Support

Create an issue in the repository or contact the maintainers for support.

## 📜 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.