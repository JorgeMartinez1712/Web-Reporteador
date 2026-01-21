import { useState, useEffect } from 'react';
import UploadImage from '../common/UploadImage';
import { IMAGE_BASE_URL } from '../../api/axiosInstance';

const FinancierForm = ({ initialFinancier, isEditing, setIsEditing, onSave, docTypes = [] }) => {
  const [formData, setFormData] = useState({
    id: '',
    rif: '',
    legal_name: '',
    comercial_name: '',
    icon_url: '',
  });
  const [saving, setSaving] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [selectedDocType, setSelectedDocType] = useState('J');

  useEffect(() => {
    if (initialFinancier) {
      setFormData({
        id: initialFinancier.id || '',
        rif: initialFinancier.rif || '',
        legal_name: initialFinancier.legal_name || '',
        comercial_name: initialFinancier.comercial_name || '',
        icon_url: initialFinancier.icon_url ? `${IMAGE_BASE_URL}${initialFinancier.icon_url}` : '',
      });
      setSelectedDocType(initialFinancier.document_type_code || 'J');
    }
  }, [initialFinancier]);

  const handleCancelClick = () => {
    setIsEditing(false);
    if (initialFinancier) {
      setFormData({
        id: initialFinancier.id || '',
        rif: initialFinancier.rif || '',
        legal_name: initialFinancier.legal_name || '',
        comercial_name: initialFinancier.comercial_name || '',
        icon_url: initialFinancier.icon_url ? `${IMAGE_BASE_URL}${initialFinancier.icon_url}` : '',
      });
      setSelectedDocType(initialFinancier.document_type_code || 'J');
    }
    setSelectedImageFile(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === 'rif' && !/^[0-9-]*$/.test(value) && value !== '') {
        return prev;
      }
      return { ...prev, [name]: value };
    });
  };

  const handleDocTypeChange = (e) => {
    setSelectedDocType(e.target.value);
  };

  const handleImageSelect = (file) => {
    setSelectedImageFile(file);
    if (file) {
      setFormData((prev) => ({ ...prev, icon_url: URL.createObjectURL(file) }));
    } else {
      setFormData((prev) => ({ ...prev, icon_url: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const docTypeObject = docTypes.find(type => type.code === selectedDocType);
    const docTypeId = docTypeObject ? docTypeObject.id : null;

    const dataToSend = new FormData();
    dataToSend.append('id', initialFinancier?.id);
    dataToSend.append('legal_name', formData.legal_name);
    dataToSend.append('comercial_name', formData.comercial_name);
    dataToSend.append('rif', formData.rif);
    if (docTypeId) {
      dataToSend.append('tipodoc', docTypeId);
    }

    if (selectedImageFile) {
      dataToSend.append('icon_url', selectedImageFile);
    }

    try {
      await onSave(dataToSend);
      if (!isEditing) {
        setFormData({
          id: '',
          rif: '',
          legal_name: '',
          comercial_name: '',
          icon_url: '',
        });
        setSelectedImageFile(null);
        setSelectedDocType('J');
      }
    } catch (err) {
      console.error('Error al guardar:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full bg-white rounded-xl border border-gray-100 p-8 pt-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-6">
        <div className="flex flex-col">
          <label htmlFor="rif" className="text-sm font-semibold text-gray-500 uppercase mb-1 text-left">
            RIF
          </label>
          <div className="flex">
            <select
              id="tipodoc"
              name="tipodoc"
              value={selectedDocType}
              onChange={handleDocTypeChange}
              disabled={!isEditing}
              className={`border rounded-l-lg p-3 text-gray-700
                ${isEditing ? 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-200' : 'bg-gray-100 border-gray-200 cursor-not-allowed'}`}
            >
              {docTypes.map(type => (
                <option key={type.id} value={type.code}>
                  {type.code}
                </option>
              ))}
            </select>
            <input
              id="rif"
              name="rif"
              value={formData.rif}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`border rounded-r-lg p-3 text-gray-700 w-full
                ${isEditing ? 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-200' : 'bg-gray-100 border-gray-200 cursor-not-allowed'}
                ${formData.rif === '' ? 'placeholder-gray-400' : ''}`}
              placeholder={formData.rif === '' ? 'No disponible' : ''}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="legal_name" className="text-m font-semibold text-gray-500 mb-1 text-left">
            Razón social
          </label>
          <input
            id="legal_name"
            name="legal_name"
            value={formData.legal_name}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`border rounded-lg p-3 text-gray-700
              ${isEditing ? 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-200' : 'bg-gray-100 border-gray-200 cursor-not-allowed'}
              ${formData.legal_name === '' ? 'placeholder-gray-400' : ''}`}
            placeholder={formData.legal_name === '' ? 'No disponible' : ''}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="comercial_name" className="text-m font-semibold text-gray-500 mb-1 text-left">
            Nombre comercial
          </label>
          <input
            id="comercial_name"
            name="comercial_name"
            value={formData.comercial_name}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`border rounded-lg p-3 text-gray-700
              ${isEditing ? 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-200' : 'bg-gray-100 border-gray-200 cursor-not-allowed'}
              ${formData.comercial_name === '' ? 'placeholder-gray-400' : ''}`}
            placeholder={formData.comercial_name === '' ? 'No disponible' : ''}
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="text-sm font-semibold text-gray-500 mb-1 block">
          Logo del financista
        </label>
        <UploadImage
          onImageSelect={handleImageSelect}
          imageUrl={formData.icon_url}
          className={!isEditing ? 'pointer-events-none opacity-60' : ''}
        />
      </div>

      {isEditing && (
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleCancelClick}
            disabled={saving}
            className={`px-6 py-2 rounded-lg font-semibold text-gray-700 transition-colors duration-200
              ${saving ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400 shadow-md'}`}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors duration-200
              ${saving ? 'bg-fuchsia-300 cursor-not-allowed' : 'bg-fuchsia-900 hover:bg-fuchsia-950 shadow-md'}`}
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      )}
    </form>
  );
};

export default FinancierForm;