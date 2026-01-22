import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordRequirements from './PasswordRequeriments';
import useRegisterUser from '../../hooks/useRegisterUser';
import SuccessNotification from '../common/SuccessNotification';
import ErrorNotification from '../common/ErrorNotification'; 
import { FaSpinner } from 'react-icons/fa';

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', 
    email: '',
    phone_number: '', 
    password: '',
    password_confirmation: '', 
    user_type_id: 1, 
    status_id: 1 
  });
  const [passwordValidations, setPasswordValidations] = useState({
    hasUpperCase: false,
    hasNumber: false,
    minLength: false,
    passwordsMatch: false,
  });

  const { registerUser, loading, error } = useRegisterUser();

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
      const payload = {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        password: formData.password, 
        password_confirmation: formData.password_confirmation, 
        user_type_id: formData.user_type_id,
        status_id: formData.status_id
      };

      const response = await registerUser(payload);

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

  return (
    <section className="bg-[url('/assets/fondo_login.jpg')] bg-cover bg-center h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white/30 backdrop-blur-sm rounded-lg shadow-xl border border-oscuro p-6">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-oscuro md:text-2xl text-center">
          Crear una cuenta
        </h1>
        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="block text-sm font-medium text-oscuro">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              maxLength="50"
              required
              className="border border-oscuro text-oscuro rounded-lg block w-full p-2.5 focus:outline-none"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="block text-sm font-medium text-oscuro">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              maxLength="50"
              required
              className="border border-oscuro text-oscuro rounded-lg block w-full p-2.5 focus:outline-none"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone_number" className="block text-sm font-medium text-oscuro">
              Número de Teléfono
            </label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              maxLength="15"
              required
              className="border border-oscuro text-oscuro rounded-lg block w-full p-2.5 focus:outline-none"
              value={formData.phone_number}
              onChange={handleChange}
            />
          </div>
          <div className="form-group relative">
            <label htmlFor="password" className="block text-sm font-medium text-oscuro">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                maxLength="50"
                required
                className="border border-oscuro text-oscuro rounded-lg block w-full p-2.5 focus:outline-none"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-black"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
              </button>
            </div>
            <PasswordRequirements validations={passwordValidations} />
          </div>
          <div className="form-group relative">
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-oscuro">
              Repetir Contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="password_confirmation"
                name="password_confirmation"
                maxLength="50"
                required
                className="border border-oscuro text-oscuro rounded-lg block w-full p-2.5 focus:outline-none"
                value={formData.password_confirmation}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-black"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i className={`bi bi-eye${showConfirmPassword ? '-slash' : ''}`}></i>
              </button>
            </div>
          </div>
          <button
            type="submit"
            className={`w-full px-4 py-2 font-medium text-white ${passwordValidations.hasUpperCase &&
              passwordValidations.hasNumber &&
              passwordValidations.minLength &&
              passwordValidations.passwordsMatch
              ? 'bg-oscuro hover:bg-hover'
              : 'bg-oscuro cursor-not-allowed'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-claro`}
            disabled={
              !(
                passwordValidations.hasUpperCase &&
                passwordValidations.hasNumber &&
                passwordValidations.minLength &&
                passwordValidations.passwordsMatch
              ) || loading 
            }
          >
            {loading ? <FaSpinner className="animate-spin mx-auto" /> : 'Crear Cuenta'}
          </button>
        </form>
        {error && <p className="text-sm text-red-500 text-center mt-2">{error}</p>} 
        <p className="text-sm font-light text-oscuro mt-4 text-center">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="font-medium text-oscuro hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
      <SuccessNotification
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message="Usuario registrado exitosamente"
      />
      <ErrorNotification
        isOpen={!!error} 
        message={error} 
      />
    </section>
  );
};

export default RegisterForm;