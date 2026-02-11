import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js';
import useLogin from '../../hooks/useLogin';
import ErrorNotification from '../../components/common/ErrorNotification';
import ReportCard from '../../components/common/ReportCard';
import logo from '/assets/logo.png';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

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

  const chartColors = useMemo(
    () =>
      theme === 'dark'
        ? {
            line: 'rgba(99,102,241,1)',
            fill: 'rgba(99,102,241,0.18)',
            axis: 'rgba(248,250,252,0.45)',
            grid: 'rgba(148,163,184,0.2)',
            tooltipBg: 'rgba(2,6,23,0.95)',
            tooltipText: '#f8fafc',
          }
        : {
            line: 'rgba(14,165,233,1)',
            fill: 'rgba(14,165,233,0.2)',
            axis: 'rgba(15,23,42,0.6)',
            grid: 'rgba(15,23,42,0.08)',
            tooltipBg: '#ffffff',
            tooltipText: '#0f172a',
          },
    [theme],
  );

  const chartData = useMemo(
    () => ({
      labels: [
        'Presupuesto',
        'Flujo de Caja',
        'Dif. Presupuesto/Flujo',
        'Mayor Analítico',
        'Estado de Resultados',
        'Mov. Bancarios',
        'Variables INPC',
        'Usuarios/Roles',
      ],
      datasets: [
        {
          data: [82, 74, 70, 65, 77, 80, 68, 72],
          borderColor: chartColors.line,
          backgroundColor: chartColors.fill,
          tension: 0.45,
          borderWidth: 2,
          pointRadius: 0,
          fill: true,
        },
      ],
    }),
    [chartColors],
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          displayColors: false,
          backgroundColor: chartColors.tooltipBg,
          titleColor: chartColors.tooltipText,
          bodyColor: chartColors.tooltipText,
          padding: 12,
          cornerRadius: 12,
        },
      },
      interaction: { intersect: false, mode: 'index' },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: chartColors.axis, font: { weight: 500 } },
        },
        y: {
          grid: { color: chartColors.grid, drawTicks: false },
          ticks: { color: chartColors.axis, callback: (value) => `${value}%` },
          border: { display: false },
        },
      },
    }),
    [chartColors],
  );

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
            <p className="uppercase tracking-[0.35em] text-xs text-text-muted">Plataforma automatizada</p>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-glass-border bg-glass-card text-sm text-text-base backdrop-blur"
            >
              <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon'} text-base`}></i>
              {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            </button>
          </div>
          <ReportCard
            title="Pulso de sincronización"
            description="Indicadores en vivo del motor de reportes"
            className="shadow-2xl overflow-hidden"
            bodyClassName="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-secondary/20" />
            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <p className="text-text-muted text-sm">Reportes sincronizados</p>
                  <p className="text-3xl font-semibold text-text-base">+240 diarios</p>
                </div>
                <div>
                  <p className="text-text-muted text-sm">Tiempo de consolidación</p>
                  <p className="text-3xl font-semibold text-brand-accent">3 min</p>
                </div>
              </div>
              <div className="h-48">
                <Line data={chartData} options={chartOptions} />
              </div>
              <div className="flex flex-wrap gap-8 text-sm text-text-muted">
                <div>
                  <p className="uppercase tracking-[0.3em] text-xs">Cobertura multimoneda</p>
                  <p className="text-xl font-semibold text-text-base">12 tipos de cambio</p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.3em] text-xs">Fuentes conectadas</p>
                  <p className="text-xl font-semibold text-status-success">8 sistemas</p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.3em] text-xs">Alertas pendientes</p>
                  <p className="text-xl font-semibold text-status-warning">1 ajuste</p>
                </div>
              </div>
            </div>
          </ReportCard>
        </div>
        <div className="w-full lg:w-1/2 px-6 lg:px-12 py-12 flex items-center justify-center">
          <div className="w-full max-w-md rounded-3xl border border-glass-border bg-glass-card backdrop-blur-2xl shadow-2xl p-8 space-y-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <img className="w-32 h-auto" src={logo} alt="logo" />
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-text-muted">Sistema automatizado</p>
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
                  placeholder="analyst@bank.com"
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