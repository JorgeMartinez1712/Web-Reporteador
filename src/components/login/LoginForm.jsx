import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import useLogin from '../../hooks/useLogin';
import ErrorNotification from '../common/ErrorNotification';
import loginBackground from '/assets/fondo_login.jpg';
import logo from '/assets/logo.png';

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
    img.onload = () => setIsImageLoaded(true);
  }, []);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      setIsNotificationOpen(true);
      const timer = setTimeout(() => setIsNotificationOpen(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

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
    <section
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-slate-950/95" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 px-6 lg:px-16 py-12 min-h-screen">
        <div className="text-white max-w-xl">
          <p className="uppercase tracking-[0.3em] text-sm text-white/70 mb-4">Plataforma de reclutamiento</p>
          <h2 className="text-3xl md:text-5xl font-semibold leading-tight mb-6">
            Encuentra al candidato ideal, sin perder el enfoque.
          </h2>
          <p className="text-base md:text-lg text-white/80 leading-relaxed">
            Gestiona tus vacantes, analiza perfiles de LinkedIn y toma decisiones basadas en datos. Tu próximo gran talento
            comienza aquí.
          </p>
        </div>
        <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/10 shadow-2xl p-8 backdrop-blur-2xl text-white">
          <ErrorNotification isOpen={isNotificationOpen} message={errorMessage} />
          <div className="flex items-center justify-center mb-6">
            <img className="w-32 h-auto" src={logo} alt="logo" />
          </div>
          <h1 className="text-2xl font-semibold text-center mb-6">Iniciar sesión</h1>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-white/80">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="border border-white/20 bg-white/5 text-white placeholder-white/60 rounded-lg block w-full p-3 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                placeholder="ejemplo@mail.com"
                required
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-white/80">
                Contraseña
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                placeholder="••••••••"
                className="border border-white/20 bg-white/5 text-white placeholder-white/60 rounded-lg block w-full p-3 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                required
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
              <i
                className={`text-white absolute right-4 top-11 cursor-pointer bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}
                onClick={togglePasswordVisibility}
              ></i>
            </div>
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                ¿Olvidaste la contraseña?
              </button>
            </div>
            <button
              type="submit"
              className="w-full text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 focus:ring-4 focus:outline-none focus:ring-cyan-300/40 font-medium rounded-lg text-sm px-5 py-3 text-center"
              disabled={loading}
            >
              {loading ? <FaSpinner className="animate-spin mx-auto" /> : 'Iniciar sesión'}
            </button>
            <button
              type="button"
              onClick={handleRegister}
              className="w-full text-white border border-white/30 hover:bg-white/10 transition-colors font-medium rounded-lg text-sm px-5 py-3 text-center"
            >
              Registrarse
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;