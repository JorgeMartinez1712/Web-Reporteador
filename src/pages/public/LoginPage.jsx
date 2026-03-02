import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import useLogin from '../../hooks/useLogin';
import ErrorNotification from '../../components/common/ErrorNotification';
import ReportCard from '../../components/common/ReportCard';
import { getInstitutionalLogoByTheme } from '../../utils/themeAssets';

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return 'dark';
  }
  return localStorage.getItem('preferred-theme') || 'dark';
};

const hexToRgba = (hex, alpha = 1) => {
  const sanitized = hex.replace('#', '');
  const chunk = sanitized.length === 3 ? sanitized.split('').map((c) => c + c).join('') : sanitized;
  const int = parseInt(chunk, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const withAlpha = (color, alpha) => {
  if (!color) return `rgba(0,0,0,${alpha})`;
  const trimmed = color.trim();
  if (trimmed.startsWith('rgba(') || trimmed.startsWith('rgb(')) {
    const values = trimmed.replace(/rgba?\(|\)/g, '').split(',').map((v) => v.trim());
    const [r, g, b] = values;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return hexToRgba(trimmed, alpha);
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

  const cssVars = useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        brandPrimary: '#a30081',
        brandSecondary: '#f20587',
        brandAccent: '#f2522e',
        textMuted: 'rgba(239,239,239,0.78)',
        textBase: '#ffffff',
        borderSoft: 'rgba(255,255,255,0.12)',
        surfaceStrong: 'rgba(255,255,255,0.09)',
      };
    }
    const style = getComputedStyle(document.documentElement);
    const read = (name, fallback) => style.getPropertyValue(name).trim() || fallback;
    return {
      brandPrimary: read('--color-brand-primary', '#a30081'),
      brandSecondary: read('--color-brand-secondary', '#f20587'),
      brandAccent: read('--color-brand-accent', '#f2522e'),
      textMuted: read('--color-text-muted', 'rgba(239,239,239,0.78)'),
      textBase: read('--color-text-base', '#ffffff'),
      borderSoft: read('--color-border-soft', 'rgba(255,255,255,0.12)'),
      surfaceStrong: read('--color-surface-strong', 'rgba(255,255,255,0.09)'),
    };
  }, [theme]);

  const chartColors = useMemo(
    () =>
      theme === 'dark'
        ? {
            line: cssVars.brandPrimary,
            fill: withAlpha(cssVars.brandPrimary, 0.2),
            axis: cssVars.textMuted,
            grid: withAlpha(cssVars.borderSoft, 0.55),
            tooltipBg: cssVars.surfaceStrong,
            tooltipText: cssVars.textBase,
          }
        : {
            line: cssVars.brandSecondary,
            fill: withAlpha(cssVars.brandSecondary, 0.18),
            axis: cssVars.textMuted,
            grid: withAlpha(cssVars.borderSoft, 0.4),
            tooltipBg: '#ffffff',
            tooltipText: '#0e0e0e',
          },
    [theme, cssVars],
  );

  const chartData = useMemo(
    () => ({
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
      datasets: [
        {
          label: 'Salud Financiera',
          data: [65, 59, 80, 81, 76, 85, 92, 98],
          borderColor: chartColors.line,
          backgroundColor: chartColors.fill,
          tension: 0.45,
          borderWidth: 3,
          pointRadius: 4,
          pointBackgroundColor: chartColors.line,
          fill: true,
        },
      ],
      options: {
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
          <ReportCard
            title="Rendimiento Operativo"
            description="Promedio de optimización financiera de nuestros clientes."
            className="shadow-2xl overflow-hidden"
            bodyClassName="relative"
            chartConfig={chartData}
            chartInitialType="line"
            chartHeight={220}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-secondary/20 -z-10" />
            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-6 text-left">
                <div>
                  <p className="text-text-muted text-sm">Reportes sincronizados</p>
                  <p className="text-3xl font-semibold text-text-base">+95% de precisión</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-8 text-sm text-text-muted text-left">
                <div>
                  <p className="uppercase tracking-[0.3em] text-xs">Cobertura multimoneda</p>
                  <p className="text-xl font-semibold text-text-base">12 tipos de cambio</p>
                </div>
              </div>
            </div>
          </ReportCard>
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