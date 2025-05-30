# Agri-Navigator Platform

A comprehensive agricultural management platform that helps farmers and agricultural professionals optimize their operations through data-driven insights and modern technology solutions.

## 🌟 Features

- **Farm Management Dashboard**
  - Real-time monitoring of farm operations
  - Weather integration and forecasting
  - Crop health tracking
  - Resource management

- **Smart Analytics**
  - Data-driven insights
  - Performance metrics
  - Predictive analytics
  - Custom reports

- **Resource Optimization**
  - Water management
  - Fertilizer optimization
  - Equipment tracking
  - Labor management

- **Market Integration**
  - Price tracking
  - Market trends
  - Supply chain management
  - Trading platform

## 🚀 Tech Stack

### Frontend
- React.js
- TypeScript
- Material-UI
- Redux for state management
- Chart.js for data visualization

### Backend
- Node.js
- Express.js
- MongoDB
- RESTful API architecture
- JWT authentication

### DevOps
- Docker containerization
- CI/CD pipeline
- AWS cloud infrastructure
- Automated testing

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Docker (optional)
- Git

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/agri-navigator-platform.git
   cd agri-navigator-platform
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   
   # Frontend
   cp frontend/.env.example frontend/.env
   ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server
   cd frontend
   npm start
   ```

## 🔧 Configuration

### Backend Configuration
- Set up MongoDB connection string in `backend/.env`
- Configure JWT secret
- Set up AWS credentials (if using cloud services)

### Frontend Configuration
- Configure API endpoints in `frontend/.env`
- Set up authentication settings
- Configure third-party service integrations

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Manual Deployment
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the backend:
   ```bash
   cd backend
   npm run build
   npm start
   ```

## 📚 API Documentation

API documentation is available at `/api/docs` when running the backend server.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Thanks to all contributors
- Special thanks to the open-source community
- Inspired by modern agricultural challenges and solutions

## 📞 Support

For support, email support@agrinavigator.com or join our Slack channel.

## 🔄 Updates

Stay updated with our latest features and improvements by following our [changelog](CHANGELOG.md).

---

# Hinga Agriculture Management Platform 🌱🚜

Welcome to the **Hinga Agriculture Management Platform**, a comprehensive solution designed to empower farmers, admins, and agricultural officers with tools for efficient farm management, financial tracking, and resource access. This project includes both a **frontend** (built with Vite, React, and Shadcn/UI) and a **backend** (powered by Spring Boot and related technologies).

## Project Overview 📋

The Hinga Agriculture Management Platform aims to digitize and streamline agricultural processes, connecting farmers with resources, markets, and financial services. It provides a robust backend and an intuitive frontend interface for managing farm activities, crop details, and community interactions.

- **Frontend Repository**: [aine1100/agri-navigator-platform](https://github.com/aine1100/agri-navigator-platform/tree/main/public)
- **Backend Repository**: (To be linked once created)

## Table of Contents 📖
- [Key Features](#key-features-🌟)
- [Frontend Layout](#frontend-layout-💻)
- [Backend Layout](#backend-layout-🔧)
- [Technologies & Tools](#technologies--tools-🔹)
- [Getting Started](#getting-started-🚀)
- [Contributing](#contributing-🤝)
- [License](#license-📜)

## Key Features 🌟

### User Management (Authentication & Authorization) 🔐
- **Farmer Registration & Login**: Farmers can register with details (name, location, crops, etc.) and log in securely. ✅
- **Admin Panel**: Admins manage farmer accounts, approve/reject registrations, and assign roles (e.g., admin, farmer). 👨‍💼
- **Role-based Authorization**: Different permissions for Admin, Farmer, and Agricultural Officer roles. 🔒

### Farmer Profile Management 📝
- Update personal info (location, crops, contact details). ✍️
- Add farm details (size, crop types, irrigation system). 🌾
- Account settings for password and contact updates. ⚙️

### Crop Management 🌿
- **Crop Registration**: Register crops with details (type, planting season, yield estimation). 📊
- **Crop Update**: Update harvest details and status. 📈
- **Crop Market Price Info**: Admins/officers provide updated market prices. 💰

### Weather Information ☁️
- Fetch and display location-specific weather updates. 🌦️
- Send weather alerts (rain, drought) to impact crop planning. ⚠️

### Financial Management & Payments 💸
- Track transactions (sales, loans). 📊
- Enable loan applications with admin approval/rejection. 📑
- Integrate payments via M-Pesa or bank APIs. 💳

### Agricultural Resources (Training & Support) 🎓
- Access training materials, videos, and workshops. 📚
- FAQs and support from agricultural officers. ❓

### Marketplace & Product Listings 🛒
- List crops/products for sale with quantity and price. 📦
- Facilitate buyer-seller interactions and inquiries. 🤝
- Enable ratings and reviews for trustworthiness. ⭐

### Tracking & Analytics 📊
- Track farm performance (yield, growth rates, input usage). 📉
- Analytics dashboard for community insights (active farmers, crop trends). 📊

### Complaint & Feedback System 📢
- Report issues (crop diseases, pests). 🐛
- Provide feedback on resources or services. 📝
- Track and resolve complaints by admins. ✅

### Notification System 🔔
- Alerts for market changes, loan approvals, weather, and training. 📩

### Data Export & Reports 📤
- Export crop and financial data in CSV/PDF formats. 📄

### API Integration 🌐
- Integrate with payment gateways, weather services, and market databases. 🔗
- Support for a mobile app with RESTful APIs. 📱

### Admin & Agricultural Officer Dashboard 👩‍🌾
- **Admin Dashboard**: Manage users, track activities, update prices, and send notifications. 📋
- **Agricultural Officer Dashboard**: View reports, support farmers, and manage training. 📊

## Frontend Layout 💻

The frontend is structured to provide an intuitive user experience. The project directory (`public` folder) includes:

- **Files**:
  - `favicon.ico` 🌐 - Project favicon.
  - `og-image.png` 🖼️ - Open Graph image for sharing.
  - `placeholder.svg` 🖼️ - Placeholder image for UI components.

- **Components**:
  - `admin/AdminSidebar.tsx` 📂 - Sidebar navigation for admin users.
  - `farmer/FarmerSidebar.tsx` 📂 - Sidebar for farmer users.
  - `ui/FeatureCard.tsx` 🎴 - Card component for showcasing features.
  - `ui/Layout.tsx` 🖥️ - Main layout structure.
  - `ui/TestimonialCard.tsx` 🌟 - Component for testimonials.

- **Tech Stack**: Built with Vite, React, and Shadcn/UI for a modern, responsive interface. ⚛️

## Backend Layout 🔧

The backend is designed to support the frontend and mobile app with a robust API-driven architecture. Proposed directory structure:

- **Files**:
  - `application.properties` ⚙️ - Configuration file for Spring Boot.
  - `pom.xml` 📦 - Maven build file for dependencies.

- **Components**:
  - `src/main/java/com/hinga/auth/` 🔑 - Authentication and authorization logic (e.g., JWT, Spring Security).
  - `src/main/java/com/hinga/farmer/` 🌾 - Farmer profile and farm management services.
  - `src/main/java/com/hinga/crop/` 🌿 - Crop registration and market price services.
  - `src/main/java/com/hinga/weather/` ☁️ - Weather data integration and alerts.
  - `src/main/java/com/hinga/finance/` 💸 - Financial tracking and payment integration.
  - `src/main/java/com/hinga/resources/` 🎓 - Training and support services.
  - `src/main/java/com/hinga/marketplace/` 🛒 - Marketplace and product listing logic.
  - `src/main/java/com/hinga/analytics/` 📊 - Tracking and dashboard services.
  - `src/main/java/com/hinga/support/` 📢 - Complaint and feedback system.
  - `src/main/java/com/hinga/notification/` 🔔 - Notification services.
  - `src/main/java/com/hinga/export/` 📤 - Data export and report generation.
  - `src/main/java/com/hinga/api/` 🌐 - RESTful API controllers and integrations.

- **Tech Stack**: Powered by Spring Boot, JPA/Hibernate, MySQL/PostgreSQL, and more (see below). 🛠️

## Technologies & Tools 🔹
- **Spring Boot** - Core framework for the backend. 🌱
- **JPA/Hibernate** - Database interaction. 🗃️
- **MySQL/PostgreSQL** - Database storage. 💾
- **Spring Security** - User authentication and authorization. 🔒
- **JWT** - Secure API authentication. 🔐
- **Spring Boot Scheduler** - Periodic tasks (e.g., weather updates). ⏰
- **RESTful APIs** - Connects frontend and mobile apps. 🌐
- **Swagger/OpenAPI** - API documentation. 📖

## Getting Started 🚀

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/aine1100/agri-navigator-platform.git
   ```

2. **Install Dependencies**:
   - Frontend: `npm install` (in the project root).
   - Backend: `mvn install` (in the backend directory).

3. **Configure Environment**:
   - Set up database credentials in `application.properties`.
   - Add API keys for weather and payment integrations.

4. **Run the Project**:
   - Frontend: `npm run dev`.
   - Backend: `mvn spring-boot:run`.

5. **Access the App**:
   - Frontend: `http://localhost:5173`.
   - Backend API: `http://localhost:8080/api`.

## Contributing 🤝
We welcome contributions! Please fork the repository and submit a pull request with your changes. For major changes, please open an issue first to discuss.

## License 📜
This project is licensed under the MIT License. See the `LICENSE` file for details.

---

