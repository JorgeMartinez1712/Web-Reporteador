import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import PasswordRequirements from '../../components/common/PasswordRequeriments';
import SuccessNotification from '../../components/common/SuccessNotification';
import ErrorNotification from '../../components/common/ErrorNotification';
import ReportCard from '../../components/common/ReportCard';
import { useAuth } from '../../context/AuthContext';
import { getInstitutionalLogoByTheme } from '../../utils/themeAssets';

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return 'dark';
  }
  return localStorage.getItem('preferred-theme') || 'dark';
};

const planOptions = [
  {
    id: 'basic',
    name: 'Basico',
    price: '$29',
    billing: 'Mensual por organizacion',
    companies: '2 empresas',
    devices: '6 dispositivos',
  },
  {
    id: 'pro',
    name: 'Profesional',
    price: '$39',
    billing: 'Mensual por organizacion',
    companies: '6 empresas',
    devices: '20 dispositivos',
  },
  {
    id: 'corp',
    name: 'Corporativo',
    price: '$79',
    billing: 'Mensual por organizacion',
    companies: '15 empresas',
    devices: '60 dispositivos',
  },
];

const mockExistingEmails = ['finanzas@galac.com', 'admin@manapro.io', 'contabilidad@empresa.com'];

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

const RegisterPage = () => {
  const { login } = useAuth();
  const location = useLocation();
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
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [sentCode, setSentCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);

  const planId = new URLSearchParams(location.search).get('plan');
  const selectedPlan = planOptions.find((plan) => plan.id === planId) || planOptions[0];

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
    if (!isNotificationOpen) return;
    const timer = setTimeout(() => setIsNotificationOpen(false), 5000);
    return () => clearTimeout(timer);
  }, [isNotificationOpen]);

  useEffect(() => {
    if (!isSuccessOpen) return;
    const timer = setTimeout(() => setIsSuccessOpen(false), 3000);
    return () => clearTimeout(timer);
  }, [isSuccessOpen]);

  const chartColors = useMemo(
    () =>
      theme === 'dark'
        ? {
            line: cssVars.brandPrimary,
            fill: withAlpha(cssVars.brandPrimary, 0.2),
            axis: cssVars.textMuted,
            grid: withAlpha(cssVars.borderSoft, 0.5),
            tooltipBg: cssVars.surfaceStrong,
            tooltipText: cssVars.textBase,
          }
        : {
            line: cssVars.brandSecondary,
            fill: withAlpha(cssVars.brandSecondary, 0.18),
            axis: cssVars.textMuted,
            grid: withAlpha(cssVars.borderSoft, 0.35),
            tooltipBg: '#ffffff',
            tooltipText: '#0e0e0e',
          },
    [theme, cssVars],
  );

  const chartConfig = useMemo(
    () => ({
      labels: ['Cifrado', 'MFA', 'Auditoría', 'Respaldo', 'Privacidad'],
      datasets: [
        {
          label: 'Nivel de Seguridad',
          data: [95, 98, 92, 96, 100],
          borderColor: chartColors.line,
          backgroundColor: chartColors.fill,
          borderWidth: 2,
          pointBackgroundColor: chartColors.line,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: chartColors.line,
          fill: true,
        },
      ],
      options: {
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
        scales: {
          r: {
            angleLines: { color: chartColors.grid },
            grid: { color: chartColors.grid },
            pointLabels: {
              color: chartColors.axis,
              font: { size: 10, weight: 600 },
            },
            ticks: { display: false, stepSize: 20 },
            suggestedMin: 0,
            suggestedMax: 100,
          },
        },
      },
    }),
    [chartColors],
  );

  const openError = (message) => {
    setErrorMessage(message);
    setIsNotificationOpen(true);
  };

  const openSuccess = (message) => {
    setSuccessMessage(message);
    setIsSuccessOpen(true);
  };

  const resetEmailVerification = () => {
    setCodeSent(false);
    setSentCode('');
    setVerificationCode('');
    setEmailVerified(false);
  };

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

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setFormData((prev) => ({ ...prev, email }));
    resetEmailVerification();
  };

  const handleSendCode = () => {
    const email = formData.email.trim().toLowerCase();
    if (!email) {
      openError('Ingresa un correo valido para enviar el codigo.');
      return;
    }

    if (!mockExistingEmails.includes(email)) {
      openError('No encontramos este correo en la plataforma.');
      return;
    }

    setSendingCode(true);
    const generatedCode = String(Math.floor(100000 + Math.random() * 900000));
    setTimeout(() => {
      setSentCode(generatedCode);
      setCodeSent(true);
      setSendingCode(false);
      openSuccess('Codigo enviado. Verifica tu bandeja de entrada.');
    }, 600);
  };

  const handleVerifyCode = () => {
    if (!codeSent) {
      openError('Primero envia el codigo de verificacion.');
      return;
    }

    if (verificationCode.length < 6) {
      openError('Ingresa el codigo completo de 6 digitos.');
      return;
    }

    setVerifyingCode(true);
    setTimeout(() => {
      if (verificationCode === sentCode) {
        setEmailVerified(true);
        openSuccess('Correo verificado correctamente.');
      } else {
        openError('Codigo incorrecto. Intenta nuevamente.');
      }
      setVerifyingCode(false);
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailVerified) {
      openError('Verifica tu correo antes de continuar.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      openSuccess('Registro completado. Redirigiendo...');
      const mockUser = {
        id: 'interesado-001',
        name: formData.name || 'Interesado',
        email: formData.email,
        role: 'INTERESADO',
        plan: selectedPlan.id,
      };
      login(`mock-interesado-${Date.now()}`, mockUser);
    }, 800);
  };

  const canSubmit =
    emailVerified &&
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
      <SuccessNotification
        isOpen={isSuccessOpen}
        message={successMessage}
        onClose={() => setIsSuccessOpen(false)}
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
              <p className="uppercase tracking-[0.35em] text-xs text-text-muted">Registro</p>
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
              title="Onboarding operativo"
              description="Seguimiento de despliegues y licenciamiento"
              className="shadow-2xl overflow-hidden"
              bodyClassName="relative"
              chartConfig={chartConfig}
              chartInitialType="radar"
              chartHeight={220}
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-secondary/10 via-transparent to-brand-primary/20 -z-10" />
              <div className="relative z-10 space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div className="text-left">
                    <p className="text-text-muted text-sm">empresas respaldadas</p>
                    <p className="text-3xl font-semibold text-text-base">12 </p>
                  </div>
                  <div className="text-left">
                    <p className="text-text-muted text-sm">Variables configuradas</p>
                    <p className="text-3xl font-semibold text-brand-accent">28 claves</p>
                  </div>
                </div>
                <div className="h-48">
                  {/* Chart rendered by ReportCard */}
                </div>
                <div className="flex flex-wrap gap-8 text-sm text-text-muted">
                  <div className="text-left">
                    <p className="uppercase tracking-[0.3em] text-xs">Modelos de licencia</p>
                    <p className="text-xl font-semibold text-status-success">3 activos</p>
                  </div>
                 
                 
                </div>
              </div>
            </ReportCard>
          </div>
          <div className="w-full lg:w-1/2 px-6 lg:px-12 py-12 flex items-center justify-center">
            <div className="w-full max-w-md rounded-3xl border border-glass-border bg-glass-card backdrop-blur-2xl shadow-2xl p-8 space-y-6">
              <div className="flex flex-col items-center gap-3 text-center">
                <img className="w-32 h-auto" src={logoSrc} alt="logo" />
                <div>
                  <h2 className="text-2xl font-semibold mt-2">Configura tu licencia y roles</h2>
                </div>
              </div>

              <div className="rounded-2xl border border-glass-border bg-glass-card-strong p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-text-muted">Plan seleccionado</p>
                    <p className="text-lg font-semibold text-text-base">{selectedPlan.name}</p>
                    <p className="text-xs text-text-muted">
                      {selectedPlan.price} · {selectedPlan.billing}
                    </p>
                  </div>
                  <Link
                    to="/"
                    className="text-xs uppercase tracking-[0.25em] text-text-muted hover:text-text-base"
                  >
                    Cambiar plan
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl border border-glass-border bg-glass-card px-3 py-2">
                    <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Empresas</p>
                    <p className="text-sm font-semibold text-text-base">{selectedPlan.companies}</p>
                  </div>
                  <div className="rounded-2xl border border-glass-border bg-glass-card px-3 py-2">
                    <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Dispositivos</p>
                    <p className="text-sm font-semibold text-text-base">{selectedPlan.devices}</p>
                  </div>
                </div>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-3 rounded-2xl border border-glass-border bg-glass-card-strong p-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-muted">
                      Correo electronico
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      maxLength="50"
                      required
                      className="border border-glass-border bg-glass-card text-text-base rounded-2xl block w-full p-3 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                      value={formData.email}
                      onChange={handleEmailChange}
                    />
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleSendCode}
                      className="flex-1 rounded-2xl border border-glass-border px-4 py-2 text-sm font-semibold text-text-base transition hover:border-brand-secondary"
                      disabled={sendingCode}
                    >
                      {sendingCode ? <FaSpinner className="animate-spin mx-auto" /> : 'Enviar codigo'}
                    </button>
                    <button
                      type="button"
                      onClick={handleVerifyCode}
                      className="flex-1 rounded-2xl bg-brand-secondary px-4 py-2 text-sm font-semibold text-text-base transition hover:bg-brand-secondary-soft"
                      disabled={verifyingCode || !codeSent}
                    >
                      {verifyingCode ? <FaSpinner className="animate-spin mx-auto" /> : 'Verificar codigo'}
                    </button>
                  </div>
                  {codeSent && (
                    <div>
                      <label htmlFor="verification" className="block text-sm font-medium text-text-muted">
                        Codigo de verificacion
                      </label>
                      <input
                        type="text"
                        id="verification"
                        name="verification"
                        maxLength={6}
                        className="border border-glass-border bg-glass-card text-text-base rounded-2xl block w-full p-3 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                        value={verificationCode}
                        onChange={(event) =>
                          setVerificationCode(event.target.value.replace(/[^0-9]/g, '').slice(0, 6))
                        }
                      />
                      <p className="mt-2 text-xs text-text-muted">Codigo demo: {sentCode}</p>
                    </div>
                  )}
                  <p className="text-xs text-text-muted">
                    {emailVerified
                      ? 'Correo validado. Puedes continuar con el registro.'
                      : 'Verifica tu correo antes de completar la informacion.'}
                  </p>
                </div>

                <div className={`space-y-4 ${emailVerified ? '' : 'opacity-70 pointer-events-none'}`}>
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
                      disabled={!emailVerified}
                      className="border border-glass-border bg-glass-card-strong text-text-base rounded-2xl block w-full p-3 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone_number" className="block text-sm font-medium text-text-muted">
                      Numero de telefono
                    </label>
                    <input
                      type="text"
                      id="phone_number"
                      name="phone_number"
                      maxLength="15"
                      required
                      disabled={!emailVerified}
                      className="border border-glass-border bg-glass-card-strong text-text-base rounded-2xl block w-full p-3 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                      value={formData.phone_number}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative">
                    <label htmlFor="password" className="block text-sm font-medium text-text-muted">
                      Contrasena
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        maxLength="50"
                        required
                        disabled={!emailVerified}
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
                      Repetir contrasena
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="password_confirmation"
                        name="password_confirmation"
                        maxLength="50"
                        required
                        disabled={!emailVerified}
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
                </div>

                <button
                  type="submit"
                  className={`w-full px-4 py-3 font-medium text-text-base rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-secondary/40 ${
                    canSubmit
                      ? 'bg-gradient-to-r from-brand-primary to-brand-secondary'
                      : 'bg-glass-card cursor-not-allowed'
                  }`}
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting ? <FaSpinner className="animate-spin mx-auto" /> : 'Crear cuenta'}
                </button>
              </form>
              <p className="text-sm font-light text-text-muted text-center">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" className="font-medium text-text-base hover:underline">
                  Inicia sesion
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RegisterPage;
