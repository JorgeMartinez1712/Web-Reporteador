import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useProfile from '../../hooks/useProfile';
import PasswordRequirements from '../../components/register/PasswordRequeriments';
import { FaSpinner } from 'react-icons/fa';

const VerificationCodePasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email;
  const { verifyPasswordCode, resetPassword, loading, error } = useProfile();

  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pageError, setPageError] = useState(null);
  const [passwordValidations, setPasswordValidations] = useState({
    hasUpperCase: false,
    minLength: false,
    hasNumber: false,
    passwordsMatch: false,
  });

  useEffect(() => {
    if (!emailFromState) {
      navigate('/perfil');
    }
  }, [emailFromState, navigate]);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === 'newPassword') {
      setNewPassword(value);
    } else {
      setConfirmPassword(value);
    }
    validatePassword(name === 'newPassword' ? value : newPassword, name === 'confirmPassword' ? value : confirmPassword);
  };

  const validatePassword = (pwd, confPwd) => {
    setPasswordValidations({
      hasUpperCase: /^[A-Z]/.test(pwd),
      minLength: pwd.length >= 8,
      hasNumber: /[0-9]/.test(pwd),
      passwordsMatch: pwd === confPwd && pwd !== '',
    });
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setPageError(null);
    try {
      await verifyPasswordCode(emailFromState, code);
      setStep(2);
    } catch (err) {
      setPageError(err.message || 'Error al verificar el código.');
    }
  };

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    setPageError(null);
    const allValid = Object.values(passwordValidations).every(Boolean);

    if (!allValid) {
      setPageError('Asegúrate de que la nueva contraseña cumpla con todos los requisitos.');
      return;
    }

    try {
      await resetPassword(emailFromState, newPassword, code);
      alert('¡Contraseña restablecida exitosamente! Serás redirigido al login.');
      navigate('/login');
    } catch (err) {
      setPageError(err.message || 'Error al restablecer la contraseña.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-emerald-600">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          {step === 1 ? 'Verificar Código' : 'Restablecer Contraseña'}
        </h2>

        {step === 1 && (
          <p className="text-center text-gray-600 mb-6">
            Hemos enviado un código de verificación a tu correo electrónico **{emailFromState}**. Por favor, ingrésalo a continuación.
          </p>
        )}

        {pageError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            {pageError}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleCodeSubmit} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Código de Verificación
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={code}
                onChange={handleCodeChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white transition-colors duration-200
                ${loading ? 'bg-emerald-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
            >
              {loading ? <FaSpinner className="animate-spin" /> : 'Verificar Código'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handlePasswordResetSubmit} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                Nueva Contraseña
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={handlePasswordChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handlePasswordChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <PasswordRequirements validations={passwordValidations} />
            <button
              type="submit"
              disabled={loading || !Object.values(passwordValidations).every(Boolean)}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white transition-colors duration-200
                ${loading || !Object.values(passwordValidations).every(Boolean) ? 'bg-emerald-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
            >
              {loading ? <FaSpinner className="animate-spin" /> : 'Restablecer Contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default VerificationCodePasswordPage;