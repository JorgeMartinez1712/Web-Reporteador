import PasswordRequirements from '../register/PasswordRequeriments';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const UserForm = ({
  formData,
  handleChange,
  userTypes,
  userStatuses,
  isEditing,
  passwordValidations,
  passwordTouched,
  retails = [],
  branches = [],
  docTypes = [],
  financier = null,
}) => {
  const handleNameChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      handleChange({
        target: {
          name,
          value: value.toUpperCase()
        }
      });
    } else {
      handleChange(e);
    }
  };

  return (
    <form className="bg-white p-8 rounded-lg max-w-full mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div>
          <label htmlFor="user_type_id" className="block text-sm font-medium text-gray-700 text-left">
            Tipo de Usuario
          </label>
          <select
            id="user_type_id"
            name="user_type_id"
            value={formData.user_type_id}
            onChange={handleNameChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
            required
            disabled={true}
          >
            <option value="">Seleccione un tipo</option>
            {userTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        {parseInt(formData.user_type_id || 0, 10) === 5 ? (
          <div className="flex flex-col">
            <label htmlFor="document_number" className="block text-sm font-medium text-gray-700 text-left">Tipo y Número de Documento</label>
            <div className="flex mt-1">
              <select
                id="document_type_id"
                name="document_type_id"
                value={String(formData.document_type_id || '')}
                onChange={handleNameChange}
                className="border border-gray-300 rounded-l-md shadow-sm p-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                required
                disabled={!isEditing}
              >
                <option value="">--</option>
                {Array.isArray(docTypes) && docTypes.map((dt) => (
                  <option key={dt.id || dt.code} value={String(dt.id || dt.code)}>
                    {dt.code || dt.name || dt.description}
                  </option>
                ))}
              </select>
              <input
                type="text"
                id="document_number"
                name="document_number"
                value={formData.document_number || ''}
                onChange={handleNameChange}
                className="flex-1 border border-gray-300 rounded-r-md shadow-sm p-2 sm:text-sm focus:ring-fuchsia-500 focus:border-fuchsia-500"
                placeholder="12345678"
                maxLength="25"
                required
                disabled={!isEditing}
              />
            </div>
          </div>
        ) : null}
        {parseInt(formData.user_type_id || 0, 10) === 2 && (
          <div>
            <label htmlFor="financier_id" className="block text-sm font-medium text-gray-700 text-left">Financiero</label>
            <select
              id="financier_id"
              name="financier_id"
              value={formData.financier_id || (financier?.id ?? '')}
              onChange={handleNameChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
              disabled={!isEditing}
            >
              <option value={financier?.id || ''}>{(financier && (financier.comercial_name || financier.legal_name || financier.name)) || '--Seleccionar--'}</option>
            </select>
          </div>
        )}
        {([3,4,5].includes(parseInt(formData.user_type_id || 0, 10))) && (
          <div>
            <label htmlFor="retail_id" className="block text-sm font-medium text-gray-700 text-left">Empresa</label>
            <select
              id="retail_id"
              name="retail_id"
              value={String(formData.retail_id || '')}
              onChange={handleNameChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
              required={[3,5].includes(parseInt(formData.user_type_id || 0, 10))}
              disabled={true}
            >
              <option value="">--Seleccionar--</option>
              {Array.isArray(retails) && retails.map(r => (
                <option key={r.id} value={String(r.id)}>{r.comercial_name || r.legal_name || r.name}</option>
              ))}
            </select>
          </div>
        )}
        {([4,5].includes(parseInt(formData.user_type_id || 0, 10))) && (
          <div>
            <label htmlFor="retail_unit_id" className="block text-sm font-medium text-gray-700 text-left">Sucursal</label>
            <select
              id="retail_unit_id"
              name="retail_unit_id"
              value={String(formData.retail_unit_id || '')}
              onChange={handleNameChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
              required
              disabled={!isEditing}
            >
              <option value="">--Seleccionar--</option>
              {Array.isArray(branches) && branches.map(u => (
                <option key={u.id} value={String(u.id)}>{u.name}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-left">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleNameChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm uppercase"
            placeholder="INGRESE EL NOMBRE"
            maxLength="100"
            required
            disabled={!isEditing}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleNameChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
            placeholder="correo@ejemplo.com"
            maxLength="100"
            required
            disabled={!isEditing}
          />
        </div>
        <div>
          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 text-left">Teléfono</label>
          <PhoneInput
            country={'ve'}
            value={formData.phone_number}
            onChange={(value) => handleChange({ target: { name: 'phone_number', value } })}
            containerClass="mt-1 block w-full"
            inputClass="!w-full p-2 !rounded-md !h-10"
            buttonClass="!border !border-gray-300 !rounded-l-md"
            disabled={!isEditing}
          />
        </div>
        {parseInt(formData.user_type_id || 0, 10) === 5 && (
          <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 text-left">Dirección</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address || ''}
                onChange={handleNameChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                placeholder="Dirección completa"
                maxLength="200"
                required
                disabled={!isEditing}
              />
          </div>
        )}
        {isEditing && (
          <>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left">
                Contraseña (opcional)
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleNameChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                placeholder="Dejar vacío para no cambiar"
                maxLength="50"
              />
              {passwordTouched && <PasswordRequirements validations={passwordValidations} />}
            </div>
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 text-left">
                Confirmar Contraseña (opcional)
              </label>
              <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleNameChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                placeholder="Dejar vacío para no cambiar"
                maxLength="50"
              />
            </div>
            <div>
              <label htmlFor="status_id" className="block text-sm font-medium text-gray-700 text-left">Estatus</label>
              <select
                id="status_id"
                name="status_id"
                value={formData.status_id}
                onChange={handleNameChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                disabled={!isEditing}
              >
                <option value="">Seleccione un estatus</option>
                {userStatuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>
    </form>
  );
};

export default UserForm;