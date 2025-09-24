import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import AppRoutes from './routes/AppRoutes';
import './App.css';

// Ant Design theme configuration
const theme = {
  token: {
    colorPrimary: '#4739F0',
    colorSuccess: '#FAC227',
    fontFamily: 'Montserrat, sans-serif',
  },
};

// Component to handle conditional layout based on route
const AppLayout = () => {
  const location = useLocation();

  // Define auth routes that should hide Header and Footer
  const authRoutes = ['/start', '/login', '/register', '/forgot', '/verify'];
  const isAuthRoute = authRoutes.includes(location.pathname);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!isAuthRoute && <Header />}
      <div style={{ flex: 1 }}>
        <AppRoutes />
      </div>
      {!isAuthRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <>
      <ConfigProvider theme={theme}>
        <Router>
          <AppLayout />
        </Router>
      </ConfigProvider>
    </>
  );
}

export default App;
