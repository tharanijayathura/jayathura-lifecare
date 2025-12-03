# Jayathura LifeCare - Pharmacy Management System

A comprehensive pharmacy management system with role-based access control, medicine inventory management, prescription handling, and real-time chat support.

## 🚀 Features

### Core Features
- **Role-Based Authentication**: Patient, Pharmacist, Admin, Delivery, and Super Admin roles
- **Medicine Management**: Base unit stock tracking system with packaging support
- **Grocery Management**: Pharmacy groceries and wellness products
- **Prescription Management**: Upload, verify, and process prescriptions
- **Real-time Chat**: Patient-pharmacist communication with chatbot support
- **Stock Alerts**: Low stock notifications and inventory management
- **Order Management**: Complete order processing workflow
- **User Approval System**: Super admin approval for staff accounts

### Medicine Stock System
- **Base Unit Tracking**: Tablet, Capsule, ML, Gram, Piece
- **Packaging Support**: Blister, Card, Bottle, Tube, Box, Sachet
- **Auto Calculations**: Price per unit, total units, stock value
- **Stock Alerts**: Visual indicators for low/out of stock items

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Material-UI (MUI)** for UI components
- **React Router DOM** for routing
- **Axios** for API calls
- **Context API** for state management

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **Nodemailer** for email services

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn

## 🔧 Installation

### 1. Clone the repository
```bash
git clone https://github.com/tharanijayathura/jayathura-lifecare.git
cd jayathura-lifecare
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
JWT_SECRET=your_long_random_secret_key_here
PORT=5000
ADMIN_PASSWORD=AdminPass123!
CLIENT_URL=http://localhost:5173

# Email Configuration (Optional - for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
```

### 3. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Create Super Admin

```bash
cd server
npm run seed
```

This creates a default super admin account:
- Email: `admin@jayathuralifecare.com`
- Password: `AdminPass123!`

## 🚀 Running the Application

### Start Backend Server
```bash
cd server
npm run dev
```

Server will run on `http://localhost:5000`

### Start Frontend
```bash
cd client
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
jayathura-lifecare/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # Context providers
│   │   ├── services/      # API services
│   │   └── themes/        # MUI theme configuration
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/       # Auth middleware
│   ├── utils/            # Utility functions
│   ├── scripts/          # Helper scripts
│   └── server.js         # Main server file
└── README.md
```

## 🔐 User Roles

### Patient
- Browse medicines and groceries
- Upload prescriptions
- Place orders
- Chat with pharmacists
- View order history

### Pharmacist
- Verify prescriptions
- Process orders
- View inventory
- Create stock alerts
- Chat with patients

### Admin
- Manage medicine catalog
- Manage grocery catalog
- View stock alerts
- Add/edit/delete items
- Upload product images

### Super Admin
- All admin privileges
- Approve/reject user registrations
- Manage all users

### Delivery
- View assigned orders
- Update delivery status

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/verify-reset-code` - Verify reset code
- `POST /api/auth/reset-password` - Reset password

### Medicines
- `GET /api/medicines` - Get all medicines (public)
- `GET /api/medicines/admin` - Get all medicines (admin, with alerts)
- `POST /api/medicines` - Create medicine (admin)
- `PUT /api/medicines/:id` - Update medicine (admin)
- `DELETE /api/medicines/:id` - Delete medicine (admin)
- `POST /api/medicines/:id/alert` - Create stock alert (pharmacist)
- `POST /api/medicines/:id/clear-alert` - Clear alert (admin)

### Groceries
- `GET /api/groceries` - Get all groceries (public)
- `GET /api/groceries/admin` - Get all groceries (admin)
- `POST /api/groceries` - Create grocery (admin)
- `PUT /api/groceries/:id` - Update grocery (admin)
- `DELETE /api/groceries/:id` - Delete grocery (admin)

### Admin
- `GET /api/admin/pending-users` - Get pending users (super admin)
- `POST /api/admin/approve/:userId` - Approve user (super admin)
- `POST /api/admin/reject/:userId` - Reject user (super admin)

### Chat
- `GET /api/chat/conversations` - Get conversations
- `GET /api/chat/conversation?patientId=xxx` - Get conversation
- `POST /api/chat/message` - Send message
- `PUT /api/chat/read/:chatId` - Mark as read

## 💊 Medicine Stock System

The system uses a **base unit approach** for accurate stock tracking:

### Base Units
- Tablet
- Capsule
- ML (for liquids)
- Gram (for creams)
- Piece (for devices)

### Example
**Atorvastatin 20mg**
- Base Unit: `tablet`
- Packaging: `1 card = 10 tablets`
- Admin enters: `12 packs`
- System calculates:
  - Total: `12 packs × 10 = 120 tablets`
  - Price per unit: `Rs. 65 ÷ 10 = Rs. 6.50/tablet`
  - Stock value: `Rs. 780`

### Stock Alerts
- Red indicator: Out of stock or has alert
- Orange indicator: Low stock (below minimum)
- Pharmacists can create alerts for low stock items

## 🔒 Environment Variables

### Server (.env)
```env
MONGO_URI=              # MongoDB connection string
JWT_SECRET=             # Secret key for JWT tokens
PORT=5000               # Server port
ADMIN_PASSWORD=         # Default admin password
CLIENT_URL=             # Frontend URL
SMTP_HOST=              # Email server (optional)
SMTP_PORT=              # Email port (optional)
SMTP_USER=              # Email username (optional)
SMTP_PASS=              # Email password (optional)
EMAIL_FROM=             # From email address (optional)
```

### Client (.env)
```env
VITE_API_BASE_URL=      # Backend API URL
```

## 📝 Available Scripts

### Server
```bash
npm run dev          # Start development server
npm start            # Start production server
npm run seed         # Create super admin account
npm run check-admin  # Check super admin status
```

### Client
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify `MONGO_URI` in `.env` file
- Check MongoDB Atlas network access (IP whitelist)
- Ensure database name is correct
- Remove port numbers from `mongodb+srv://` URIs

### Authentication Issues
- Ensure JWT_SECRET is set
- Check token expiration
- Verify user role and approval status

### Image Upload Issues
- Check `uploads/` directory exists
- Verify file size limits (5MB default)
- Ensure proper file permissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software for Jayathura LifeCare.

## 📞 Support

For support, email support@jayathuralifecare.com or visit the Support page in the application.

## 🎯 Roadmap

- [ ] Payment gateway integration
- [ ] SMS notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Barcode scanning
- [ ] Prescription OCR
- [ ] Automated reordering

---

**Built with ❤️ for Jayathura LifeCare**

