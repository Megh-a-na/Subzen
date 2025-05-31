# Subzen – Subscription Tracker & Expense Planner

A sleek and user-friendly web application designed to track recurring subscriptions and help users take control of their digital expenses. Developed as a personal finance tool, Subzen allows users to manage services, set reminders, and visualize their monthly subscription outflow—all from a central dashboard.

---

## 🚀 Project Overview

As digital services proliferate, it becomes increasingly easy to lose track of where your money is going—Netflix, Spotify, cloud storage, domain renewals, and more. Subzen was built to solve this problem through a **minimalist and intuitive dashboard** for subscription tracking.

Key goals of the project:
- Help users monitor monthly/yearly subscription costs.
- Simplify data entry and editing via modals.
- Enable profile-based login and data management.
- Lay the groundwork for future financial analytics.

---

## 🎯 Core Features

### 1. User Authentication
- Sign up with a secure form.
- Login functionality with session persistence.
- User data stored in **SQLite database** (`users.db`).

### 2. Dashboard View of Subscriptions
- View all added subscriptions at a glance.
- Displays:
  - Service Name
  - Amount
  - Renewal Cycle
  - Notes

### 3. Add & Edit Subscriptions
- Use **modals** to quickly add or update subscription info.
- Edit features include:
  - Change amount, date, or cycle
  - Update service details
  - Add optional notes

### 4. Monthly Budget Insights *(In Progress)*
- Placeholder for visual insights and summaries.
- Upcoming feature: breakdown chart of monthly subscription spend.

---

## 💡 Use Cases

- Track subscriptions and cut unnecessary costs.
- Maintain a single digital wallet for recurring expenses.
- Build awareness of personal financial habits.
- Plan and budget future expenses.

---

## 🧱 Tech Stack

### Frontend
- **React + Vite**
- **JavaScript**
- **Tailwind CSS** (assumed from class styles)
- Modal-based UI for input/edit

### Backend
- **Flask** (Python)
- **SQLite3** for local user authentication

---

## 🗂️ Project Structure
