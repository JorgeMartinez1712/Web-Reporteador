import { useLocation } from 'react-router-dom';
import ForgotPasswordForm from '../../components/forgotPassword/ForgotPasswordForm';

const ResetPasswordPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const email = queryParams.get('email');

  return <ForgotPasswordForm initialEmail={email} initialToken={token} />;
};

export default ResetPasswordPage;