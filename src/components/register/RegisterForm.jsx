import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordRequirements from './PasswordRequeriments';
import useRegisterUser from '../../hooks/useRegisterUser';
import SuccessNotification from '../common/SuccessNotification';
import ErrorNotification from '../common/ErrorNotification'; 
import { FaSpinner } from 'react-icons/fa';
import backgroundImage from '/assets/fondo_login.jpg';

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
    <section
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d1f3b]/90 via-[#0a1a30]/85 to-black/90" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 px-6 lg:px-16 py-12 min-h-screen">
        <div className="text-white max-w-xl">
          <p className="uppercase tracking-[0.3em] text-sm text-white/70 mb-4">Experiencia de registro</p>
          <h2 className="text-3xl md:text-5xl font-semibold leading-tight mb-6">
            Diseña procesos de selección colaborativos desde el primer clic.
          </h2>
          <p className="text-base md:text-lg text-white/80 leading-relaxed">
            Configura tu panel personal, comparte vacantes con tu equipo y mantén trazabilidad total del pipeline. Un registro
            te acerca a contrataciones más estratégicas.
          </p>
        </div>
        <div className="w-full max-w-md bg-white/60 border border-white/30 backdrop-blur-xl shadow-2xl rounded-2xl p-8">
          <h1 className="text-2xl font-semibold text-oscuro text-center">Crear una cuenta</h1>
          <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-oscuro">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                maxLength="50"
                required
                className="border border-oscuro/60 text-oscuro rounded-lg block w-full p-3 focus:outline-none focus:ring-2 focus:ring-claro"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-oscuro">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                maxLength="50"
                required
                className="border border-oscuro/60 text-oscuro rounded-lg block w-full p-3 focus:outline-none focus:ring-2 focus:ring-claro"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-oscuro">
                Número de Teléfono
              </label>
              <input
                type="text"
                id="phone_number"
                name="phone_number"
                maxLength="15"
                required
                className="border border-oscuro/60 text-oscuro rounded-lg block w-full p-3 focus:outline-none focus:ring-2 focus:ring-claro"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
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
                  className="border border-oscuro/60 text-oscuro rounded-lg block w-full p-3 focus:outline-none focus:ring-2 focus:ring-claro"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-oscuro"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                </button>
              </div>
              <PasswordRequirements validations={passwordValidations} />
            </div>
            <div className="relative">
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
                  className="border border-oscuro/60 text-oscuro rounded-lg block w-full p-3 focus:outline-none focus:ring-2 focus:ring-claro"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-oscuro"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <i className={`bi bi-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                </button>
              </div>
            </div>
            <button
              type="submit"
              className={`w-full px-4 py-3 font-medium text-white ${passwordValidations.hasUpperCase &&
                passwordValidations.hasNumber &&
                passwordValidations.minLength &&
                passwordValidations.passwordsMatch
                ? 'bg-oscuro hover:bg-hover'
                : 'bg-oscuro/60 cursor-not-allowed'
                } rounded-lg focus:outline-none focus:ring-4 focus:ring-claro`}
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
          {error && <p className="text-sm text-red-500 text-center mt-3">{error}</p>} 
          <p className="text-sm font-light text-oscuro mt-6 text-center">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-medium text-oscuro hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
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