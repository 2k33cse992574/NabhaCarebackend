# Nabha Healthcare Backend

![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![ExpressJS](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)

**Nabha Healthcare Backend** is a modular and secure telemedicine API designed to facilitate interactions between patients, doctors, and pharmacists. It features real-time video/voice call capabilities via Twilio, secure payment processing via Razorpay, and comprehensive role-based access control.

## ✨ Core Features
- **Role-Based Authentication:** Secure JWT-based authentication for Patients, Doctors, Pharmacists, and Admins.
- **Telemedicine Integration:** Dynamic token generation for video and voice calls powered by **Twilio**.
- **Payment Gateway:** Seamlessly integrated with **Razorpay** for handling appointments and consultations.
- **Symptom Checker:** Backend support for symptom analysis and diagnostic tracking.
- **Real-Time Notifications:** Integrated notification service using Twilio SMS.
- **Security & Performance:** Implements Helmet for header security, Morgan for logging, and Rate Limiting to prevent abuse.

## 🛠️ Tech Stack
- **Framework:** Express.js (Node.js)
- **Database:** MongoDB with Mongoose ORM
- **Security:** Helmet, Bcrypt, JWT, Rate-Limiter
- **Integrations:** Twilio (Video/Voice/SMS), Razorpay (Payments)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Twilio & Razorpay accounts

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/2k33cse992574/NabhaCarebackend.git
   cd NabhaCarebackend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup environment variables:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` and fill in your secrets.*
4. Start the server:
   ```bash
   npm start
   ```

## 📝 License
This project is open-source.
