import { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import UploadImage from '../common/UploadImage';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const RegisterEnterpriseForm = ({
    docTypes = [],
    initialValues = null,
    onSubmit,
    isEditing = false,
    onCancel,
    loading = false,
    currencies = []
}) => {
    const [formData, setFormData] = useState({
        rif: '',
        legal_name: '',
        comercial_name: '',
        address: '',
        phone: '',
        email: '',
    });

    const [selectedDocType, setSelectedDocType] = useState('J');
    const [selectedCurrencyId, setSelectedCurrencyId] = useState(2);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [currentIconUrl, setCurrentIconUrl] = useState('');

    useEffect(() => {
        if (isEditing && initialValues) {
            setFormData({
                rif: initialValues.rif ? initialValues.rif.substring(1) : '',
                legal_name: initialValues.legal_name || '',
                comercial_name: initialValues.comercial_name || '',
                address: initialValues.address || '',
                phone: initialValues.phone || '',
                email: initialValues.email || '',
            });
            setCurrentIconUrl(initialValues.icon_url || '');
            if (initialValues.rif && initialValues.rif.length > 0) {
                setSelectedDocType(initialValues.rif.charAt(0));
            }
            if (initialValues.currency_id) {
                setSelectedCurrencyId(initialValues.currency_id);
            }
        } else {
            setFormData({
                rif: '',
                legal_name: '',
                comercial_name: '',
                address: '',
                phone: '',
                email: '',
            });
            setCurrentIconUrl('');
            setSelectedImageFile(null);
            setSelectedDocType('J');
            setSelectedCurrencyId(2);
        }
    }, [isEditing, initialValues]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'rif') {
            const re = /^[0-9-]*$/;
            if (value === '' || re.test(value)) {
                setFormData((prev) => ({ ...prev, [name]: value }));
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handlePhoneChange = (value) => {
        setFormData((prev) => ({ ...prev, phone: value }));
    };

    const handleDocTypeChange = (e) => {
        setSelectedDocType(e.target.value);
    };

    const handleCurrencyChange = (e) => {
        setSelectedCurrencyId(Number(e.target.value));
    };

    const handleImageSelect = (file) => {
        setSelectedImageFile(file);
        if (file) {
            setCurrentIconUrl(URL.createObjectURL(file));
        } else {
            setCurrentIconUrl(initialValues?.icon_url || '');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const docType = docTypes.find(doc => doc.code === selectedDocType);
        const docTypeId = docType ? docType.id : null;

        const data = new FormData();

        if (isEditing && initialValues) {
            data.append('id', initialValues.id);
        }

        data.append('tipodoc', docTypeId);
        data.append('rif', `${selectedDocType}${formData.rif}`);
        data.append('legal_name', formData.legal_name);
        data.append('comercial_name', formData.comercial_name);
        data.append('financiers_id', '1');
        data.append('address', formData.address);
        data.append('phone', formData.phone);
        data.append('email', formData.email);
        data.append('currency_id', selectedCurrencyId);

        if (selectedImageFile) {
            data.append('icon_url', selectedImageFile);
        }

        if (onSubmit) {
            await onSubmit(data);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center justify-center px-8">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
                <div className="flex flex-col">
                    <label htmlFor="rif" className="text-sm font-medium text-gray-700">RIF <span className="text-red-500">*</span></label>
                    <div className="flex">
                        <select
                            id="doc_type"
                            name="doc_type"
                            value={selectedDocType}
                            onChange={handleDocTypeChange}
                            className="border border-gray-300 rounded-l-lg p-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                            {docTypes.map(type => (
                                <option key={type.id} value={type.code}>
                                    {type.code}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text" id="rif" name="rif" value={formData.rif} onChange={handleChange}
                            className="border border-gray-300 rounded-r-lg p-2 w-full" placeholder="123456789"
                            maxLength="10" required
                        />
                    </div>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="legal_name" className="text-sm font-medium text-gray-700">Razón social <span className="text-red-500">*</span></label>
                    <input
                        type="text" id="legal_name" name="legal_name" value={formData.legal_name} onChange={handleChange}
                        className="border border-gray-300 rounded-lg p-2 w-full" placeholder="Ej: Empresa C.A."
                        maxLength="100" required
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="comercial_name" className="text-sm font-medium text-gray-700">Nombre comercial <span className="text-red-500">*</span></label>
                    <input
                        type="text" id="comercial_name" name="comercial_name" value={formData.comercial_name} onChange={handleChange}
                        className="border border-gray-300 rounded-lg p-2 w-full" placeholder="Ej: Mi Tienda"
                        maxLength="100" required
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="address" className="text-sm font-medium text-gray-700">Dirección <span className="text-red-500">*</span></label>
                    <input
                        type="text" id="address" name="address" value={formData.address} onChange={handleChange}
                        className="border border-gray-300 rounded-lg p-2 w-full" placeholder="Ej: Av. Principal, Edificio Central, Piso 5"
                        maxLength="255" required
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700">Teléfono <span className="text-red-500">*</span></label>
                    <PhoneInput
                        country={'ve'}
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        containerClass="w-full"
                        inputClass="!w-full p-2 !rounded-lg !h-10 border border-gray-300"
                        buttonClass="!border !border-gray-300 !rounded-l-lg"
                        dropdownClass="!bg-white !text-gray-700"
                        enableSearch={true}
                        placeholder="584121234567"
                        inputProps={{
                            name: 'phone',
                            required: true,
                        }}
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Correo <span className="text-red-500">*</span></label>
                    <input
                        type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                        className="border border-gray-300 rounded-lg p-2 w-full" placeholder="Ej: correo@ejemplo.com"
                        maxLength="100" required
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="currency_id" className="text-sm font-medium text-gray-700">Moneda <span className="text-red-500">*</span></label>
                    <select
                        id="currency_id"
                        name="currency_id"
                        value={selectedCurrencyId}
                        onChange={handleCurrencyChange}
                        className="border border-gray-300 rounded-lg p-2 w-full focus:ring-emerald-500 focus:border-emerald-500"
                        required
                    >
                        {currencies.map(currency => (
                            <option key={currency.id} value={currency.id}>
                                {currency.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col md:col-span-2">
                    <label htmlFor="icon_upload" className="text-sm font-medium text-gray-700 mb-2">Logo de la empresa (Opcional)</label>
                    <UploadImage
                        onImageSelect={handleImageSelect}
                        imageUrl={currentIconUrl}
                        className="h-48"
                    />
                </div>
            </div>
            <div className="w-full flex justify-end gap-2 mt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 cursor-pointer text-sm"
                    disabled={loading}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 cursor-pointer text-sm"
                    disabled={loading}
                >
                    {loading ? <FaSpinner className="animate-spin mx-auto" /> : 'Guardar'}
                </button>
            </div>
        </form>
    );
};

export default RegisterEnterpriseForm;