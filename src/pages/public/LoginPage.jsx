import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import useLogin from '../../hooks/useLogin';
import ErrorNotification from '../../components/common/ErrorNotification';
import { getInstitutionalLogoByTheme } from '../../utils/themeAssets';

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return 'dark';
  }
  return localStorage.getItem('preferred-theme') || 'dark';
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { requestVerificationCode, loading, error } = useLogin();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [theme, setTheme] = useState(getInitialTheme);
  const navigate = useNavigate();

  const mockUsers = [
    {
      email: 'admin@admin.com',
      password: 'admin',
      user: { id: 'admin-001', name: 'Jorge', email: 'admin@admin.com', role: 'ADMIN' },
    },
    {
      email: 'dueno@demo.com',
      password: 'dueno',
      user: { id: 'dueno-001', name: 'Valeria', email: 'dueno@demo.com', role: 'DUENO' },
    },
    {
      email: 'analista@demo.com',
      password: 'analista',
      user: { id: 'analista-001', name: 'Luis', email: 'analista@demo.com', role: 'ANALISTA' },
    },
    {
      email: 'interesado@demo.com',
      password: 'interesado',
      user: { id: 'interesado-001', name: 'Camila', email: 'interesado@demo.com', role: 'INTERESADO' },
    },
  ];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('preferred-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      setIsNotificationOpen(true);
      const timer = setTimeout(() => setIsNotificationOpen(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const logoSrc = useMemo(() => getInstitutionalLogoByTheme(theme), [theme]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsNotificationOpen(false);
    setErrorMessage('');

    const normalizedEmail = credentials.email.trim().toLowerCase();
    const normalizedPassword = credentials.password.trim().toLowerCase();

    const mockMatch = mockUsers.find(
      (mockUser) => mockUser.email === normalizedEmail && mockUser.password === normalizedPassword,
    );
    if (mockMatch) {
      navigate('/verification', {
        state: {
          credentials: {
            email: mockMatch.user.email,
            role: mockMatch.user.role,
            isMock: true,
          },
          mockUser: mockMatch.user,
          rememberMe: true,
        },
      });
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

  return (
    <>
      <ErrorNotification
        isOpen={isNotificationOpen}
        message={errorMessage}
        onClose={() => setIsNotificationOpen(false)}
      />
      <section className="relative min-h-screen bg-app-bg text-text-base overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-32 -right-16 w-[420px] h-[420px] rounded-full bg-brand-primary/20 blur-3xl" />
          <div className="absolute top-1/3 -left-24 w-[360px] h-[360px] rounded-full bg-brand-secondary/25 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-app-bg to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        <div className="w-full lg:w-1/2 px-6 lg:px-16 py-10 space-y-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="uppercase tracking-[0.35em] text-xs text-text-muted">Inicio de sesión</p>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-glass-border bg-glass-card text-sm text-text-base backdrop-blur"
            >
              <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon'} text-base`}></i>
              {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            </button>
          </div>
          <div className="relative w-full flex-grow flex flex-col justify-center">
            <div className="relative w-full aspect-[4/3] lg:h-[500px] rounded-3xl overflow-hidden border border-glass-border/30 bg-glass-card/5 backdrop-blur-sm flex items-center justify-center p-8 group">
              {/* Background Glows */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/20 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/3 transition-all duration-1000 group-hover:bg-brand-primary/30"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-secondary/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 transition-all duration-1000 group-hover:bg-brand-secondary/30"></div>
              
              {/* Central Abstract Element */}
              <div className="relative z-10 text-center space-y-8">
                 <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary to-brand-accent blur-xl opacity-40 animate-pulse"></div>
                    <img src={logoSrc} alt="Brand Logo" className="relative w-32 h-auto opacity-90 drop-shadow-2xl grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" />
                 </div>
                 
                 <div className="space-y-2">
                    <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-text-base via-text-base to-text-muted">
                      Visión Total
                    </h2>
                    <p className="text-lg text-text-muted tracking-wide font-light">
                      El arte de simplificar tus finanzas.
                    </p>
                 </div>
              </div>

              {/* Decorative Geometric Lines */}
              <div className="absolute inset-0 border border-white/5 rounded-3xl m-4 pointer-events-none"></div>
              <div className="absolute inset-0 border border-white/5 rounded-3xl m-8 pointer-events-none opacity-50"></div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 px-6 lg:px-12 py-12 flex items-center justify-center">
          <div className="w-full max-w-md rounded-3xl border border-glass-border bg-glass-card backdrop-blur-2xl shadow-2xl p-8 space-y-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <img className="w-32 h-auto" src={logoSrc} alt="logo" />
              <div>
                <h2 className="text-2xl font-semibold mt-2">Accede al motor de reportes</h2>
              </div>
            </div>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-text-muted">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="border border-glass-border bg-glass-card-strong text-text-base placeholder:text-text-muted rounded-2xl block w-full p-3 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                  placeholder="correo@ejemplo.com"
                  required
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-text-muted">
                  Contraseña
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="border border-glass-border bg-glass-card-strong text-text-base placeholder:text-text-muted rounded-2xl block w-full p-3 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
                <i
                  className={`text-text-muted absolute right-4 top-11 cursor-pointer bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}
                  onClick={togglePasswordVisibility}
                ></i>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Sesión cifrada extremo a extremo</span>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="font-medium text-brand-secondary hover:text-brand-primary transition-colors"
                >
                  ¿Olvidaste la contraseña?
                </button>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-brand-secondary/40 font-medium rounded-2xl text-base px-5 py-3 text-center"
                disabled={loading}
              >
                {loading ? <FaSpinner className="animate-spin mx-auto" /> : 'Acceder al panel'}
              </button>
              <button
                type="button"
                onClick={handleRegister}
                className="w-full text-text-base border border-glass-border hover:bg-glass-card-strong transition-colors font-medium rounded-2xl text-base px-5 py-3 text-center"
              >
                Crear nueva cuenta
              </button>
            </form>
          </div>
        </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;