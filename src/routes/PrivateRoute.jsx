import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSpinner } from 'react-icons/fa';

const roleHomeMap = {
  INTERESADO: '/dashboard',
  DUENO: '/dashboard',
  ANALISTA: '/dashboard',
  ADMIN: '/dashboard',
};

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, authLoading, user } = useAuth();
  const role = user?.role || 'INTERESADO';
  const roleHome = roleHomeMap[role] || '/dashboard';

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-oscuro" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={roleHome} />;
  }

  return children;
};

export default PrivateRoute;