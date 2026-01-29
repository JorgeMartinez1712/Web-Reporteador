import { useState, useMemo, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import useLogin from '../../hooks/useLogin';
import ErrorNotification from '../common/ErrorNotification';
import SuccessNotification from '../common/SuccessNotification';
import PasswordRequirements from '../register/PasswordRequeriments';
import backgroundImage from '/assets/fondo_login.jpg';

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
    <section
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-slate-950/95" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 px-6 lg:px-16 py-12 min-h-screen text-white">
        <div className="text-white max-w-xl">
          <p className="uppercase tracking-[0.3em] text-sm text-white/70 mb-4">Recupera tu acceso</p>
          <h2 className="text-3xl md:text-5xl font-semibold leading-tight mb-6">
            Restablece tu contraseña y vuelve a impulsar cada proceso de selección.
          </h2>
          <p className="text-base md:text-lg text-white/80 leading-relaxed">
            Mantén a tu equipo alineado, retoma el análisis de candidatos y continúa tomando decisiones informadas en minutos.
          </p>
        </div>
        <div className="w-full max-w-md bg-white/10 border border-white/15 shadow-2xl rounded-2xl p-8 backdrop-blur-2xl">
          <NotificationComponent
            isOpen={isNotificationOpen}
            message={notificationMessage}
            onClose={() => setIsNotificationOpen(false)}
          />
          <h1 className="text-2xl font-semibold text-center mb-6">
            {step === 1 && !emailSent ? 'Recuperar Contraseña' : 'Establecer Nueva Contraseña'}
          </h1>

          {step === 1 && !emailSent ? (
            <form className="space-y-4" onSubmit={handleSubmitEmail}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-white/80">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="border border-white/20 bg-white/5 text-white placeholder-white/60 rounded-lg block w-full p-3 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  placeholder="ejemplo@mail.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 focus:ring-4 focus:outline-none focus:ring-cyan-300/40 font-medium rounded-lg text-sm px-5 py-3 text-center"
                disabled={loading}
              >
                {loading ? <FaSpinner className="animate-spin mx-auto" /> : 'Enviar Enlace'}
              </button>
            </form>
          ) : step === 1 && emailSent ? (
            <div className="text-center p-4">
              <h2 className="text-lg font-semibold text-white mb-4">¡Enlace Enviado!</h2>
              <p className="text-white/70 mb-6">
                Hemos enviado un enlace de restablecimiento de contraseña a <span className="font-semibold">{email}</span>. Revisa tu bandeja de
                entrada y sigue las instrucciones para continuar.
              </p>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmitReset}>
              {!initialToken && (
                <div className="mb-4">
                  <label htmlFor="token" className="block mb-2 text-sm font-medium text-white/80">
                    Código de Verificación
                  </label>
                  <input
                    type="text"
                    id="token"
                    name="token"
                    className="border border-white/20 bg-white/5 text-white placeholder-white/60 rounded-lg block w-full p-3 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                    placeholder="Código"
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                  />
                </div>
              )}

              {!initialEmail && (
                <div className="mb-4">
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-white/80">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="border border-white/20 bg-white/5 text-white placeholder-white/60 rounded-lg block w-full p-3 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                    placeholder="ejemplo@mail.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    readOnly={!!initialEmail}
                  />
                </div>
              )}

              <div className="relative">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-white/80">
                  Nueva Contraseña
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  className="border border-white/20 bg-white/5 text-white placeholder-white/60 rounded-lg block w-full p-3 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <i
                  className={`absolute right-4 top-11 cursor-pointer bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-white`}
                  onClick={togglePasswordVisibility}
                ></i>
              </div>
              <div className="relative">
                <label htmlFor="passwordConfirmation" className="block mb-2 text-sm font-medium text-white/80">
                  Verificar Contraseña
                </label>
                <input
                  type={showConfirmationPassword ? 'text' : 'password'}
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  placeholder="••••••••"
                  className="border border-white/20 bg-white/5 text-white placeholder-white/60 rounded-lg block w-full p-3 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  required
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                />
                <i
                  className={`absolute right-4 top-11 cursor-pointer bi ${showConfirmationPassword ? 'bi-eye-slash' : 'bi-eye'} text-white`}
                  onClick={toggleConfirmationPasswordVisibility}
                ></i>
              </div>
              <PasswordRequirements validations={validations} />
              <button
                type="submit"
                className="w-full text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 focus:ring-4 focus:outline-none focus:ring-cyan-300/40 font-medium rounded-lg text-sm px-5 py-3 text-center mt-2"
                disabled={loading || !isPasswordValid}
              >
                {loading ? <FaSpinner className="animate-spin mx-auto" /> : 'Restablecer Contraseña'}
              </button>
            </form>
          )}

          <p className="text-sm font-light text-white/70 text-center mt-6">
            ¿Recordaste tu contraseña?{' '}
            <Link to="/login" className="text-sm font-medium text-white hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordForm;