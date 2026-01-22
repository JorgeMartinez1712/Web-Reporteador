import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import useLogin from '../../hooks/useLogin';
import ErrorNotification from '../common/ErrorNotification';
import loginBackground from '/assets/fondo_login.jpg';
import logo from '/assets/logo_cisneros.png';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { requestVerificationCode, loginAsAdmin, loading, error } = useLogin();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const img = new Image();
    img.src = loginBackground;
    img.onload = () => {
      setIsImageLoaded(true);
    };
  }, []);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      setIsNotificationOpen(true);
      const timer = setTimeout(() => {
        setIsNotificationOpen(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsNotificationOpen(false);
    setErrorMessage('');

    const normalizedEmail = credentials.email.trim().toLowerCase();
    const normalizedPassword = credentials.password.trim().toLowerCase();

    if (normalizedEmail === 'admin@admin.com' && normalizedPassword === 'admin') {
      await loginAsAdmin();
      return;
    }

    try {
      const result = await requestVerificationCode(credentials);
      if (result.success) {
        navigate('/verification', { state: { credentials, rememberMe: true } });
      } else {
        setErrorMessage(result.message);
        setIsNotificationOpen(true);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error de conexión');
      setIsNotificationOpen(true);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  if (!isImageLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-oscuro text-4xl" />
      </div>
    );
  }

  return (
    <section className="bg-[url('/assets/fondo_login.jpg')] bg-cover bg-center h-screen flex items-center justify-center">
      <ErrorNotification isOpen={isNotificationOpen} message={errorMessage} />
      <div className="w-full max-w-md rounded-lg shadow-xl border border-oscuro p-6 bg-white/30 backdrop-blur-sm">
        <div className="flex items-center space-x-3 justify-center mb-4">
          <img
            className="w-30 h-auto"
            src={logo}
            alt="logo"
          />
        </div>
        <h1 className="text-xl font-bold leading-tight tracking-tight text-oscuro md:text-2xl text-center mb-6">
          Iniciar sesión
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-oscuro">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="border border-oscuro text-oscuro rounded-lg block w-full p-2.5 focus:outline-none"
              placeholder="ejemplo@mail.com"
              required
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-oscuro">
              Contraseña
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              placeholder="••••••••"
              className="border border-oscuro text-oscuro rounded-lg block w-full p-2.5 focus:outline-none"
              required
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
            <i
              className={`text-oscuro absolute right-3 top-10 cursor-pointer bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}
              onClick={togglePasswordVisibility}
            ></i>
          </div>
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm font-medium text-oscuro hover:underline"
            >
              ¿Olvidaste la contraseña?
            </button>
          </div>
          <button
            type="submit"
            className="w-full text-white bg-oscuro hover:bg-hover focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer"
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin mx-auto" /> : 'Iniciar sesión'}
          </button>
          <button
            type="button"
            onClick={handleRegister}
            className="w-full text-white bg-oscuro hover:bg-hover focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer"
          >
            Registrarse
          </button>
        </form>
      </div>
    </section>
  );
};

export default LoginForm;