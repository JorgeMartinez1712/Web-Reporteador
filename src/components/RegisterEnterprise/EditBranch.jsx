import { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const EditBranch = ({
    branch,
    retails = [],
    financiers = [],
    unitStatuses = [],
    onSave,
    onCancel,
    loading,
}) => {
    const [formData, setFormData] = useState({
        retail_id: '',
        name: '',
        address: '',
        phone: '',
        email: '',
        financiers_id: '',
        status_id: '',
    });

    useEffect(() => {
        if (branch) {
            setFormData({
                retail_id: String(branch.retail_id || branch.retail?.id || ''),
                name: branch.name || '',
                address: branch.address || '',
                phone: branch.phone || '',
                email: branch.email || '',
                financiers_id: String(branch.financiers_id || branch.financier?.id || ''),
                status_id: String(branch.status_id || branch.status?.id || ''),
            });
        }
    }, [branch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (value) => {
        setFormData((prev) => ({ ...prev, phone: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSave(branch.id, {
                name: formData.name,
                address: formData.address,
                phone: formData.phone,
                email: formData.email,
                status_id: Number(formData.status_id)
            });
        } catch (error) {
            console.error('Error al guardar los cambios de la sucursal:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center justify-center px-8 overflow-y-auto">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <label htmlFor="retail_id" className="text-sm font-medium text-gray-700">Empresa</label>
                    <select
                        id="retail_id"
                        name="retail_id"
                        value={formData.retail_id}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg p-2 w-full"
                        required
                        disabled
                    >
                        <option value="">Seleccione una empresa</option>
                        {retails.map((retail) => (
                            <option key={retail.id} value={retail.id}>
                                {retail.comercial_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">Nombre</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg p-2 w-full"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="status_id" className="text-sm font-medium text-gray-700">Estado</label>
                    <select
                        id="status_id"
                        name="status_id"
                        value={formData.status_id}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg p-2 w-full"
                        required
                    >
                        <option value="">Seleccione un estado</option>
                        {unitStatuses.map((status) => (
                            <option key={status.id} value={status.id}>
                                {status.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="address" className="text-sm font-medium text-gray-700">Dirección</label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg p-2 w-full"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700">Teléfono</label>
                    <PhoneInput
                        country={'ve'}
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        containerClass="w-full"
                        inputClass="!w-full p-2 !rounded-lg !h-10"
                        buttonClass="!border !border-gray-300 !rounded-l-lg"
                        inputProps={{
                            name: 'phone',
                            required: true,
                        }}
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Correo</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg p-2 w-full"
                        required
                    />
                </div>
            </div>
            <div className="w-full flex justify-end gap-2 mt-4">
                <button
                    type="button"
                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 cursor-pointer text-sm"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="bg-oscuro text-white py-2 px-4 rounded-lg hover:bg-hover cursor-pointer text-sm"
                    disabled={loading}
                >
                    {loading ? <FaSpinner className="animate-spin mx-auto" /> : 'Guardar'}
                </button>
            </div>
        </form>
    );
};

export default EditBranch;