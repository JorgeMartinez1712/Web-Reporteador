import { useEffect, useMemo, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import useLogin from '../../hooks/useLogin';
import ErrorNotification from '../../components/common/ErrorNotification';
import SuccessNotification from '../../components/common/SuccessNotification';
import PasswordRequirements from '../../components/common/PasswordRequeriments';
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

const ForgotPasswordPage = ({ initialEmail = '', initialToken = '' }) => {
  const [theme, setTheme] = useState(getInitialTheme);
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

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('preferred-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (initialToken && initialEmail) {
      handleNotification('Ingresa tu nueva contraseña para restablecer los reportes.', 'success');
      setStep(2);
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
  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const validations = useMemo(() => {
    const hasUpperCase = /^[A-Z]/.test(password);
    const minLength = password.length >= 8;
    const hasNumber = /[0-9]/.test(password);
    const passwordsMatch = password === passwordConfirmation && password.length > 0;

    return { hasUpperCase, minLength, hasNumber, passwordsMatch };
  }, [password, passwordConfirmation]);

  const isPasswordValid = Object.values(validations).every(Boolean);

  const chartColors = useMemo(
    () =>
      theme === 'dark'
        ? {
            line: cssVars.brandPrimary,
            fill: withAlpha(cssVars.brandPrimary, 0.22),
            axis: cssVars.textMuted,
            grid: withAlpha(cssVars.borderSoft, 0.55),
            tooltipBg: cssVars.surfaceStrong,
            tooltipText: cssVars.textBase,
          }
        : {
            line: cssVars.brandSecondary,
            fill: withAlpha(cssVars.brandSecondary, 0.2),
            axis: cssVars.textMuted,
            grid: withAlpha(cssVars.borderSoft, 0.38),
            tooltipBg: '#ffffff',
            tooltipText: '#0e0e0e',
          },
    [theme, cssVars],
  );

  const chartConfig = useMemo(
    () => ({
      labels: ['Min 0', 'Min 10', 'Min 20', 'Min 30', 'Min 40', 'Min 50'],
      datasets: [
        {
          data: [95, 88, 76, 63, 42, 16],
          borderColor: chartColors.line,
          backgroundColor: chartColors.fill,
          tension: 0.45,
          borderWidth: 2,
          pointRadius: 0,
          fill: true,
        },
      ],
      options: {
        interaction: { intersect: false, mode: 'index' },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: chartColors.axis },
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

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setIsNotificationOpen(false);

    const result = await requestPasswordReset(email);

    if (result.success) {
      handleNotification('Enviamos instrucciones a tu correo corporativo.', 'success');
      setEmailSent(true);
    } else {
      handleNotification(result.message, 'error');
    }
  };

  const handleSubmitReset = async (e) => {
    e.preventDefault();
    setIsNotificationOpen(false);

    if (!isPasswordValid) {
      handleNotification('Asegúrate de que la nueva contraseña cumpla con los requisitos.', 'error');
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
      handleNotification('No pudimos restablecer la contraseña. Verifica el código.', 'error');
    }
  };

  const NotificationComponent = notificationType === 'success' ? SuccessNotification : ErrorNotification;

  return (
    <>
      <NotificationComponent
        isOpen={isNotificationOpen}
        message={notificationMessage}
        onClose={() => setIsNotificationOpen(false)}
      />
      <section className="relative min-h-screen bg-app-bg text-text-base overflow-hidden">
        <div className="absolute inset-0">
        <div className="absolute -top-24 right-10 w-[420px] h-[420px] rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="absolute top-1/2 -left-24 w-[320px] h-[320px] rounded-full bg-brand-secondary/25 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-app-bg to-transparent" />
      </div>
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        <div className="w-full lg:w-1/2 px-6 lg:px-16 py-10 space-y-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="uppercase tracking-[0.35em] text-xs text-text-muted">Continuidad de reportes</p>
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
            title="Recuperación de reportes"
            description="Seguimiento operativo de restablecimientos"
            className="shadow-2xl overflow-hidden"
            bodyClassName="relative"
            chartConfig={chartConfig}
            chartInitialType="line"
            chartHeight={220}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-secondary/20 -z-10" />
            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <p className="text-text-muted text-sm">Reportes recuperados</p>
                  <p className="text-3xl font-semibold text-text-base">98.2%</p>
                </div>
                <div>
                  <p className="text-text-muted text-sm">Tiempo promedio</p>
                  <p className="text-3xl font-semibold text-brand-accent">12 min</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-8 text-sm text-text-muted">
                <div>
                  <p className="uppercase tracking-[0.3em] text-xs">Integraciones verificadas</p>
                  <p className="text-xl font-semibold text-status-success">GALAC + móviles</p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.3em] text-xs">Usuarios críticos</p>
                  <p className="text-xl font-semibold text-text-base">143</p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.3em] text-xs">Alertas</p>
                  <p className="text-xl font-semibold text-status-warning">1 abierta</p>
                </div>
              </div>
            </div>
          </ReportCard>
        </div>
        <div className="w-full lg:w-1/2 px-6 lg:px-12 py-12 flex items-center justify-center">
          <div className="w-full max-w-md rounded-3xl border border-glass-border bg-glass-card backdrop-blur-2xl shadow-2xl p-8 space-y-6">
            <div className="flex flex-col items-center gap-3 text-center">
                <img className="w-28 h-auto" src={logoSrc} alt="logo" />
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-text-muted">Recuperación segura</p>
                <h2 className="text-2xl font-semibold mt-2">
                  {step === 1 && !emailSent ? 'Solicita un enlace cifrado' : 'Establece una nueva contraseña'}
                </h2>
              </div>
            </div>
            {step === 1 && !emailSent ? (
              <form className="space-y-4" onSubmit={handleSubmitEmail}>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-text-muted">
                    Correo corporativo
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="border border-glass-border bg-glass-card-strong text-text-base rounded-2xl block w-full p-3 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                    placeholder="analyst@bank.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-brand-secondary/40 font-medium rounded-2xl text-base px-5 py-3 text-center"
                  disabled={loading}
                >
                  {loading ? <FaSpinner className="animate-spin mx-auto" /> : 'Enviar enlace seguro'}
                </button>
              </form>
            ) : step === 1 && emailSent ? (
              <div className="text-center space-y-4 rounded-2xl border border-glass-border bg-glass-card-strong p-6">
                <h3 className="text-lg font-semibold text-text-base">¡Enlace enviado!</h3>
                <p className="text-text-muted">
                  Revisa <span className="font-semibold text-text-base">{email}</span> para continuar con el restablecimiento. El enlace expira en 10 minutos.
                </p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmitReset}>
                {!initialToken && (
                  <div>
                    <label htmlFor="token" className="block mb-2 text-sm font-medium text-text-muted">
                      Código de verificación
                    </label>
                    <input
                      type="text"
                      id="token"
                      name="token"
                      className="border border-glass-border bg-glass-card-strong text-text-base rounded-2xl block w-full p-3 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                      placeholder="Código"
                      required
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                    />
                  </div>
                )}

                {!initialEmail && (
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-text-muted">
                      Correo corporativo
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="border border-glass-border bg-glass-card-strong text-text-base rounded-2xl block w-full p-3 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                      placeholder="analyst@bank.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      readOnly={!!initialEmail}
                    />
                  </div>
                )}

                <div className="relative">
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-text-muted">
                    Nueva contraseña
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    className="border border-glass-border bg-glass-card-strong text-text-base rounded-2xl block w-full p-3 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <i
                    className={`absolute right-4 top-11 cursor-pointer bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-text-muted`}
                    onClick={togglePasswordVisibility}
                  ></i>
                </div>
                <div className="relative">
                  <label htmlFor="passwordConfirmation" className="block mb-2 text-sm font-medium text-text-muted">
                    Verificar contraseña
                  </label>
                  <input
                    type={showConfirmationPassword ? 'text' : 'password'}
                    id="passwordConfirmation"
                    name="passwordConfirmation"
                    placeholder="••••••••"
                    className="border border-glass-border bg-glass-card-strong text-text-base rounded-2xl block w-full p-3 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                    required
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                  />
                  <i
                    className={`absolute right-4 top-11 cursor-pointer bi ${showConfirmationPassword ? 'bi-eye-slash' : 'bi-eye'} text-text-muted`}
                    onClick={toggleConfirmationPasswordVisibility}
                  ></i>
                </div>
                <PasswordRequirements validations={validations} />
                <button
                  type="submit"
                  className="w-full text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-brand-secondary/40 font-medium rounded-2xl text-base px-5 py-3 text-center"
                  disabled={loading || !isPasswordValid}
                >
                  {loading ? <FaSpinner className="animate-spin mx-auto" /> : 'Restablecer contraseña'}
                </button>
              </form>
            )}

            <p className="text-sm font-light text-text-muted text-center">
              ¿Recordaste tu contraseña?{' '}
              <Link to="/login" className="text-sm font-medium text-text-base hover:underline">
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default ForgotPasswordPage;