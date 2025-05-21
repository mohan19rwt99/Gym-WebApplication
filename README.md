# 🏋️ Gym Management Application

A full-stack Gym Management System built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js). This application provides a complete solution for managing gyms, with support for multiple user roles like Admin, Gym Owner, Manager, Receptionist, Trainer, and Customer.

---

## ✅ Features

- **Kinde Authentication** for secure login and signup
- **Separate login/register pages** for Admin and Customer roles
- **Role-based Access Control (RBAC)** using Kinde permissions
- **Gym Owner Dashboard** to:
  - Add new gyms
  - Assign Managers, Trainers, Receptionists
- **Customer Portal** to:
  - View gyms on Google Maps
  - Book membership plans
  - See their bookings and slot times
- **Cashfree Payment Integration**
  - Payment confirmation & status (Success, Pending, Cancelled)
  - Track user phone number and payment details
- **Google Maps API**
  - Used to select gym location via marker
  - Show gyms near the customer
- **Admin Panel** to view all gyms, users, and manage platform-wide data
- **Auto-generate 30-min booking slots** between open and close times

---

## 🧱 Tech Stack

| Layer       | Technology                           |
|-------------|---------------------------------------|
| Frontend    | React.js, Tailwind CSS, Axios         |
| Backend     | Node.js, Express.js                   |
| Database    | MongoDB with Mongoose                 |
| Authentication | Kinde (OAuth2 + Permissions)      |
| Maps        | Google Maps API (@react-google-maps/api) |
| Payments    | Cashfree REST API                     |

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js installed
- MongoDB (local or cloud like MongoDB Atlas)
- Google Maps API Key
- Cashfree Client ID & Secret
- Kinde account with app configured

  ---


## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

Feel free to fork the repository and submit a pull request.

---

## 📫 Contact

For queries, suggestions, or collaborations:

**Email:** mohan.jsdev@gmail.com  
**LinkedIn:**https://www.linkedin.com/in/mohan-singh-1495aa18a/

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

