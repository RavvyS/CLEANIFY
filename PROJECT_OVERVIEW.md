# 🌱 CLEANIFY - Waste Management System

A comprehensive waste management platform that helps cities manage waste collection, track householders, coordinate collectors, and optimize routes.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [User Types & Roles](#-user-types--roles)
- [Features by User Role](#-features-by-user-role)
- [Core Data Models](#-core-data-models)
- [Authentication & Authorization](#-authentication--authorization)
- [API Endpoints](#-api-endpoints)
- [Waste Types Supported](#-waste-types-supported)
- [System Statuses](#-system-statuses)
- [Tech Stack](#-tech-stack)

---

## 🏗️ Project Overview

CLEANIFY is a full-stack MERN (MongoDB, Express, React, Node.js) application designed to streamline waste management operations in cities. The platform connects multiple stakeholders including administrators, dispatchers, collectors, and householders in a unified ecosystem.

---

## 👥 User Types & Roles

The system has **4 distinct user roles**, each with different access levels and permissions:

### 1️⃣ Admin
- **Role**: System Administrator
- **Access Level**: Highest (Full System Control)
- **Dashboard Route**: `/admin/dashboard`
- **Description**: Manages entire system, configurations, users, and analytics

### 2️⃣ Dispatcher
- **Role**: Operations Coordinator
- **Access Level**: High (Operations Management)
- **Dashboard Route**: `/dispatcher/dashboard`
- **Description**: Coordinates waste collection operations and manages routes

### 3️⃣ Collector
- **Role**: Field Worker
- **Access Level**: Medium (Field Operations)
- **Dashboard Route**: `/collector/dashboard`
- **Description**: Performs waste collection and updates collection records

### 4️⃣ Householder
- **Role**: Resident/Customer
- **Access Level**: Basic (Self-Service)
- **Dashboard Route**: `/householder/dashboard`
- **Description**: Submits requests, views announcements, and manages inquiries

---

## 🎯 Features by User Role

### 🔴 ADMIN Features

#### 1. City Configuration Management
- Configure city zones, waste types, and collection schedules
- Set pricing models:
  - **Flat Rate**: Fixed charge per household
  - **Weight-Based**: Charge based on waste weight
- Define base rates and recycling credits
- Set pickup frequency per zone:
  - Daily
  - Weekly
  - Bi-weekly
  - Monthly
- Manage multiple configuration versions
- Activate/deactivate city configurations

#### 2. Route Management
- Create and plan collection routes
- Assign trucks to specific routes
- Define route zones
- Track route status:
  - Scheduled
  - In Progress
  - Completed
- Optimize collection efficiency

#### 3. User Management
- Create and manage all user types:
  - Collectors
  - Dispatchers
  - Householders
  - Other Admins
- Activate/deactivate user accounts
- View user details, roles, and contact information
- Assign users to specific cities

#### 4. Announcements Management
- Create system-wide announcements
- Set announcement types:
  - **General**: Regular updates
  - **Important**: Priority information
  - **Urgent**: Critical alerts
- Set announcement expiry dates
- Activate/deactivate announcements
- View announcement history

#### 5. Dashboard Analytics
- **Total Requests Overview**: View all waste collection requests
- **Pending Requests Count**: Monitor unprocessed requests
- **Recycling Rate Tracking**: Track city-wide recycling percentage
- **Bin Fill Rate Monitoring**: Monitor average bin capacity
- **Activity Feed**: Real-time system activity
- **Insights & Recommendations**: AI-driven suggestions
- **Trend Analysis**: Visual charts and graphs

#### 6. Complete System Visibility
- View all waste requests from all users
- Access all inquiries and responses
- Monitor all collection records
- Review billing information
- Generate reports

---

### 🟡 DISPATCHER Features

#### 1. Route Coordination
- View all collection routes
- Manage route assignments
- Assign collectors to routes
- Monitor route progress in real-time
- Update route statuses

#### 2. Request Management
- View incoming waste collection requests
- Approve or reject requests
- Update request statuses
- Prioritize urgent requests
- Coordinate with collectors

#### 3. Resource Management
- Track truck availability and status:
  - Available
  - Assigned
  - Under Maintenance
- Monitor collector status and locations
- Allocate resources efficiently
- Handle emergency requests

#### 4. Dashboard Access
- View pending and active routes
- Monitor collector performance
- Track daily collection targets
- View announcements

---

### 🟢 COLLECTOR Features

#### 1. Collection Routes
- View assigned routes for the day
- Access route details:
  - Zone information
  - Pickup addresses
  - Scheduled time slots
- Navigate to bin locations
- Update route status as work progresses

#### 2. Collection Records
- Record waste collection data:
  - Waste weight
  - Waste type (general, recyclable, organic, e-waste)
  - Collection timestamp
- Log collection notes
- Mark bins as collected

#### 3. Issue Reporting
- Report bin issues:
  - **Damaged**: Bin needs repair
  - **Blocked Access**: Cannot reach bin
  - **Overflow**: Bin is overflowing
  - **Other**: Custom issues
- Add issue descriptions
- Upload photos (if implemented)
- Track issue resolution status

#### 4. Bin Status Management
- View assigned bins
- Update bin status:
  - Active
  - Maintenance
  - Damaged
- Check bin fill levels

---

### 🔵 HOUSEHOLDER Features

#### 1. Waste Collection Requests
- Submit special pickup requests
- Specify request details:
  - **Waste Type**: Plastic, Paper, Glass, Metal, Organic, Electronic
  - **Quantity**: Amount of waste
  - **Pickup Date**: Preferred collection date
  - **Address**: Pickup location
  - **Notes**: Additional information
- View request history
- Track request status:
  - Pending
  - Approved
  - Completed
  - Cancelled
- Cancel pending requests

#### 2. Announcements & Notifications
- View system announcements
- Filter by announcement type
- Get notified about:
  - Collection schedule changes
  - Service disruptions
  - Important updates
  - Urgent alerts

#### 3. Inquiries & Support
- Submit inquiries/questions
- Add subject and detailed message
- View inquiry responses from support
- Track inquiry status:
  - Pending
  - Responded
- View response history

#### 4. Billing Management *(Model exists, UI pending)*
- View monthly billing statements
- See waste breakdown by type:
  - General waste
  - Recyclable waste
  - Organic waste
  - E-waste
- Track payment status:
  - Pending
  - Paid
  - Overdue
- View recycling credits earned
- Make online payments
- Download billing history

#### 5. Personal Profile
- Update contact information
- Manage address details
- Change password
- View account activity

---

## 📊 Core Data Models

### 1. User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  address: String,
  phone: String,
  role: Enum ['admin', 'dispatcher', 'collector', 'householder'],
  cityId: String (reference to CityConfig),
  isActive: Boolean
}
```

### 2. WasteRequest Model
```javascript
{
  userId: ObjectId (reference to User),
  wasteType: Enum ['Plastic', 'Paper', 'Glass', 'Metal', 'Organic', 'Electronic'],
  quantity: Number,
  pickupDate: Date,
  address: String,
  status: Enum ['pending', 'approved', 'completed', 'cancelled'],
  notes: String
}
```

### 3. Announcement Model
```javascript
{
  title: String,
  content: String,
  type: Enum ['general', 'important', 'urgent'],
  date: Date,
  expiryDate: Date,
  isActive: Boolean
}
```

### 4. Inquiry Model
```javascript
{
  userId: ObjectId (reference to User),
  subject: String,
  message: String,
  status: Enum ['pending', 'responded'],
  response: String,
  responseDate: Date
}
```

### 5. CityConfig Model
```javascript
{
  cityId: String (unique),
  cityName: String,
  wasteTypes: Array of Strings,
  pricingModel: Enum ['flat', 'weight-based'],
  baseRate: Number,
  recyclingCredit: Number,
  pickupFrequency: Map (zone → frequency),
  version: Number,
  isActive: Boolean,
  createdBy: ObjectId (reference to User)
}
```

### 6. Route Model
```javascript
{
  truck: String,
  zones: Array of Strings,
  date: Date,
  status: Enum ['Scheduled', 'In Progress', 'Completed']
}
```

### 7. Bin Model
```javascript
{
  binId: String (unique),
  address: String,
  zone: String,
  wasteType: Enum ['general', 'recyclable', 'e-waste', 'organic'],
  status: Enum ['active', 'maintenance', 'damaged'],
  householderId: ObjectId (reference to User),
  cityId: String (reference to CityConfig)
}
```

### 8. Truck Model
```javascript
{
  truckId: String (unique),
  plateNumber: String (unique),
  capacity: Number,
  status: Enum ['available', 'assigned', 'maintenance'],
  currentLocation: String,
  cityId: String (reference to CityConfig)
}
```

### 9. CollectionRecord Model
```javascript
{
  routeId: ObjectId (reference to Route),
  binId: ObjectId (reference to Bin),
  collectorId: ObjectId (reference to User),
  householderId: ObjectId (reference to User),
  collectedAt: Date,
  wasteWeight: Number,
  wasteType: Enum ['general', 'recyclable', 'e-waste', 'organic'],
  notes: String,
  collected: Boolean,
  issue: {
    type: Enum ['damaged', 'blocked-access', 'overflow', 'other'],
    description: String,
    reportedAt: Date,
    resolved: Boolean
  },
  cityId: String (reference to CityConfig)
}
```

### 10. Billing Model
```javascript
{
  billingId: String (auto-generated, unique),
  householderId: ObjectId (reference to User),
  month: String (format: YYYY-MM),
  wasteWeight: Number,
  wasteBreakdown: {
    general: Number,
    recyclable: Number,
    organic: Number,
    eWaste: Number
  },
  baseCharge: Number,
  recyclingCredits: Number,
  totalAmount: Number (calculated: baseCharge - recyclingCredits),
  paymentStatus: Enum ['pending', 'paid', 'overdue'],
  paymentDate: Date,
  dueDate: Date,
  stripePaymentId: String,
  paymentMethod: String,
  cityId: String (reference to CityConfig)
}
```

---

## 🔐 Authentication & Authorization

### Authentication Method
- **JWT (JSON Web Token)** based authentication
- Tokens stored in localStorage on client side
- Tokens expire after 30 days
- Bearer token format in Authorization header

### Authorization Middleware

#### Available Middleware Functions:
- `protect` - Requires valid authentication token
- `adminOnly` - Admin role required
- `dispatcherOnly` - Dispatcher role required
- `collectorOnly` - Collector role required
- `householderOnly` - Householder role required
- `adminOrDispatcher` - Either admin or dispatcher role

#### Role-Based Access Control (RBAC)
Each route can be protected with specific role requirements. Users attempting to access unauthorized routes are automatically redirected to their role-specific dashboard.

### Password Security
- Passwords hashed using **bcrypt** (10 salt rounds)
- Never stored in plain text
- Minimum 6 characters required

### Account Status
- Accounts can be activated/deactivated by admins
- Inactive accounts cannot log in
- Deactivated users receive appropriate error message

---

## 🌐 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` - Register new user (Public)
- `POST /api/auth/login` - Login user (Public)
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### Waste Request Routes (`/api/requests`)
- `POST /api/requests` - Create waste request (Protected)
- `GET /api/requests` - Get all waste requests (Protected)
- `GET /api/requests/:id` - Get specific waste request (Protected)
- `PUT /api/requests/:id` - Update waste request (Protected)
- `DELETE /api/requests/:id` - Delete waste request (Protected)
- `GET /api/requests/user/:userId` - Get user's waste requests (Protected)

### Announcement Routes (`/api/announcements`)
- `POST /api/announcements` - Create announcement (Admin)
- `GET /api/announcements` - Get all announcements (Protected)
- `GET /api/announcements/:id` - Get specific announcement (Protected)
- `PUT /api/announcements/:id` - Update announcement (Admin)
- `DELETE /api/announcements/:id` - Delete announcement (Admin)
- `GET /api/announcements/recent/five` - Get recent 5 announcements (Protected)

### Inquiry Routes (`/api/inquiries`)
- `POST /api/inquiries` - Create inquiry (Protected)
- `GET /api/inquiries` - Get all inquiries (Protected)
- `GET /api/inquiries/:id` - Get specific inquiry (Protected)
- `PUT /api/inquiries/:id` - Respond to inquiry (Admin/Dispatcher)
- `DELETE /api/inquiries/:id` - Delete inquiry (Admin)
- `GET /api/inquiries/user/:userId` - Get user's inquiries (Protected)

### City Config Routes (`/api/configs`)
- `GET /api/configs` - Get all configurations (Admin)
- `POST /api/configs` - Create configuration (Admin)
- `GET /api/configs/:cityId` - Get active config for city (Admin)
- `PUT /api/configs/:cityId` - Update configuration (Admin)
- `PATCH /api/configs/:id` - Toggle configuration active status (Admin)
- `GET /api/configs/:cityId/versions` - Get configuration versions (Admin)

### Route Routes (`/api/routes`)
- `POST /api/routes` - Create route (Admin/Dispatcher)

---

## 🗑️ Waste Types Supported

| Waste Type | Category | Examples |
|-----------|----------|----------|
| **Plastic** | Recyclable | Bottles, containers, packaging |
| **Paper** | Recyclable | Newspapers, cardboard, office paper |
| **Glass** | Recyclable | Bottles, jars, containers |
| **Metal** | Recyclable | Cans, foil, scrap metal |
| **Organic** | Compostable | Food waste, yard waste |
| **Electronic** | E-Waste | Electronics, batteries, appliances |

---

## 📊 System Statuses

### Waste Request Status
- **Pending** 🟡 - Awaiting approval from dispatcher
- **Approved** 🟢 - Approved and scheduled for collection
- **Completed** ✅ - Collection completed successfully
- **Cancelled** ❌ - Request cancelled by user or admin

### Route Status
- **Scheduled** 📅 - Route planned but not started
- **In Progress** 🚛 - Collection in progress
- **Completed** ✅ - Route completed

### Bin Status
- **Active** 🟢 - Bin is operational
- **Maintenance** 🟡 - Bin under maintenance
- **Damaged** 🔴 - Bin needs repair

### Truck Status
- **Available** 🟢 - Ready for assignment
- **Assigned** 🚛 - Currently on a route
- **Maintenance** 🔧 - Under maintenance

### Payment Status
- **Pending** 🟡 - Payment not yet made
- **Paid** ✅ - Payment completed
- **Overdue** 🔴 - Payment past due date

### Inquiry Status
- **Pending** 🟡 - Awaiting response
- **Responded** ✅ - Response provided

### Announcement Type
- **General** ℹ️ - Regular information
- **Important** ⚠️ - Priority information
- **Urgent** 🚨 - Critical alerts

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Material-UI (MUI)** - UI component library
- **Axios** - HTTP client
- **React Toastify** - Toast notifications
- **Context API** - State management (AuthContext)

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT (jsonwebtoken)** - Authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables
- **CORS** - Cross-origin resource sharing

### Development Tools
- **ESLint** - Code linting
- **Git** - Version control

### Planned Integrations *(Not yet implemented)*
- **Stripe** - Payment processing
- **Google Maps API** - Route optimization
- **Socket.io** - Real-time updates

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CLEANIFY
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   
   # Create .env file
   # Add:
   # MONGO_URI=your_mongodb_connection_string
   # JWT_SECRET=your_secret_key
   # PORT=5000
   
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Create .env file (optional)
   # Add:
   # VITE_API_URL=http://localhost:5000
   
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

---

## 👤 Default User Roles

After seeding the database (if seed script exists), you can login with different roles to test the system:

- **Admin**: Full system access
- **Dispatcher**: Operations management
- **Collector**: Field operations
- **Householder**: Customer portal

---

## 📁 Project Structure

```
CLEANIFY/
├── Backend/
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth & error handling
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   └── server.js          # Express app entry
│
└── frontend/
    ├── src/
    │   ├── components/    # React components
    │   ├── context/       # Context providers
    │   ├── pages/         # Page components
    │   ├── services/      # API services
    │   ├── App.jsx        # Main app component
    │   └── main.jsx       # Entry point
    └── public/            # Static assets
```

---

## 🔮 Future Enhancements

- [ ] Real-time tracking with GPS
- [ ] Mobile app for collectors
- [ ] Payment gateway integration (Stripe)
- [ ] Email notifications
- [ ] SMS alerts for pickups
- [ ] Advanced analytics dashboard
- [ ] Route optimization algorithms
- [ ] QR code scanning for bins
- [ ] Photo upload for issue reporting
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Export reports (PDF/Excel)

---

## 📄 License

[Add your license information here]

---

## 👥 Contributors

[Add contributor information here]

---

## 📞 Support

For support and inquiries, please contact [add contact information]

---

**Last Updated**: October 2025

