# SecureExamVault

**SecureExamVault** is a robust, full-stack examination management system designed with security at its core. It integrates advanced cryptographic techniques to ensure data confidentiality, integrity, and authenticity while providing a seamless user experience for Administrators, Faculty, and Students.

![SecureExamVault Banner](https://placehold.co/1200x400?text=SecureExamVault)

## 🚀 Features

### 🔐 Advanced Security
*   **Hybrid Encryption**: Utilizes a combination of symmetric and asymmetric encryption to protect sensitive exam data.
*   **Digital Signatures**: Ensures the authenticity of exam results and critical documents.
*   **Secure Key Exchange**: Implements secure protocols for key management between parties.
*   **Multi-Factor Authentication (MFA)**: Adds an extra layer of security for user login.
*   **Access Matrix**: granular Role-Based Access Control (RBAC) to manage permissions dynamically.

### 👥 User Roles & Dashboards
*   **Admin Dashboard**: Manage users, oversee system security, viewing access matrices, and handle configurations.
*   **Faculty Dashboard**: Create and manage exams, sign results digitally, and monitor student performance.
*   **Student Dashboard**: Securely take exams, view signed results, and manage profile settings.

### 🛠️ Technical Highlights
*   **Modern UI**: Built with React (Vite) and Tailwind CSS, featuring a responsive and accessible design using Radix UI & Shadcn components.
*   **Real-time Data**: Powered by TanStack Query for efficient data fetching and caching.
*   **Form Management**: robust form handling with React Hook Form and Zod validation.
*   **Data Visualization**: Integrated Recharts for analytics and performance tracking.

---

## 🏗️ Technology Stack

### Frontend
*   **Framework**: React 18 (Vite)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS, Tailwind Animate
*   **Components**: Radix UI, Lucide React, Shadcn UI (inferred)
*   **State & Data**: TanStack Query (React Query)
*   **Forms**: React Hook Form, Zod
*   **Routing**: React Router DOM 6
*   **Animations**: Framer Motion
*   **Notifications**: Sonner

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (Mongoose)
*   **Authentication**: JWT (JSON Web Tokens), Bcrypt
*   **Communication**: Nodemailer (SMTP)
*   **Security**: Cors, Dotenv

---

## 🛠️ Installation & Setup

Follow these steps to get the project running on your local machine.

### Prerequisites
*   [Node.js](https://nodejs.org/) (v16+)
*   [MongoDB](https://www.mongodb.com/) (Local or Atlas URL)
*   Git

### 1. Clone the Repository
```bash
git clone https://github.com/priyansh-narang2308/SecureExamVault.git
cd SecureExamVault
```

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and configure environment variables.

```bash
cd backend
npm install
```

**Configuration**:
Create a `.env` file in the `backend` directory based on `.env.example`:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/secure-exam-vault
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRES_IN=1h

# SMTP Configuration (For Emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

**Start the Server**:
```bash
npm run dev
# Server will start on http://localhost:5001
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and set up the client.

```bash
cd frontend
npm install
```

**Configuration**:
Create a `.env` file in the `frontend` directory based on `.env.example`:

```env
VITE_API_URL=http://localhost:5001/api
```

**Start the Client**:
```bash
npm run dev
# Application will run at http://localhost:5173
```

---

## 📂 Project Structure

```
SecureExamVault/
├── backend/                # Express API Server
│   ├── src/
│   │   ├── config/         # Database and app config
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth and error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API Route definitions
│   │   └── utils/          # Helper functions
│   ├── .env.example
│   └── server.js           # Entry point
│
└── frontend/               # React Vite Application
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── contexts/       # React Context (Auth, Theme)
    │   ├── hooks/          # Custom React hooks
    │   ├── lib/            # Utilities (cn, etc.)
    │   ├── pages/          # Application views (Dashboards, Auth)
    │   ├── App.tsx         # Main component with Routes
    │   └── main.tsx        # Entry point
    └── .env.example
```

## 🛡️ Security Features Details

1.  **Hybrid Encryption**: Large data payloads (like exam answers) are encrypted using symmetric keys (AES), while the symmetric keys themselves are encrypted using asymmetric keys (RSA/ECC) for secure transmission.
2.  **Digital Signatures**: Faculty members digitally sign exam results. Students can verify the signature to ensure the results haven't been tampered with.
3.  **Role-Based Access Control (RBAC)**: Middleware ensures that API endpoints are restricted based on user roles (Admin, Faculty, Student).

## 🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure that you adhere to the existing code style and include relevant tests.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.