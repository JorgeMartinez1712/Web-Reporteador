import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { sha256 } from 'js-sha256';

const ADMIN_VERIFICATION_CODE = '123456';
const ADMIN_BYPASS_TOKEN = 'admin-bypass-token';
const ADMIN_BYPASS_USER = {
  id: 'admin-bypass',
  name: 'Jorge',
  email: 'admin@admin.com',
  role: 'ADMIN',
  isBypassUser: true,
};

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const requestVerificationCode = async (credentialsPayload) => {
    setLoading(true);
    setError(null);

    const { email, password } = credentialsPayload;

    try {
      const hashedPassword = sha256(password);
      const payload = {
        email: email,
        password: hashedPassword,
      };

      const response = await axiosInstance.post('/login', payload);

      if (response.data.error) {
        setLoading(false);
        setError(response.data.error);
        return { success: false, message: response.data.error };
      }

      setLoading(false);
      return { success: true, message: response.data.message };
    } catch (err) {
      console.error('Error al solicitar código de verificación:', err);
      setLoading(false);
      setError(err.response?.data?.error || 'Error al iniciar sesión. Credenciales inválidas o problema de conexión.');
      throw err;
    }
  };

  const verifyCodeAndLogin = async (credentialsPayload) => {
    setLoading(true);
    setError(null);

    const { email, code } = credentialsPayload;

    try {
      const payload = {
        email: email,
        code: code,
      };

      const response = await axiosInstance.post('/verify-code', payload);
      const { token, user } = response.data;
      const cleanToken = (typeof token === 'string' && token.includes('|')) ? token.split('|').pop() : token;
      login(cleanToken, user);
      setLoading(false);
      return { success: true, message: response.data.message };
    } catch (err) {
      console.error('Error al verificar el código:', err);
      setLoading(false);
      setError(err.response?.data?.message || 'Código inválido o expirado.');
      throw err;
    }
  };

  const registerUser = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        password: sha256(formData.password),
        password_confirmation: sha256(formData.password_confirmation),
        user_type_id: formData.user_type_id,
        status_id: formData.status_id,
      };

      const response = await axiosInstance.post('/register', payload);

      if (response.data?.error) {
        setLoading(false);
        setError(response.data.error || response.data.message || 'Error al registrar usuario.');
        return null;
      }

      setLoading(false);
      return response.data;
    } catch (err) {
      console.error('Error al registrar usuario:', err);
      setLoading(false);
      setError(err.response?.data?.message || 'Error al registrar usuario.');
      throw err;
    }
  };

  const loginAsAdmin = async () => {
    setLoading(true);
    setError(null);
    try {
      setLoading(false);
      return {
        success: true,
        adminBypassContext: {
          email: ADMIN_BYPASS_USER.email,
          isAdminBypass: true,
          verificationCode: ADMIN_VERIFICATION_CODE,
        },
      };
    } catch (err) {
      setLoading(false);
      setError('No se pudo preparar el acceso admin.');
      return { success: false, message: 'No se pudo preparar el acceso admin.' };
    }
  };

  const completeAdminBypass = async () => {
    setLoading(true);
    setError(null);
    try {
      await login(ADMIN_BYPASS_TOKEN, ADMIN_BYPASS_USER, { skipUserDetail: true });
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      setError('No se pudo finalizar la sesión de admin.');
      return { success: false, message: 'No se pudo finalizar la sesión de admin.' };
    }
  };

  const requestPasswordReset = async (email) => {
    setLoading(true);
    setError(null);

    try {
      const payload = { email };
      const response = await axiosInstance.post('/forgot-password', payload);
      setLoading(false);
      return { success: true, message: response.data.message };
    } catch (err) {
      console.error('Error al solicitar restablecimiento de contraseña:', err);
      setLoading(false);
      setError(err.response?.data?.message || 'Error al enviar la solicitud.');
      return { success: false, message: err.response?.data?.message || 'Error al enviar la solicitud.' };
    }
  };

  const resetPassword = async (credentialsPayload) => {
    setLoading(true);
    setError(null);

    const { email, token, password, passwordConfirmation } = credentialsPayload;

    try {
      const hashedPassword = sha256(password);
      const payload = {
        email: email,
        token: token,
        password: hashedPassword,
        password_confirmation: sha256(passwordConfirmation),
      };

      const response = await axiosInstance.post('/reset-password', payload);
      setLoading(false);
      return { success: true, message: response.data.message };
    } catch (err) {
      console.error('Error al restablecer contraseña:', err);
      setLoading(false);
      setError(err.response?.data?.message || 'Error al restablecer la contraseña.');
      return { success: false, message: err.response?.data?.message || 'Error al restablecer la contraseña.' };
    }
  };

  return {
    requestVerificationCode,
    verifyCodeAndLogin,
    registerUser,
    requestPasswordReset,
    resetPassword,
    loginAsAdmin,
    completeAdminBypass,
    loading,
    error,
  };
};

export default useLogin;