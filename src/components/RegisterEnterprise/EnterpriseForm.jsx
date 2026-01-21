import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import UploadImage from '../../components/common/UploadImage';

const EnterpriseForm = ({
    formData,
    handleChange,
    handleDocTypeChange,
    handleImageSelect,
    isEditing,  
    docTypes,
    financiers,
    retailStatuses,
    currencies,
    selectedDocType,
    currentImageUrl,
}) => {
    return (
        <form className="bg-white p-8 rounded-lg max-w-full mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div>
                    <label htmlFor="rif" className="block text-sm font-medium text-gray-700 text-left">RIF</label>
                    <div className="flex">
                        <select
                            id="doc_type"
                            name="doc_type"
                            value={selectedDocType}
                            onChange={(e) => handleDocTypeChange(e.target.value)}
                            className="border border-gray-300 rounded-l-lg p-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                            disabled={!isEditing}
                        >
                            {docTypes.map(type => (
                                <option key={type.id} value={type.code}>
                                    {type.code}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            id="rif"
                            name="rif"
                            value={formData.rif}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-r-lg p-2 w-full"
                            placeholder="123456789"
                            maxLength="10"
                            required
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="legal_name" className="block text-sm font-medium text-gray-700 text-left">Razón social</label>
                    <input
                        type="text"
                        id="legal_name"
                        name="legal_name"
                        value={formData.legal_name}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                        placeholder="Empresa C.A."
                        maxLength="100"
                        required
                        disabled={!isEditing}
                    />
                </div>

                <div>
                    <label htmlFor="comercial_name" className="block text-sm font-medium text-gray-700 text-left">Nombre comercial</label>
                    <input
                        type="text"
                        id="comercial_name"
                        name="comercial_name"
                        value={formData.comercial_name}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                        placeholder="Mi Tienda"
                        maxLength="100"
                        required
                        disabled={!isEditing}
                    />
                </div>

                <div>
                    <label htmlFor="financiers_id" className="block text-sm font-medium text-gray-700 text-left">Financiero asociado</label>
                    <select
                        id="financiers_id"
                        name="financiers_id"
                        value={formData.financiers_id}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                        disabled={!isEditing}
                    >
                        <option value="">Seleccione un financiero</option>
                        {financiers && (
                            <option key={financiers.id} value={financiers.id}>
                                {financiers.legal_name || financiers.comercial_name}
                            </option>
                        )}
                    </select>
                </div>

                <div>
                    <label htmlFor="currency_id" className="block text-sm font-medium text-gray-700 text-left">Moneda</label>
                    <select
                        id="currency_id"
                        name="currency_id"
                        value={formData.currency_id}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                        required
                        disabled={!isEditing}
                    >
                        <option value="">Seleccione una moneda</option>
                        {currencies.map(currency => (
                            <option key={currency.id} value={currency.id}>
                                {currency.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 text-left">Dirección</label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm h-10 resize-none"
                        placeholder="Av. Principal, Edificio Central, Piso 5"
                        rows="1"
                        maxLength="255"
                        required
                        disabled={!isEditing}
                    />
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 text-left">Teléfono</label>
                    <PhoneInput
                        country={'ve'}
                        value={formData.phone}
                        onChange={(value) => handleChange({ target: { name: 'phone', value } })}
                        containerClass="w-full"
                        inputClass="!w-full p-2 !rounded-lg !h-10"
                        buttonClass="!border !border-gray-300 !rounded-l-lg"
                        disabled={!isEditing}
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">Correo electrónico</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                        placeholder="correo@ejemplo.com"
                        maxLength="100"
                        required
                        disabled={!isEditing}
                    />
                </div>

                <div>
                    <label htmlFor="status_id" className="block text-sm font-medium text-gray-700 text-left">Estatus</label>
                    <select
                        id="status_id"
                        name="status_id"
                        value={formData.status_id}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                        disabled={!isEditing}
                    >
                        <option value="">Seleccione un estatus</option>
                        {retailStatuses.map((status) => (
                            <option key={status.id} value={status.id}>
                                {status.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 mt-6">
                    <label htmlFor="logo_upload" className="block text-sm font-medium text-gray-700 text-left mb-2">Logo de la empresa</label>
                    <UploadImage
                        onImageSelect={handleImageSelect}
                        imageUrl={currentImageUrl}
                        className="h-48"
                        disabled={!isEditing}
                    />
                </div>
            </div>
        </form>
    );
};

export default EnterpriseForm;