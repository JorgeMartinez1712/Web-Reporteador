const PasswordRequirements = ({ validations }) => {
  return (
    <div className="mt-2 space-y-1">
      <Requirement isValid={validations.hasUpperCase} text="Debe comenzar con una letra mayúscula" />
      <Requirement isValid={validations.minLength} text="Debe contener al menos 8 caracteres" />
      <Requirement isValid={validations.hasNumber} text="Debe contener al menos un número" />
      <Requirement isValid={validations.passwordsMatch} text="Las contraseñas deben coincidir" />
    </div>
  );
};

const Requirement = ({ isValid, text }) => (
  <div className="flex items-center space-x-2">
    <span className={`text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
      {isValid ? '✅' : '❌'}
    </span>
    <span className="text-sm text-gray-700">{text}</span>
  </div>
);

export default PasswordRequirements;