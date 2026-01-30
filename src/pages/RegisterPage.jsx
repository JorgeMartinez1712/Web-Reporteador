import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import PasswordRequirements from '../components/common/PasswordRequeriments';
import useLogin from '../hooks/useLogin';
import SuccessNotification from '../components/common/SuccessNotification';
import ErrorNotification from '../components/common/ErrorNotification';
import logo from '/assets/logo.png';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return 'dark';
  }
  return localStorage.getItem('preferred-theme') || 'dark';
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(getInitialTheme);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    password_confirmation: '',
    user_type_id: 1,
    status_id: 1,
  });
  const [passwordValidations, setPasswordValidations] = useState({
    hasUpperCase: false,
    hasNumber: false,
    minLength: false,
    passwordsMatch: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { registerUser, loading, error } = useLogin();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('preferred-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      setIsNotificationOpen(true);
    }
  }, [error]);

  useEffect(() => {
    if (!isNotificationOpen) return;
    const timer = setTimeout(() => setIsNotificationOpen(false), 5000);
    return () => clearTimeout(timer);
  }, [isNotificationOpen]);

  const chartColors = useMemo(
    () =>
      theme === 'dark'
        ? {
            line: 'rgba(14,165,233,1)',
            fill: 'rgba(14,165,233,0.18)',
            axis: 'rgba(248,250,252,0.45)',
            grid: 'rgba(148,163,184,0.25)',
            tooltipBg: 'rgba(2,6,23,0.95)',
            tooltipText: '#f8fafc',
          }
        : {
            line: 'rgba(99,102,241,1)',
            fill: 'rgba(99,102,241,0.16)',
            axis: 'rgba(15,23,42,0.65)',
            grid: 'rgba(15,23,42,0.1)',
            tooltipBg: '#ffffff',
            tooltipText: '#0f172a',
          },
    [theme],
  );

  const chartData = useMemo(
    () => ({
      labels: [
        'Instancias',
        'Licencias',
        'Integraciones',
        'Monedas',
        'Variables INPC',
        'Usuarios',
      ],
      datasets: [
        {
          data: [5, 8, 6, 12, 7, 10],
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

  const validatePassword = (password) => {
    const validations = {
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      minLength: password.length >= 8,
    };

    setPasswordValidations((prev) => ({
      ...prev,
      ...validations,
      passwordsMatch: password === formData.password_confirmation,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'password') {
      validatePassword(value);
    }

    if (name === 'password_confirmation') {
      setPasswordValidations((prev) => ({
        ...prev,
        passwordsMatch: value === formData.password,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await registerUser(formData);

      if (response) {
        setIsModalOpen(true);
        setTimeout(() => {
          setIsModalOpen(false);
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Error al registrar el usuario:', err);
    }
  };

  const canSubmit =
    passwordValidations.hasUpperCase &&
    passwordValidations.hasNumber &&
    passwordValidations.minLength &&
    passwordValidations.passwordsMatch;

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <>
      <ErrorNotification
        isOpen={isNotificationOpen}
        message={errorMessage}
        onClose={() => setIsNotificationOpen(false)}
      />
      <section className="relative min-h-screen bg-app-bg text-text-base overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-32 left-10 w-[420px] h-[420px] rounded-full bg-brand-secondary/20 blur-3xl" />
          <div className="absolute top-1/3 -right-24 w-[360px] h-[360px] rounded-full bg-brand-primary/25 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-app-bg to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        <div className="w-full lg:w-1/2 px-6 lg:px-16 py-10 space-y-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="uppercase tracking-[0.35em] text-xs text-text-muted">Onboarding automatizado</p>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-glass-border bg-glass-card text-sm text-text-base backdrop-blur"
            >
              <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon'} text-base`}></i>
              {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            </button>
          </div>
          <div className="relative rounded-3xl border border-glass-border bg-glass-card p-1 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary/10 via-transparent to-brand-primary/20" />
            <div className="relative z-10 rounded-[26px] bg-glass-card backdrop-blur-2xl p-8 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <p className="text-text-muted text-sm">Instancias desplegadas</p>
                  <p className="text-3xl font-semibold text-text-base">12 sedes</p>
                </div>
                <div>
                  <p className="text-text-muted text-sm">Variables configuradas</p>
                  <p className="text-3xl font-semibold text-brand-accent">28 claves</p>
                </div>
              </div>
              <div className="h-48">
                <Line data={chartData} options={chartOptions} />
              </div>
              <div className="flex flex-wrap gap-8 text-sm text-text-muted">
                <div>
                  <p className="uppercase tracking-[0.3em] text-xs">Modelos de licencia</p>
                  <p className="text-xl font-semibold text-status-success">3 activos</p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.3em] text-xs">Integraciones</p>
                  <p className="text-xl font-semibold text-text-base">GALAC + 2 sistemas ERP</p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.3em] text-xs">Administradores</p>
                  <p className="text-xl font-semibold text-status-warning">6 pendientes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 px-6 lg:px-12 py-12 flex items-center justify-center">
          <div className="w-full max-w-md rounded-3xl border border-glass-border bg-glass-card backdrop-blur-2xl shadow-2xl p-8 space-y-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <img className="w-32 h-auto" src={logo} alt="logo" />
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-text-muted">Registro cifrado</p>
                <h2 className="text-2xl font-semibold mt-2">Configura tu licencia y roles</h2>
              </div>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-muted">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  maxLength="50"
                  required
                  className="border border-glass-border bg-glass-card-strong text-text-base rounded-2xl block w-full p-3 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-muted">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  maxLength="50"
                  required
                  className="border border-glass-border bg-glass-card-strong text-text-base rounded-2xl block w-full p-3 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-text-muted">
                  Número de teléfono
                </label>
                <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  maxLength="15"
                  required
                  className="border border-glass-border bg-glass-card-strong text-text-base rounded-2xl block w-full p-3 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                  value={formData.phone_number}
                  onChange={handleChange}
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-text-muted">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    maxLength="50"
                    required
                    className="border border-glass-border bg-glass-card-strong text-text-base rounded-2xl block w-full p-3 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-text-muted"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                  </button>
                </div>
                <PasswordRequirements validations={passwordValidations} />
              </div>
              <div className="relative">
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-text-muted">
                  Repetir contraseña
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="password_confirmation"
                    name="password_confirmation"
                    maxLength="50"
                    required
                    className="border border-glass-border bg-glass-card-strong text-text-base rounded-2xl block w-full p-3 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-text-muted"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <i className={`bi bi-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className={`w-full px-4 py-3 font-medium text-text-base ${
                  canSubmit ? 'bg-gradient-to-r from-brand-primary to-brand-secondary' : 'bg-glass-card cursor-not-allowed'
                } rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-secondary/40`}
                disabled={!canSubmit || loading}
              >
                {loading ? <FaSpinner className="animate-spin mx-auto" /> : 'Crear cuenta'}
              </button>
            </form>
            <p className="text-sm font-light text-text-muted text-center">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-medium text-text-base hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
        </div>
      </section>
      <SuccessNotification
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message="Usuario registrado exitosamente"
      />
    </>
  );
};

export default RegisterPage;