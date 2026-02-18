import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { useAuth } from '../../context/AuthContext';
import ErrorNotification from '../../components/common/ErrorNotification';
import SuccessNotification from '../../components/common/SuccessNotification';
import ReportCard from '../../components/common/ReportCard';
import logo from '/assets/logo.png';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return 'dark';
  }
  return localStorage.getItem('preferred-theme') || 'dark';
};

const VerificactionCodePage = () => {
  const [theme, setTheme] = useState(getInitialTheme);
  const [code, setCode] = useState('');
  const { requestVerificationCode, verifyCodeAndLogin, loading, error } = useLogin();
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [notification, setNotification] = useState({ type: null, message: '', isOpen: false });
  const navigate = useNavigate();
  const location = useLocation();
  const { credentials, rememberMe, mockUser } = location.state || {};
  const { login } = useAuth();
  const isMockLogin = Boolean(credentials?.isMock && mockUser);
  const mockVerificationCode = '123456';

  const triggerNotification = useCallback((message, type = 'error') => {
    setNotification({ type, message, isOpen: true });
  }, []);

  const closeNotification = () => setNotification((prev) => ({ ...prev, isOpen: false }));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('preferred-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!credentials || !credentials.email) {
      triggerNotification('Información de sesión incompleta. Inicia sesión nuevamente.', 'error');
      const timer = setTimeout(() => navigate('/login'), 2500);
      return () => clearTimeout(timer);
    }
  }, [credentials, navigate, triggerNotification]);

  useEffect(() => {
    if (error) {
      triggerNotification(error, 'error');
    }
  }, [error, triggerNotification]);

  useEffect(() => {
    if (!secondsLeft || secondsLeft <= 0) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [secondsLeft]);

  useEffect(() => {
    if (!notification.isOpen) return;
    const timer = setTimeout(() => setNotification((prev) => ({ ...prev, isOpen: false })), 5000);
    return () => clearTimeout(timer);
  }, [notification.isOpen]);

  useEffect(() => {
    if (isMockLogin) {
      setSecondsLeft(0);
    }
  }, [isMockLogin]);

  const chartColors = useMemo(
    () =>
      theme === 'dark'
        ? {
            line: 'rgba(14,165,233,1)',
            fill: 'rgba(14,165,233,0.2)',
            axis: 'rgba(248,250,252,0.45)',
            grid: 'rgba(148,163,184,0.25)',
            tooltipBg: 'rgba(2,6,23,0.95)',
            tooltipText: '#f8fafc',
          }
        : {
            line: 'rgba(99,102,241,1)',
            fill: 'rgba(99,102,241,0.18)',
            axis: 'rgba(15,23,42,0.65)',
            grid: 'rgba(15,23,42,0.12)',
            tooltipBg: '#ffffff',
            tooltipText: '#0f172a',
          },
    [theme],
  );

  const chartData = useMemo(
    () => ({
      labels: ['Seg -30', 'Seg -20', 'Seg -10', 'Seg -5', 'Seg -2', 'Seg 0'],
      datasets: [
        {
          data: [48, 62, 70, 79, 88, 97],
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
          ticks: { color: chartColors.axis },
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

    if (!credentials || !credentials.email) {
      triggerNotification('No encontramos tus credenciales. Inicia sesión nuevamente.', 'error');
      return;
    }

    if (isMockLogin) {
      if (code !== mockVerificationCode) {
        triggerNotification('Codigo invalido. Recuerda usar 123456.', 'error');
        return;
      }
      login(`mock-${mockUser.id}`, mockUser);
      triggerNotification('Autenticacion exitosa. Redirigiendo...', 'success');
      return;
    }

    try {
      const loginPayload = {
        email: credentials.email,
        code,
      };

      const result = await verifyCodeAndLogin(loginPayload, rememberMe);
      if (result.success) {
        triggerNotification('Autenticación exitosa. Redirigiendo...', 'success');
      }
    } catch (err) {
      triggerNotification(err.response?.data?.message || 'No pudimos validar el código.', 'error');
    }
  };

  const handleResend = async () => {
    if (isMockLogin) {
      triggerNotification(`El codigo para este acceso es ${mockVerificationCode}.`, 'success');
      setResendMessage('El codigo fijo para este acceso es 123456.');
      return;
    }

    if (!credentials || !credentials.email || !credentials.password) {
      triggerNotification('No se encontraron credenciales válidas. Inicia sesión nuevamente.', 'error');
      navigate('/login');
      return;
    }

    try {
      setResendMessage('');
      setResendLoading(true);
      setSecondsLeft(30);
      const result = await requestVerificationCode(credentials);
      if (result && result.success) {
        triggerNotification(result.message || 'Código reenviado correctamente.', 'success');
        setResendMessage('Te enviamos un nuevo código a tu correo.');
      } else {
        const message = result?.message || 'No pudimos reenviar el código.';
        triggerNotification(message, 'error');
        setResendMessage(message);
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Error al reenviar el código.';
      triggerNotification(message, 'error');
      setResendMessage(message);
    } finally {
      setResendLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login', { state: { credentials } });
  };

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  const NotificationComponent = notification.type === 'success' ? SuccessNotification : ErrorNotification;

  return (
    <>
      {notification.type && (
        <NotificationComponent
          isOpen={notification.isOpen}
          message={notification.message}
          onClose={closeNotification}
        />
      )}
      <section className="relative min-h-screen bg-app-bg text-text-base overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute -top-32 left-0 w-[380px] h-[380px] rounded-full bg-brand-primary/25 blur-3xl" />
        <div className="absolute top-1/2 right-[-120px] w-[420px] h-[420px] rounded-full bg-brand-secondary/25 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-app-bg to-transparent" />
      </div>
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        <div className="w-full lg:w-1/2 px-6 lg:px-16 py-10 space-y-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="uppercase tracking-[0.35em] text-xs text-text-muted">Confirmación de identidad</p>
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
            title="Autenticación multifactor"
            description="Estado de las validaciones dinámicas"
            className="shadow-2xl overflow-hidden"
            bodyClassName="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary/10 via-transparent to-brand-primary/20" />
            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className='text-left'>
                  <p className="text-text-muted text-sm">Operaciones liberadas</p>
                  <p className="text-3xl font-semibold text-text-base">+96%</p>
                </div>
               
              </div>
              <div className="h-48">
                <Line data={chartData} options={chartOptions} />
              </div>
              <div className="flex flex-wrap gap-8 text-sm text-text-muted text-left">
                <div>
                  <p className="uppercase tracking-[0.3em] text-xs">Latencia multifactor</p>
                  <p className="text-xl font-semibold text-status-success">1.2 s</p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.3em] text-xs">Validaciones biométricas</p>
                  <p className="text-xl font-semibold text-text-base">87% usuarios</p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.3em] text-xs">Reintentos</p>
                  <p className="text-xl font-semibold text-brand-accent">3%</p>
                </div>
              </div>
            </div>
          </ReportCard>
        </div>
        <div className="w-full lg:w-1/2 px-6 lg:px-12 py-12 flex items-center justify-center">
          <div className="w-full max-w-md rounded-3xl border border-glass-border bg-glass-card backdrop-blur-2xl shadow-2xl p-8 space-y-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <img className="w-28 h-auto" src={logo} alt="logo" />
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-text-muted">Segundo factor</p>
                <h2 className="text-2xl font-semibold mt-2">Introduce tu código del autenticador</h2>
              </div>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="code" className="block mb-2 text-sm font-medium text-text-muted">
                  Código de verificación
                </label>
                <input
                  type="text"
                  name="code"
                  id="code"
                  className="border border-glass-border bg-glass-card-strong text-text-base rounded-2xl block w-full p-3 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                  placeholder="123456"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  maxLength={6}
                />
              </div>

              <button
                type="submit"
                className="w-full text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-brand-secondary/40 font-medium rounded-2xl text-base px-5 py-3 text-center"
                disabled={loading}
              >
                {loading ? <FaSpinner className="animate-spin mx-auto" /> : 'Verificar y acceder'}
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleResend}
                  className="w-full border border-glass-border text-text-base hover:bg-glass-card-strong transition-colors font-medium rounded-2xl text-sm px-5 py-3 text-center"
                  disabled={resendLoading || secondsLeft > 0}
                >
                  {resendLoading ? (
                    <FaSpinner className="animate-spin mx-auto" />
                  ) : secondsLeft > 0 ? (
                    `Reenviar código (${secondsLeft}s)`
                  ) : (
                    'Reenviar código'
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full text-text-base border border-glass-border hover:bg-glass-card-strong transition-colors font-medium rounded-2xl text-sm px-5 py-3 text-center"
                >
                  Volver al login
                </button>
              </div>

              {resendMessage && <p className="text-sm text-text-muted text-center">{resendMessage}</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default VerificactionCodePage;