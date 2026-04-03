# 💊 MedLink Pharmacy System
> Designed as a scalable pharmacy operations platform capable of evolving into a distributed microservices system with AI-driven decision support.

An AI-assisted, omnichannel pharmacy operations platform designed to streamline inventory management, billing, and intelligent decision-making across multiple pharmacy outlets.

---

## 🚀 Overview

MedLink is a full-stack pharmacy management system built with a focus on **scalability, real-world workflows, and AI-assisted insights**.

It enables pharmacy chains to efficiently manage inventory, process billing, monitor sales performance, and leverage AI for smarter operational decisions.

---

## ✨ Key Features

### 🔐 Authentication & Authorization

* JWT-based secure login system
* Role-based access control (Admin, Manager, Staff)
* Password hashing using bcrypt

---

### 📦 Inventory Management

* Add, update, delete medicines
* Track stock levels, pricing, and expiry dates
* Low stock alerts and expiry tracking

---

### 🧾 Billing System (POS)

* Multi-item invoice generation
* Automatic total calculation
* Real-time stock deduction after transactions
* Transaction history tracking

---

### 📊 Dashboard & Reporting

* Daily and total sales insights
* Low stock and expiring medicines view
* Outlet-level performance analytics

---

### 🤖 AI-Assisted Capabilities

* 💡 Alternative medicine recommendations
* 🚨 Suspicious transaction detection
* 💬 Natural language query support (e.g., “Show today’s sales”)

---

## 🏗️ System Architecture

The system follows a **modular microservices-inspired architecture**, ensuring scalability and maintainability.

### 🔄 High-Level Flow:

User → Frontend → API Layer → Business Logic → Database

### 🔧 Backend Module Structure:

app/

* config.py → environment & settings
* database.py → DB connection (SQLAlchemy)
* models.py → database models
* schemas.py → request/response validation

Modules:

* auth/ → authentication & RBAC
* inventory/ → medicine & stock management
* billing/ → POS and transactions
* ai/ → recommendations & anomaly detection
* dashboard/ → aggregated insights

---

## 🛠️ Tech Stack

| Layer    | Technology                   |
| -------- | ---------------------------- |
| Frontend | Responsive Web UI            |
| Backend  | Python (FastAPI)             |
| Database | PostgreSQL (SQLite fallback) |
| ORM      | SQLAlchemy                   |
| Auth     | JWT + bcrypt                 |

---

## 🗄️ Database Schema

### Core Tables:

* **users** → roles & authentication
* **medicines** → inventory data (stock, expiry, price)
* **sales** → transaction records
* **sale_items** → items within each sale
* **audit_logs** → action tracking for compliance

---

## 🔌 API Endpoints (Key)

| Method | Endpoint                        | Description              | Access        |
| ------ | ------------------------------- | ------------------------ | ------------- |
| POST   | /api/auth/login                 | User login               | Public        |
| POST   | /api/auth/register              | Create user              | Admin         |
| GET    | /api/inventory/                 | List medicines           | All           |
| POST   | /api/inventory/                 | Add medicine             | Admin/Manager |
| GET    | /api/inventory/low-stock        | Low stock alerts         | All           |
| GET    | /api/inventory/expiring         | Expiry alerts            | All           |
| POST   | /api/billing/                   | Create sale              | All           |
| GET    | /api/billing/                   | List sales               | All           |
| GET    | /api/ai/alternatives/{id}       | Recommend alternatives   | All           |
| GET    | /api/ai/suspicious-transactions | Detect anomalies         | All           |
| POST   | /api/ai/query                   | Natural language queries | All           |
| GET    | /api/dashboard/stats            | Dashboard insights       | All           |

---

## 🔐 Security & Compliance

* JWT-based authentication
* Role-based authorization (Admin > Manager > Staff)
* Secure password hashing (bcrypt)
* Audit logging for traceability

---

## ⚡ Non-Functional Highlights

* Modular and scalable architecture
* Clean API separation
* Designed for cloud deployment
* Handles real-time operations efficiently
* Extendable to offline-first architecture

---

## 🧠 AI Design Approach

Current system uses **rule-based intelligence** for:

* Recommendation engine
* Anomaly detection
* Natural language query mapping

### Future Enhancements:

* ML-based demand forecasting
* NLP-powered conversational assistant
* LLM-based intelligent analytics

---

## 🚀 Future Scope

* 📩 Email/SMS alerts for low stock
* 📷 Barcode scanning integration
* 🏪 Multi-store synchronization
* ☁️ Cloud deployment with auto-scaling
* 📊 Export reports (PDF/Excel)
* 🔄 Offline-first sync architecture
* 🤖 Advanced AI using LLMs

---

## 🧪 Setup Instructions

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment (.env)
DATABASE_URL=postgresql://user:pass@localhost:5432/medlink
SECRET_KEY=your-secret-key

# Seed admin user
python seed.py

# Run server
uvicorn main:app --reload --port 8000
```

---

## 🔑 Default Credentials

* Admin → admin / admin123

---

## 📸 Screenshots

*Add your UI screenshots here*

---

## 📚 API Docs

Run the backend server and open:
- Swagger UI → http://localhost:8000/docs
- ReDoc → http://localhost:8000/redoc
  
---
## 🌐 Live Demo
Coming soon

## ⭐ Why This Project Stands Out

* Combines **real-world business workflows + AI features**
* Demonstrates **full-stack engineering + system design thinking**
* Built with **scalability, security, and maintainability in mind**

---

## 👨‍💻 Author
Developed as a full-stack system design project focusing on scalable architecture, real-world pharmacy workflows, and AI-assisted decision support. This project demonstrates practical implementation of inventory systems, POS workflows, and intelligent insights using modern backend technologies.
