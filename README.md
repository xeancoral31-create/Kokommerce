## Kokommerce

**Laravel-based D2C e-commerce platform with admin + customer system.**

[![Backend](https://img.shields.io/badge/Backend-Laravel_8-ff2d20?logo=laravel\&logoColor=white)](#tech-stack)
[![Database](https://img.shields.io/badge/Database-MySQL-00758f?logo=mysql\&logoColor=white)](#tech-stack)
[![Auth](https://img.shields.io/badge/Auth-Clerk-6c47ff)](#tech-stack)
[![Payments](https://img.shields.io/badge/Payments-Stripe_%2B_PayMongo-635bff?logo=stripe\&logoColor=white)](#tech-stack)
[![Maps](https://img.shields.io/badge/Maps-Leaflet-199900?logo=leaflet\&logoColor=white)](#tech-stack)
[![License](https://img.shields.io/badge/license-MIT-8b5cf6)](LICENSE)

Scalable e-commerce backend focused on structured data modeling, modular features, and real-world deployment readiness.

---

## ✨ Features

### 🛍️ Customer System

* Product catalog browsing
* Category-based organization
* Cart & checkout flow
* Order tracking
* Promotions & discount codes
* Loyalty system (points & tiers)

### 🛠️ Admin System

* Product & category management
* Order management
* Promotion control
* Activity logs & monitoring
* Notifications system
* Help ticket management

---

## 🧱 Tech Stack

**Backend**

* Laravel 8.x
* PHP ^8.2
* Eloquent ORM

**Database**

* MySQL

**Integrations**

* Clerk (authentication)
* Stripe & PayMongo (payments)
* Leaflet (mapping)

---

## 🏗️ Architecture

```id="bmnx8n"
Client / Frontend
        ↓
Laravel API Layer
        ↓
MySQL Database
```

* RESTful API design
* Clear separation of concerns
* Modular and scalable structure

---

## 🗄️ Database Overview

### Core Tables

* `users` — admin/operator accounts
* `buyers` — customer records
* `products`
* `categories`
* `orders`
* `order_items`

### Supporting Tables

* `promotions`
* `activity_logs`
* `notifications`
* `help_tickets`
* `store_settings`
* `seller_whitelist`

### Key Relationships

* Buyer → Orders (1:N)
* Orders → Order Items (1:N)
* Products → Order Items (1:N)
* Users → Logs / Notifications / Tickets

---

## ⚙️ Getting Started

### 1. Clone

```bash id="g2w8yh"
git clone https://github.com/your-username/kokommerce.git
cd kokommerce
```

---

### 2. Install Dependencies

```bash id="1wdjhj"
composer install
```

---

### 3. Environment Setup

```bash id="1u2p8h"
cp .env.example .env
php artisan key:generate
```

Update `.env`:

```env id="r45dtt"
DB_DATABASE=your_db
DB_USERNAME=your_user
DB_PASSWORD=your_pass
```

---

### 4. Run Database

```bash id="q3kk1v"
php artisan migrate
php artisan db:seed
```

---

### 5. Start Server

```bash id="0vtp5o"
php artisan serve
```

---

## 🧪 Development Commands

```bash id="o1ru1p"
# Reset database
php artisan migrate:fresh --seed

# Clear caches
php artisan optimize:clear

# Run tests
php artisan test
```

---

## 💾 Backup

```bash id="l5f8m2"
mysqldump -u user -p database_name > kokommerce_backup.sql
```

---

## 🔐 Environment Variables

```env id="3h5f1n"
APP_KEY=

DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

CLERK_SECRET=
STRIPE_KEY=
PAYMONGO_KEY=
```

---

## 🧠 Design Decisions

* Separate **users (admins)** and **buyers (customers)**
* Denormalized `items_data` for order snapshot consistency
* Flexible promotion system (percentage / fixed)
* JSON fields for extensibility (tags, metadata)

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Open a pull request

---

## 📄 License

MIT License — see `LICENSE` for details.

---
