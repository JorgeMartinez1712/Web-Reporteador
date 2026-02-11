import { useLocation } from 'react-router-dom';
import ForgotPasswordPage from './ForgotPasswordPage';

const ResetPasswordPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const email = queryParams.get('email');

  return <ForgotPasswordPage initialEmail={email || ''} initialToken={token || ''} />;
};

export default ResetPasswordPage;