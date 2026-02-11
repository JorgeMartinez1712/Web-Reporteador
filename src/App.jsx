import { useState } from 'react';
import './App.css';
import AllRoutes from './routes/AllRoutes';
import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import Navigation from './components/layout/Navigation/Navigation';
import { useAuth } from './context/AuthContext';
import { useLocation } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import SuccessNotification from './components/common/SuccessNotification';

function App() {
  const [isSidebarOpen] = useState(true);
  const { isAuthenticated, authLoading, successMessage } = useAuth();
  const location = useLocation();
  const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/change-password', '/*', '/verification', '/reset-password'];
  const isPublicRoute = publicRoutes.includes(location.pathname);
  const showNavigation = !isPublicRoute && isAuthenticated && isSidebarOpen;

  if (authLoading) {
    return <div className="flex justify-center items-center h-screen">
      <FaSpinner className="animate-spin text-4xl text-oscuro" />
    </div>;
  }

  return (
    <div className="app-container">
      {showNavigation ? (
        <div className="min-h-screen">
          <Navigation isOpen={isSidebarOpen} />
          <div className={`flex flex-1 flex-col transition-all duration-300 ${showNavigation ? 'pl-72' : ''}`}>
            <Header />
            <main className="main-content">
              <div className="content-wrapper">
                <AllRoutes />
              </div>
            </main>
            <Footer />
          </div>
        </div>
      ) : (
        <>
          <main className="main-content">
            <div className="content-wrapper">
              <AllRoutes />
            </div>
          </main>
          {!isPublicRoute && isAuthenticated && <Footer />}
        </>
      )}
      <SuccessNotification isOpen={!!successMessage} message={successMessage} />
    </div>
  );
}

export default App;