import { useState, useMemo, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import useLogin from '../../hooks/useLogin';
import ErrorNotification from '../common/ErrorNotification';
import SuccessNotification from '../common/SuccessNotification';
import PasswordRequirements from '../register/PasswordRequeriments';

const ForgotPasswordForm = ({ initialEmail = '', initialToken = '' }) => {
  const initialStep = initialToken && initialEmail ? 2 : 1;
  const [step, setStep] = useState(initialStep);
  const [email, setEmail] = useState(initialEmail);
  const [token, setToken] = useState(initialToken);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmationPassword, setShowConfirmationPassword] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('error');
  const [emailSent, setEmailSent] = useState(false);

  const { requestPasswordReset, resetPassword, loading } = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialToken && initialEmail) {
      handleNotification('Ingresa tu nueva contraseña.', 'success');
    }
  }, [initialToken, initialEmail]);


  const handleNotification = (message, type = 'error') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setIsNotificationOpen(true);
    setTimeout(() => setIsNotificationOpen(false), 5000);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmationPasswordVisibility = () => setShowConfirmationPassword(!showConfirmationPassword);

  const validations = useMemo(() => {
    const hasUpperCase = /^[A-Z]/.test(password);
    const minLength = password.length >= 8;
    const hasNumber = /[0-9]/.test(password);
    const passwordsMatch = password === passwordConfirmation && password.length > 0;

    return { hasUpperCase, minLength, hasNumber, passwordsMatch };
  }, [password, passwordConfirmation]);

  const isPasswordValid = Object.values(validations).every(Boolean);

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setIsNotificationOpen(false);

    const result = await requestPasswordReset(email);

    if (result.success) {
      handleNotification('Hemos enviado un enlace de restablecimiento a tu correo. Por favor, revísalo para continuar.', 'success');
      setEmailSent(true);
    } else {
      handleNotification(result.message, 'error');
    }
  };

  const handleSubmitReset = async (e) => {
    e.preventDefault();
    setIsNotificationOpen(false);

    if (!isPasswordValid) {
      handleNotification('Asegúrate de que la nueva contraseña cumpla con todos los requisitos.', 'error');
      return;
    }

    const credentials = { email, token, password, passwordConfirmation };

    try {
      const result = await resetPassword(credentials);

      if (result.success) {
        handleNotification(result.message, 'success');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        handleNotification(result.message, 'error');
      }
    } catch (err) {
      handleNotification('Ocurrió un error al restablecer la contraseña. Revisa el código.', 'error');
    }
  };

  const NotificationComponent = notificationType === 'success' ? SuccessNotification : ErrorNotification;

  return (
    <section className="bg-[url('/assets/fondo_login.jpg')] bg-cover bg-center h-screen flex items-center justify-center">
      <NotificationComponent
        isOpen={isNotificationOpen}
        message={notificationMessage}
        onClose={() => setIsNotificationOpen(false)}
      />
      <div className="w-full max-w-md bg-white/30 backdrop-blur-sm rounded-lg shadow-xl border border-gray-800 p-6">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center mb-6">
          {step === 1 && !emailSent ? 'Recuperar Contraseña' : 'Establecer Nueva Contraseña'}
        </h1>

        {step === 1 && !emailSent ? (
          <form className="space-y-4" onSubmit={handleSubmitEmail}>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="border border-gray-800 text-gray-800 rounded-lg block w-full p-2.5 focus:outline-none"
                placeholder="ejemplo@mail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full text-white bg-fuchsia-900 hover:bg-fuchsia-950 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              disabled={loading}
            >
              {loading ? <FaSpinner className="animate-spin mx-auto" /> : 'Enviar Enlace'}
            </button>
          </form>
        ) : step === 1 && emailSent ? (
          <div className="text-center p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">¡Enlace Enviado!</h2>
            <p className="text-gray-700 mb-6">
              Hemos enviado un enlace de restablecimiento de contraseña a **{email}**. Por favor, revisa tu bandeja de entrada y haz clic en el enlace para establecer tu nueva contraseña.
            </p>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmitReset}>
            {!initialToken && (
              <div className="mb-4">
                <label htmlFor="token" className="block mb-2 text-sm font-medium text-gray-900">
                  Código de Verificación
                </label>
                <input
                  type="text"
                  id="token"
                  name="token"
                  className="border border-gray-800 text-gray-800 rounded-lg block w-full p-2.5 focus:outline-none"
                  placeholder="Código"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
              </div>
            )}

            {!initialEmail && (
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="border border-gray-800 text-gray-800 rounded-lg block w-full p-2.5 focus:outline-none"
                  placeholder="ejemplo@mail.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly={!!initialEmail}
                />
              </div>
            )}

            <div className="relative">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                Nueva Contraseña
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="••••••••"
                className="border border-gray-800 text-gray-900 rounded-lg block w-full p-2.5 focus:outline-none"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i
                className={`absolute right-3 top-10 cursor-pointer bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}
                onClick={togglePasswordVisibility}
              ></i>
            </div>
            <div className="relative">
              <label htmlFor="passwordConfirmation" className="block mb-2 text-sm font-medium text-gray-900">
                Verificar Contraseña
              </label>
              <input
                type={showConfirmationPassword ? 'text' : 'password'}
                id="passwordConfirmation"
                name="passwordConfirmation"
                placeholder="••••••••"
                className="border border-gray-800 text-gray-900 rounded-lg block w-full p-2.5 focus:outline-none"
                required
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
              <i
                className={`absolute right-3 top-10 cursor-pointer bi ${showConfirmationPassword ? 'bi-eye-slash' : 'bi-eye'}`}
                onClick={toggleConfirmationPasswordVisibility}
              ></i>
            </div>
            <PasswordRequirements validations={validations} />
            <button
              type="submit"
              className="w-full text-white bg-fuchsia-900 hover:bg-fuchsia-950 focus:ring-4 focus:outline-none focus:ring-fuchsia-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4"
              disabled={loading || !isPasswordValid}
            >
              {loading ? <FaSpinner className="animate-spin mx-auto" /> : 'Restablecer Contraseña'}
            </button>
          </form>
        )}

        <p className="text-sm font-light text-gray-500 text-center mt-4">
          ¿Recordaste tu contraseña?{' '}
          <Link to="/login" className="text-sm font-medium text-fuchsia-900 hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ForgotPasswordForm;