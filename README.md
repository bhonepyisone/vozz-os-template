# Vozz OS - Complete SME Management Platform

Welcome to the Vozz OS project repository. This is a comprehensive, enterprise-grade management platform designed for Small to Medium Enterprises (SMEs), with a primary focus on the restaurant and service industry.

## ✨ Features

Vozz OS is built to be an all-in-one solution, covering all aspects of business management:

- **Dashboard:** A real-time overview of key business metrics.
- **Point of Sale (POS):** A modern, intuitive system for managing orders, floor plans, and payments.
- **Menu & Inventory Management:** Tools for recipe creation, stock tracking, and procurement.
- **HRM & Attendance:** A full suite for managing employees, from QR-code based attendance to payroll and performance reviews.
- **CRM:** A customer relationship management system with a loyalty program to drive repeat business.
- **Financial Management:** In-depth tools for expense tracking, accounts payable, and generating financial statements.
- **Advanced Reporting:** A powerful analytics engine to turn raw data into actionable insights.
- **Settings & Admin Panel:** Robust controls for system configuration and user management.

## 💻 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Database:** [Firebase Firestore](https://firebase.google.com/products/firestore)
- **Authentication:** [Firebase Authentication](https://firebase.google.com/products/auth)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Deployment:** [Vercel](https://vercel.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Charting:** [Recharts](https://recharts.org/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

Follow these steps to get your local development environment set up.

### Prerequisites

- Node.js (v18.x or later)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/vozz-os-template.git](https://github.com/your-username/vozz-os-template.git)
    cd vozz-os-template
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Firebase:**
    - Create a new project on the [Firebase Console](https://console.firebase.google.com/).
    - Set up Firestore Database and Authentication.
    - Get your Firebase project configuration credentials.
    - Create a `.env.local` file in the root of the project and add your credentials (we will set this up in `src/lib/firebase.js`).

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.