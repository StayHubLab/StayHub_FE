# StayHub - Smart Accommodation Platform

StayHub is a modern accommodation platform that connects landlords and tenants in an efficient and secure ecosystem. The name combines "Stay" (residing) and "Hub" (connection center), reflecting our mission to be the central platform for smart accommodation solutions.

## 🌟 Vision & Mission

**Vision:** "Redefine the way people experience renting — smarter, safer, and fully connected in the digital age."

**Mission:** "Build a smart, end-to-end rental platform that empowers users to find, rent, manage, and review boarding houses with confidence and ease."

## 💎 Core Values: HOME

- **H – Honesty:** Transparency and integrity in all information – from room reviews to rental costs
- **O – Optimization:** Optimizing user experience through technology, data, and automation
- **M – Mobility:** Flexibility and ease of use anytime, anywhere – supporting housing needs at every stage
- **E – Empowerment:** Empowering tenants and landlords to make better decisions through smart tools and transparent data

## 🎯 Target Customers

### For Tenants

- **Primary Target:** Young tenants (18-24) with low to moderate income
- **Secondary Target:** Stable tenants (25-35) and older tenants (35-55+)
- **Key Needs:**
  - Finding trustworthy rental options
  - Transparent listings with verified photos
  - Clear contracts and secure deposits
  - Easy issue reporting and resolution
  - Digital payment and management

### For Landlords

- **Primary Target:** Small to medium-scale landlords (3-20 rooms)
- **Key Needs:**
  - Efficient tenant screening
  - Automated management system
  - Digital contract and payment tracking
  - Maintenance request handling
  - Tenant evaluation system

## 🛠 Technology Stack

### Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Multer (File Upload)
- Winston (Logging)
- Jest (Testing)

### Frontend (React)

- React.js
- Redux Toolkit
- React Router
- Material-UI
- Axios
- React Query
- Jest & React Testing Library

## 📦 Installation & Setup

### Prerequisites

- Node.js >= 14.x
- MongoDB >= 4.x
- npm or yarn

### Backend Setup

1. Clone repository:

```bash
git clone https://github.com/PTienhocSE/StayHub.git
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/stayhub
JWT_SECRET=your_jwt_secret
```

4. Start development server:

```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm start
```

## 📁 Project Structure

### Backend

```
stayhub/
├── src/
│   ├── config/         # Configuration
│   ├── controllers/    # Business logic
│   ├── middlewares/    # Middleware
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   └── app.js          # Entry point
├── tests/              # Unit tests
├── uploads/            # Uploaded files
└── logs/              # Log files
```

### Frontend

```
frontend/
├── src/
│   ├── assets/        # Static files
│   ├── components/    # Reusable components
│   ├── features/      # Feature-based modules
│   ├── hooks/         # Custom hooks
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── store/         # Redux store
│   ├── utils/         # Utility functions
│   └── App.js         # Root component
└── public/            # Public assets
```

## 🔑 Core Features

### For Tenants

- Smart search with map and advanced filters
- Real-time notifications for matching rooms
- AI-powered recommendations
- 24/7 chatbot assistance
- Digital contract management
- Issue reporting and tracking
- Payment history and reminders
- Two-way review system

### For Landlords

- Multi-property management
- Automated rent collection
- Digital contract management
- Maintenance workflow
- Tenant screening and history
- Financial reporting
- Two-way review system

## 🧪 Testing

### Backend Tests

```bash
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📝 Contributing

1. Fork repository
2. Create new branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Create Pull Request

## 📄 License

This project is licensed under MIT License - see [LICENSE](LICENSE) file for details.

# StayHub Frontend

This is the frontend application for StayHub, a platform for finding and managing rental properties.

## Features

- User authentication (login/register)
- Property listing and search
- Property details view
- User profile management
- Responsive design
- Material-UI components

## Tech Stack

- React
- TypeScript
- Redux Toolkit
- Material-UI
- React Router
- Axios
- Jest
- ESLint
- Prettier

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/PTienhocSE/StayHub.git
cd stayhub/frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your environment variables:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_VERSION=v1
```

4. Start the development server:

```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run lint` - Runs ESLint
- `npm run format` - Runs Prettier

## Project Structure

```
src/
  ├── assets/        # Static assets
  ├── components/    # Reusable components
  ├── features/      # Feature-specific components
  ├── hooks/         # Custom hooks
  ├── pages/         # Page components
  ├── services/      # API services
  ├── store/         # Redux store
  ├── types/         # TypeScript types
  └── utils/         # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
