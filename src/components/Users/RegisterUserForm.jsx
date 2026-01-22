import { useEffect, useMemo, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import useUsers from '../../hooks/useUsers';
import PasswordRequirements from '../register/PasswordRequeriments';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useRegisterBranch } from '../../hooks/useRegisterBranch';
import useFinancier from '../../hooks/useFinancier';
import ErrorNotification from '../common/ErrorNotification';

const RegisterUserForm = ({ onUserCreated, onCancel }) => {
    const { createUser, loading, error, userTypes } = useUsers({
        autoFetchUsers: false,
        autoFetchTypes: true,
        autoFetchStatuses: false,
    });
    const { retails, branches, fetchBranches } = useRegisterBranch({
        autoFetchRetails: true,
        autoFetchFinanciers: false,
        autoFetchUnitStatuses: false,
    });
    const { docTypes, financier } = useFinancier();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: '',
        password: '',
        password_confirmation: '',
        user_type_id: '3',
        financier_id: '1',
        retail_id: '',
        retail_unit_id: '',
        document_number: '',
        document_type_id: '',
        address: '',
    });

    const [selectedRetailId, setSelectedRetailId] = useState('');

    const [passwordValidations, setPasswordValidations] = useState({
        hasUpperCase: false,
        hasNumber: false,
        minLength: false,
        passwordsMatch: false,
    });

    const [errorMessage, setErrorMessage] = useState(null);

    const validatePassword = (password) => {
        const validations = {
            hasUpperCase: /[A-Z]/.test(password),
            hasNumber: /\d/.test(password),
            minLength: password.length >= 8,
        };
        setPasswordValidations(prev => ({
            ...prev,
            ...validations,
            passwordsMatch: password === formData.password_confirmation,
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') {
            setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (name === 'password') {
            validatePassword(value);
        }
        if (name === 'password_confirmation') {
            setPasswordValidations(prev => ({
                ...prev,
                passwordsMatch: value === formData.password,
            }));
        }

        if (name === 'retail_id') {
            setSelectedRetailId(value);
        }
    };

    const handlePhoneChange = (value) => {
        setFormData(prev => ({ ...prev, phone_number: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!(
            passwordValidations.hasUpperCase &&
            passwordValidations.hasNumber &&
            passwordValidations.minLength &&
            passwordValidations.passwordsMatch
        )) {
            alert('Por favor, asegúrate de que la contraseña cumpla con todos los requisitos.');
            return;
        }

        try {
            const payload = {
                ...formData,
                user_type_id: Number(formData.user_type_id),
                status_id: 2,
            };

            await createUser(payload);

            if (onUserCreated) {
                onUserCreated();
            }
            setFormData({
                name: '',
                email: '',
                phone_number: '',
                password: '',
                password_confirmation: '',
                user_type_id: '',
                financier_id: '1',
                retail_id: '',
                retail_unit_id: '',
                document_number: '',
                document_type_id: '',
                address: '',
            });
            setSelectedRetailId('');
        } catch (err) {
            console.error('Error al registrar usuario:', err);
            const msg = err.message || error || err.response?.data?.message || 'Error al registrar el usuario. Intenta de nuevo.';
            setErrorMessage(msg);
        }
    };

    const handleCancelClick = () => {
        if (onCancel) {
            onCancel();
        }
        setFormData({
            name: '',
            email: '',
            phone_number: '',
            password: '',
            password_confirmation: '',
            user_type_id: '',
        });
    };

    useEffect(() => {
        if (selectedRetailId) {
            fetchBranches(selectedRetailId);
        }
    }, [selectedRetailId, fetchBranches]);

    useEffect(() => {
        if (!formData.document_type_id && Array.isArray(docTypes) && docTypes.length > 0) {
            const venez = docTypes.find(dt => (
                ((dt.name || dt.description || '') + '').toLowerCase().includes('venezol') ||
                String(dt.code || '').toUpperCase() === 'V'
            ));
            if (venez) {
                const value = venez.id ?? venez.code;
                setFormData(prev => ({ ...prev, document_type_id: value }));
            }
        }
    }, [docTypes, formData.document_type_id]);

    const userType = useMemo(() => parseInt(formData.user_type_id || '0', 10), [formData.user_type_id]);

    const isTypeSystem = userType === 1;
    const isTypeFinancier = userType === 2;
    const isTypeRetail = userType === 3;
    const isTypeRetailUnit = userType === 4;
    const isTypeSeller = userType === 5;

    const isSaveDisabled = useMemo(() => {
        if (!(passwordValidations.hasUpperCase && passwordValidations.hasNumber && passwordValidations.minLength && passwordValidations.passwordsMatch)) return true;
        if (!formData.user_type_id) return true;
        if (isTypeFinancier && !formData.financier_id) return true;
        if (isTypeRetail && !formData.retail_id) return true;
        if (isTypeRetailUnit && !formData.retail_unit_id) return true;
        if (isTypeSeller) {
            if (!formData.document_number || !formData.document_type_id || !formData.address || !formData.retail_id || !formData.retail_unit_id) return true;
        }
        return false;
    }, [passwordValidations, formData, isTypeFinancier, isTypeRetail, isTypeRetailUnit, isTypeSeller]);

    return (
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center justify-center px-8 overflow-y-auto">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label htmlFor="user_type_id" className="text-sm font-medium text-gray-700">
                                Tipo de Usuario <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="user_type_id"
                                name="user_type_id"
                                value={formData.user_type_id}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-lg p-2 w-full"
                                required
                                disabled={loading || userTypes.length === 0}
                            >
                                <option value="">{loading ? 'Cargando tipos...' : '--Seleccionar--'}</option>
                                {userTypes.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                {isTypeFinancier && (
                    <div className="flex flex-col">
                        <label htmlFor="financier_id" className="text-sm font-medium text-gray-700">Financiero</label>
                        <select
                            id="financier_id"
                            name="financier_id"
                            value={formData.financier_id}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-2 w-full"
                        >
                            <option value={financier?.id || '1'}>{(financier && (financier.comercial_name || financier.legal_name || financier.name)) || 'Financiera Principal'}</option>
                        </select>
                    </div>
                )}
                {(isTypeRetail || isTypeRetailUnit || isTypeSeller) && (
                    <div className="flex flex-col">
                        <label htmlFor="retail_id" className="text-sm font-medium text-gray-700">Empresa</label>
                        <select
                            id="retail_id"
                            name="retail_id"
                            value={formData.retail_id}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-2 w-full"
                            required={isTypeRetail || isTypeSeller}
                        >
                            <option value="">--Seleccionar--</option>
                            {Array.isArray(retails) && retails.map(r => (
                                <option key={r.id} value={r.id}>{r.comercial_name || r.legal_name || r.name}</option>
                            ))}
                        </select>
                    </div>
                )}
                {(isTypeRetailUnit || isTypeSeller) && (
                    <div className="flex flex-col">
                        <label htmlFor="retail_unit_id" className="text-sm font-medium text-gray-700">Sucursal</label>
                        <select
                            id="retail_unit_id"
                            name="retail_unit_id"
                            value={formData.retail_unit_id}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-2 w-full"
                            required
                        >
                            <option value="">--Seleccionar--</option>
                            {Array.isArray(branches) && branches.map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                    </div>
                )}
                <div className="flex flex-col">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg p-2 w-full uppercase"
                        placeholder="EJ: JUAN PÉREZ"
                        maxLength="50"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Correo Electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg p-2 w-full"
                        placeholder="Ej: juan.perez@ejemplo.com"
                        maxLength="50"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="phone_number" className="text-sm font-medium text-gray-700">
                        Teléfono <span className="text-red-500">*</span>
                    </label>
                    <PhoneInput
                        country={'ve'}
                        value={formData.phone_number}
                        onChange={handlePhoneChange}
                        containerClass="w-full"
                        inputClass="!w-full p-2 !rounded-lg !h-10"
                        buttonClass="!border !border-gray-300 !rounded-l-lg"
                        inputProps={{
                            name: 'phone_number',
                            required: true,
                        }}
                    />
                </div>
                {isTypeSeller && (
                    <>
                        <div className="flex flex-col">
                            <label htmlFor="document_type_id" className="text-sm font-medium text-gray-700">Tipo de documento</label>
                            <select
                                id="document_type_id"
                                name="document_type_id"
                                value={formData.document_type_id}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-lg p-2 w-full"
                                required
                            >
                                <option value="">--Seleccionar--</option>
                                {Array.isArray(docTypes) && docTypes.map(dt => (
                                    <option key={dt.id || dt.code} value={dt.id || dt.code}>{dt.name || dt.description || dt.code}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="document_number" className="text-sm font-medium text-gray-700">Documento</label>
                            <input
                                type="text"
                                id="document_number"
                                name="document_number"
                                value={formData.document_number}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-lg p-2 w-full"
                                placeholder="12345678"
                                maxLength="25"
                                required
                            />
                        </div>
                        <div className="flex flex-col md:col-span-2">
                            <label htmlFor="address" className="text-sm font-medium text-gray-700">Dirección</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-lg p-2 w-full"
                                placeholder="Dirección completa"
                                maxLength="200"
                                required
                            />
                        </div>
                    </>
                )}
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex flex-col">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Contraseña <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg p-2 w-full"
                        placeholder="Ej: MiContraseñaSegura123"
                        maxLength="50"
                        required
                    />
                    <PasswordRequirements validations={passwordValidations} />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700">
                        Confirmar Contraseña <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg p-2 w-full"
                        placeholder="Ej: MiContraseñaSegura123"
                        maxLength="50"
                        required
                    />
                </div>
            </div>
            <div className="w-full flex justify-end gap-2 mt-4">
                {onCancel && (
                    <button
                        type="button"
                        onClick={handleCancelClick}
                        className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 cursor-pointer text-sm"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                )}
                <button
                    type="submit"
                    className="bg-oscuro text-white py-2 px-4 rounded-lg hover:bg-hover cursor-pointer text-sm"
                    disabled={isSaveDisabled || loading}
                >
                    {loading ? <FaSpinner className="animate-spin mx-auto" /> : 'Guardar'}
                </button>
            </div>
            <ErrorNotification
                isOpen={Boolean(errorMessage)}
                message={errorMessage}
                onClose={() => setErrorMessage(null)}
            />
        </form>
    );
};

export default RegisterUserForm;