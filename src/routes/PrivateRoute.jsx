import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSpinner } from 'react-icons/fa';

const roleHomeMap = {
  INTERESADO: '/home-01',
  DUENO: '/home-02',
  ANALISTA: '/home-03',
  ADMIN: '/home-04',
};

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, authLoading, user } = useAuth();
  const role = user?.role || 'INTERESADO';
  const roleHome = roleHomeMap[role] || '/home-04';

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