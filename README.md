[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Docker Build](https://img.shields.io/badge/Docker-Build-blue?logo=docker)](https://hub.docker.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-lightgreen?logo=mongodb)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Real--time-Socket.IO-black?logo=socketdotio)](https://socket.io/)
[![Redis](https://img.shields.io/badge/Cache-Redis-D82C20?logo=redis&logoColor=white)](https://redis.io/)
[![Made for Odoo](https://img.shields.io/badge/Made%20for-Odoo-714B67?logo=odoo)](https://www.odoo.com/)

# QuickDesk - AI-Enhanced Help Desk for Odoo

**Website:** [quickdesk.yourdomain.com](https://quickdesk.yourdomain.com)

**Tagline:** *"Support at the Speed of Business"*

**Team Name:** *Drakshushi*

---

## 📄 Description

QuickDesk is a next-generation, AI-enhanced help desk module for Odoo, delivering seamless ticketing, SLA automation, and analytics within your ERP.

**Who it's for:**

* SMBs using Odoo for end-to-end operations
* IT/support teams craving integrated workflows
* Customer service departments requiring instant insights

**Why QuickDesk vs. SaaS Desks?**

| Aspect         | SaaS Desk                    | QuickDesk                              |
| -------------- | ---------------------------- | -------------------------------------- |
| Integration    | Separate system, sync issues | Native Odoo module, real-time data     |
| Cost           | Recurring fees               | Open-source (MIT), self-hosted         |
| Customization  | UI-limited                   | Full code & Studio-based tweaks        |
| Data Ownership | Vendor-controlled            | Your servers, your policies            |
| Upgrades       | Provider-driven, breaking    | Zero-downtime via Odoo modular updates |

---

## 🚀 Live Demo

* **URL:** [demo.quickdesk.yourdomain.com](https://demo.quickdesk.yourdomain.com)
* **Test Account:** `demo@quickdesk.com` / `Demo1234`

---

## 🛠️ Tech Stack

* **Core:** Odoo 16+, Python 3.10+, PostgreSQL 14+
* **Containerization:** Docker, Docker Compose, Kubernetes Helm
* **Messaging & Jobs:** Redis, Celery
* **Optional Frontend:** React 18+, Vite, Tailwind CSS, shadcn/ui, Framer Motion
* **API Layer:** Apollo GraphQL Server, Flask Blueprint REST
* **CI/CD:** GitHub Actions
* **Monitoring:** Prometheus, Grafana, ELK Stack

---

## 🏗️ Architecture

```plaintext
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  End Users   │      │  Support     │      │  Admins      │
│  (Web/Email) │      │  Agents      │      │  Odoo UI     │
└──────┬───────┘      └──────┬───────┘      └──────┬───────┘
       │                     │                     │
       ▼                     ▼                     ▼
┌───────────────────────────────────────────────────────┐
│                    QuickDesk Module                   │
│ ┌───────────┐  ┌────────┐  ┌────────┐  ┌───────────┐  │
│ │ Ticket    │  │ SLA    │  │ Alerts │  │ Analytics │  │
│ │ Manager   │  │ Engine │  │ System │  │ Dashboard │  │
│ └───────────┘  └────────┘  └────────┘  └───────────┘  │
└─────────────────────────┬─────────────────────────────┘
                          │
         ┌────────────────┴───────────────────┐
         │         Odoo Core ERP & Data       │
         └────────────────┬───────────────────┘
                          │
     ┌────────────────────┴───────────────────────┐
     │ PostgreSQL 14+       │ Redis & Celery      │
     │ Metrics & Logs       │ API Services        │
     └────────────────────────────────────────────┘
```

[View detailed design](docs/system-design.md)

---
## layout sketch

![sketch layout](https://github.com/hemathens/quick-desk-odoo/blob/main/48f6c452-b21a-4da2-88a2-69b4f8fca860.png)

---

## 🧱 Folder Structure

```plaintext
quick-desk-odoo/
├── backend/quick_desk/    # Core Odoo module
│   ├── controllers/      # HTTP & JSON endpoints
│   ├── models/           # ORM definitions
│   ├── security/         # Access controls
│   ├── views/            # QWeb/XML templates
│   ├── data/             # Initial & demo data
│   ├── static/           # JS, CSS, images
│   ├── tests/            # PyTest suite
│   ├── __manifest__.py   # Module metadata
│   └── __init__.py
├── frontend/portal/      # (Optional) React-based portal
│   ├── public/
│   └── src/
├── docker/               # Docker & Compose files
├── docs/                 # OpenAPI/GraphQL specs, designs
├── scripts/              # Migration & helper scripts
├── .env.example          # Template env vars
└── README.md             # This file
```

---

## ✨ Features

* **AI Ticket Routing:** ML-driven assignment recommendations
* **Ticket Lifecycle:** Open → In Progress → Resolved → Closed
* **SLA Management:** Real-time timers, automated escalations
* **Notifications:** Email, SMS (Twilio), in-app
* **Analytics:** Custom dashboards, CSV/PDF exports
* **Integrations:** Slack, MS Teams, Zapier webhooks
* **Customization:** Odoo Studio & code overrides

---

## 🎯 Use Cases

* **SMB IT Support:** Centralize employee tickets, measure SLAs
* **Customer Service:** Integrated CRM & support workflows
* **DevOps:** Automated incident tickets from monitoring alerts

---

## 🔍 Roles & Navigation

QuickDesk tailors its experience to three main roles, each with focused UI and navigation:

### 🧑‍💼 End Users

* **My Tickets**: `/my-tickets` – Create, view, and comment on own tickets
* **New Ticket**: `/create-ticket` – Form with category, priority, description, attachments
* **Notifications**: In-app bell icon and email alerts on updates

### 🛠️ Support Agents

* **Ticket Queue**: `/agent/queue` – Filter by status, priority, SLA breach
* **Ticket Detail**: `/agent/ticket/:id` – Assign, comment, change status, add internal notes
* **Analytics**: `/agent/analytics` – Personal performance metrics and response times

### ⚙️ Administrators

* **Admin Dashboard**: `/admin` – System overview, user management, category & SLA settings
* **Reports**: `/admin/reports` – Exportable CSV/PDF reports, SLA compliance charts
* **Configuration**: `/admin/config` – Email/SMS templates, workflow rules, integrations

---

## 📸 Screenshots
**Preview of dashboard**

![Ticket View](https://github.com/hemathens/quick-desk-odoo/blob/main/WhatsApp%20Image%202025-08-02%20at%2015.09.58_ef4e7f38.jpg)
![Dashboard](https://github.com/hemathens/quick-desk-odoo/blob/main/WhatsApp%20Image%202025-08-02%20at%2015.09.58_0d639d97.jpg)
[Home Page](https://github.com/hemathens/quick-desk-odoo/blob/main/WhatsApp%20Image%202025-08-02%20at%2016.03.29_246f1a46.jpg)

---

## ⚙️ Getting Started

### Option 1: Docker (Recommended)

```bash
git clone https://github.com/Mihir-Rabari/quick-desk-odoo.git
cd quick-desk-odoo
cp .env.example .env
docker-compose up -d --build
# Access Odoo at http://localhost:8069, install "QuickDesk"
```

### Option 2: Manual

```bash
# Install Python deps
pip install -r backend/quick_desk/requirements.txt
# Start PostgreSQL & Redis
# Run Odoo with addons path including quick_desk
odoo -c odoo.conf
```

---

## 🔧 Configuration

See `.env.example`:

```env
POSTGRES_DB=quickdesk
POSTGRES_USER=odoo
POSTGRES_PASSWORD=odoo
ODOO_ADDONS=backend/quick_desk
SMTP_SERVER=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASSWORD=pass
REDIS_URL=redis://redis:6379/0
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
```

---

## 🧪 Testing

```bash
# Backend
docker-compose exec odoo pytest -q
# Frontend
docker-compose exec portal npm test
```

---

## 🔒 Monitoring & Security

* **Metrics:** Exposed via Prometheus, dashboards in Grafana
* **Logs:** Centralized in ELK Stack
* **Security:** JWT auth for APIs, role-based access, TLS recommended

---

## 🤝 Contributing

Contributions welcome! Please follow \[CONTRIBUTING.md] and the repository guidelines.

---

## 🐛 Roadmap

* Multi-tenant support
* Mobile app (React Native)
* AI-powered agent chat assistant

---

## 👥 Team & Credits

**Team Name:** Drakshushi

### • **Hem Patel**  
[![Kaggle Profile](https://img.shields.io/badge/Kaggle-hem%20ajit%20patel-20BEFF?logo=kaggle)](https://www.kaggle.com/hemajitpatel)  [![LinkedIn](https://img.shields.io/badge/LinkedIn-Hem%20Ajit%20Patel-0A66C2?logo=linkedin)](https://www.linkedin.com/in/hem-patel19)  [![GitHub](https://img.shields.io/badge/GitHub-hemathens-181717?logo=github)](https://github.com/hemathens)

### • **Laukik Rajput**  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Laukik%20Rajput-0A66C2?logo=linkedin)](https://www.linkedin.com/in/laukik-rajput-95bb48300)  [![GitHub](https://img.shields.io/badge/GitHub-lokixshr-181717?logo=github)](https://github.com/lokixshr)

### • **Mihir Rabari**  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Mihir%20Rabari-0A66C2?logo=linkedin)](https://www.linkedin.com/in/mihir-rabari)  [![GitHub](https://img.shields.io/badge/GitHub-Mihir--Rabari-181717?logo=github)](https://github.com/Mihir-Rabari)


---

## 📬 Contact & Support

* **Email:** [support@quickdesk.yourdomain.com](mailto:support@quickdesk.yourdomain.com)
* **GitHub Issues:** [https://github.com/Mihir-Rabari/quick-desk-odoo/issues](https://github.com/Mihir-Rabari/quick-desk-odoo/issues)
* **Discord:** [https://discord.gg/quickdesk](https://discord.gg/quickdesk)

---

## ⚖️ License

[MIT License © 2025 Drakshushi](LICENSE)
