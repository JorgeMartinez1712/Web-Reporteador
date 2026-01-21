import { useState } from 'react';
import './App.css';
import AllRoutes from './routes/AllRoutes';
import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import Sidebar from './components/layout/SideBar/Sidebar';
import { useAuth } from './context/AuthContext';
import { useLocation } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import SuccessNotification from './components/common/SuccessNotification';

function App() {
  const [isSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
   const { isAuthenticated, authLoading, successMessage } = useAuth();
  const location = useLocation();
  const publicRoutes = ['/login', '/register', '/forgot-password', '/change-password', '/*', '/verification', '/reset-password'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  if (authLoading) {
    return <div className="flex justify-center items-center h-screen">
      <FaSpinner className="animate-spin text-4xl text-fuchsia-900" />
    </div>;
  }

  return (
    <div className="app-container">
      {!isPublicRoute && isAuthenticated && (
        <>
          <Header isSidebarOpen={isSidebarOpen} isCollapsed={isCollapsed} />
          <Sidebar
            isOpen={isSidebarOpen}
            isCollapsed={isCollapsed}
            toggleCollapse={toggleCollapse}
          />
        </>
      )}
   <main
  className={`main-content ${
    !isPublicRoute && isSidebarOpen && !isCollapsed
      ? 'ml-64'
      : !isPublicRoute && isCollapsed
      ? 'ml-16'
      : 'ml-0'
  }`}
>
  <div className="content-wrapper">
    <AllRoutes />
  </div>
</main>
      {!isPublicRoute && isAuthenticated && <Footer />}
      <SuccessNotification isOpen={!!successMessage} message={successMessage} />
    </div>
  );
}

export default App;