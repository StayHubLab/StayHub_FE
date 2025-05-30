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
