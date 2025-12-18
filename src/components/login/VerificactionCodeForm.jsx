import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import useLoginUser from '../../hooks/useLoginUser';

const VerificactionCodeForm = () => {
  const [code, setCode] = useState('');
  const { requestVerificationCode, verifyCodeAndLogin, loading, error } = useLoginUser();
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const navigate = useNavigate();
  const location = useLocation();

  const { credentials, rememberMe } = location.state || {};

  useEffect(() => {
    if (!credentials || !credentials.email) {
      alert('Información de sesión incompleta. Por favor, inicia sesión de nuevo.');
      navigate('/login');
    }
  }, [credentials, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials || !credentials.email) {
      return;
    }

    try {
      const loginPayload = {
        email: credentials.email,
        code: code,
      };

      const result = await verifyCodeAndLogin(loginPayload, rememberMe);
      if (result.success) {
        navigate('/');
      }
    } catch (err) {
      console.error('Error al verificar el código:', err);
    }
  };

  const handleResend = async () => {
    if (!credentials || !credentials.email || !credentials.password) {
      alert('No se encontraron las credenciales. Por favor inicia sesión de nuevo.');
      navigate('/login');
      return;
    }

    try {
      setResendMessage(null);
      setResendLoading(true);
      setSecondsLeft(30);
      const result = await requestVerificationCode(credentials);
      if (result && result.success) {
        setResendMessage(result.message || 'Código reenviado correctamente.');
      } else {
        setResendMessage(result.message || 'No se pudo reenviar el código.');
      }
    } catch (err) {
      console.error('Error al reenviar código:', err);
      setResendMessage(err.response?.data?.message || err.message || 'Error al reenviar el código.');
    } finally {
      setResendLoading(false);
    }
  };

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

  const handleBackToLogin = () => {
    navigate('/login', { state: { credentials } });
  };

  return (
    <section className="bg-[url('/assets/fondo_login.jpg')] bg-cover bg-center h-screen flex items-center justify-center">
      <div className="w-full max-w-md rounded-lg shadow-xl border border-gray-800 p-6 bg-white/30 backdrop-blur-sm">
        <div className="flex items-center space-x-3 justify-center mb-4">
          <img
            className="w-30 h-auto"
            src="/assets/sin_bordes.png"
            alt="logo"
          />
        </div>
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center mb-6">
          Verificar Código
        </h1>
        <p className="text-center text-gray-700 mb-4">
          Hemos enviado un código de verificación a tu correo electrónico ({credentials?.email || 'email@ejemplo.com'}).
          Por favor, ingrésalo a continuación para continuar.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-900">
              Código de Verificación
            </label>
            <input
              type="text"
              name="code"
              id="code"
              className="border border-gray-800 text-gray-900 rounded-lg block w-full p-2.5 focus:outline-none"
              placeholder="Ingresa el código de 6 dígitos"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength="6"
            />
          </div>

          <button
            type="submit"
            className="w-full text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer"
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin mx-auto" /> : 'Verificar y Entrar'}
          </button>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleResend}
              className="w-full bg-white text-emerald-600 border border-emerald-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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
              className="w-full text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Volver
            </button>
          </div>

          {resendMessage && <p className="text-sm text-emerald-700 text-center mt-2">{resendMessage}</p>}
        </form>
      </div>
    </section>
  );
};

export default VerificactionCodeForm;