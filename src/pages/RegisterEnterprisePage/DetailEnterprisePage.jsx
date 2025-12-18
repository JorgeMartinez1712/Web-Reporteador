import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useRegisterEnterprise from '../../hooks/useRegisterEnterprise';
import SuccessNotification from '../../components/common/SuccessNotification';
import ErrorNotification from '../../components/common/ErrorNotification';
import EnterpriseHeader from '../../components/RegisterEnterprise/EnterpriseHeader';
import EnterpriseForm from '../../components/RegisterEnterprise/EnterpriseForm';
import EnterpriseLoading from '../../components/RegisterEnterprise/EnterpriseLoading';
import BranchesSection from '../../components/RegisterEnterprise/BranchesSection';
import { IMAGE_BASE_URL } from '../../api/axiosInstance';

const DetailEnterprisePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        financiers,
        retailStatuses,
        unitStatuses,
        docTypes,
        currencies,
        loading: hookLoading,
        error: hookError,
        updateEnterprise,
        fetchEnterpriseDetail,
        fetchEnterprises
    } = useRegisterEnterprise({
        autoFetchEnterprises: false,
        autoFetchFinanciers: true,
        autoFetchRetailStatuses: true,
        autoFetchUnitStatuses: true,
        autoFetchDocTypes: true,
        autoFetchCurrencies: true,
    });

    const [enterprise, setEnterprise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorNotification, setShowErrorNotification] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [formData, setFormData] = useState({});
    const [selectedDocType, setSelectedDocType] = useState('J');
    const [logoFile, setLogoFile] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState('');
    const didFetchDetailRef = useRef(false);

    const getFinalImageUrl = useCallback((iconUrl) => {
        if (!iconUrl) {
            return '';
        }

        if (iconUrl.startsWith('http')) {
            return iconUrl;
        }

        const sanitizedUrl = iconUrl.startsWith('/') ? iconUrl.substring(1) : iconUrl;
        return `${IMAGE_BASE_URL}${sanitizedUrl}`;
    }, []);


    useEffect(() => {
        const getEnterpriseDetail = async () => {
            setLoading(true);
            if (hookError) {
                setLoading(false);
                return;
            }
            try {
                const detail = await fetchEnterpriseDetail(parseInt(id));
                if (detail) {
                    setEnterprise(detail);
                    setFormData({
                        rif: detail.rif ? detail.rif.substring(1) : '',
                        legal_name: detail.legal_name || '',
                        comercial_name: detail.comercial_name || '',
                        address: detail.address || '',
                        phone: detail.phone || '',
                        email: detail.email || '',
                        financiers_id: detail.financiers_id || '',
                        status_id: detail.status_id || '',
                        currency_id: detail.currency_id || '',
                    });
                    if (detail.rif && detail.rif.length > 0) {
                        setSelectedDocType(detail.rif.charAt(0));
                    }

                    const imageUrl = getFinalImageUrl(detail.icon_url);
                    setCurrentImageUrl(imageUrl);

                } else {
                    navigate('/404', { replace: true });
                }
            } catch (err) {
                navigate('/404', { replace: true });
            } finally {
                setLoading(false);
            }
        };

        if (!hookLoading && !didFetchDetailRef.current) {
            didFetchDetailRef.current = true;
            getEnterpriseDetail();
        }
    }, [id, hookLoading, hookError, fetchEnterpriseDetail, navigate, getFinalImageUrl]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'rif') {
            const cleanedValue = value.replace(/[^0-9-]/g, '');
            if (cleanedValue.length <= 10) {
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: cleanedValue,
                }));
            }
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleDocTypeChange = (value) => {
        setSelectedDocType(value);
    };

    const handleImageSelect = (file) => {
        setLogoFile(file);
        if (file) {
            setCurrentImageUrl(URL.createObjectURL(file));
        } else {
            const originalUrl = enterprise?.icon_url ? getFinalImageUrl(enterprise.icon_url) : '';
            setCurrentImageUrl(originalUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveLoading(true);
        setErrorMessage('');
        setShowErrorNotification(false);
        setSuccessMessage('');
        setShowSuccessNotification(false);

        const fullRif = `${selectedDocType}${formData.rif}`;
        const selectedDocObject = docTypes.find(doc => doc.code === selectedDocType);
        const docTypeId = selectedDocObject ? selectedDocObject.id : null;

        if (docTypeId === null) {
            setErrorMessage('Tipo de documento no encontrado. Intente de nuevo.');
            setShowErrorNotification(true);
            setSaveLoading(false);
            return;
        }

        const finalPayload = new FormData();
        finalPayload.append('id', parseInt(id));
        finalPayload.append('rif', fullRif);
        finalPayload.append('legal_name', formData.legal_name);
        finalPayload.append('comercial_name', formData.comercial_name);
        finalPayload.append('address', formData.address);
        finalPayload.append('phone', formData.phone);
        finalPayload.append('email', formData.email);
        finalPayload.append('financiers_id', parseInt(formData.financiers_id));
        finalPayload.append('status_id', parseInt(formData.status_id));
        finalPayload.append('currency_id', parseInt(formData.currency_id));
        finalPayload.append('tipodoc', docTypeId);

        if (logoFile instanceof File) {
            finalPayload.append('icon_url', logoFile);
        }

        try {
            await updateEnterprise(finalPayload);
            setIsEditing(false);
            setSuccessMessage('¡Empresa actualizada con éxito!');
            setShowSuccessNotification(true);
            setTimeout(() => setShowSuccessNotification(false), 3000);
            const updatedDetail = await fetchEnterpriseDetail(parseInt(id));
            if (updatedDetail) {
                setEnterprise(updatedDetail);
                setCurrentImageUrl(getFinalImageUrl(updatedDetail.icon_url));
            }
            await fetchEnterprises();
        } catch (error) {
            const message = error.message || 'Error al actualizar la empresa. Inténtalo de nuevo.';
            setErrorMessage(message);
            setShowErrorNotification(true);
        } finally {
            setSaveLoading(false);
        }
    };

    const handleCancelEdit = () => {
        if (enterprise) {
            setFormData({
                rif: enterprise.rif ? enterprise.rif.substring(1) : '',
                legal_name: enterprise.legal_name || '',
                comercial_name: enterprise.comercial_name || '',
                address: enterprise.address || '',
                phone: enterprise.phone || '',
                email: enterprise.email || '',
                financiers_id: enterprise.financiers_id || '',
                status_id: enterprise.status_id || '',
                currency_id: enterprise.currency_id || '',
            });
            if (enterprise.rif && enterprise.rif.length > 0) {
                setSelectedDocType(enterprise.rif.charAt(0));
            }

            const originalUrl = getFinalImageUrl(enterprise.icon_url);
            setCurrentImageUrl(originalUrl);
        }
        setIsEditing(false);
        setErrorMessage('');
        setShowErrorNotification(false);
        setSuccessMessage('');
        setShowSuccessNotification(false);
        setLogoFile(null);
    };

    if (loading || hookLoading) {
        return <EnterpriseLoading />;
    }

    return (
        <div className="p-8">
            <EnterpriseHeader
                enterpriseName={enterprise.legal_name || enterprise.comercial_name}
                isEditing={isEditing}
                onEditClick={() => setIsEditing(true)}
                onSaveClick={handleSubmit}
                onCancelClick={handleCancelEdit}
                saveLoading={saveLoading}
            />
            <ErrorNotification isOpen={showErrorNotification} message={errorMessage} onClose={() => setShowErrorNotification(false)} />
            <SuccessNotification isOpen={showSuccessNotification} message={successMessage} />
            <EnterpriseForm
                formData={formData}
                handleChange={handleChange}
                handleDocTypeChange={handleDocTypeChange}
                handleImageSelect={handleImageSelect}
                isEditing={isEditing}
                docTypes={docTypes}
                financiers={financiers}
                retailStatuses={retailStatuses}
                currencies={currencies}
                selectedDocType={selectedDocType}
                currentImageUrl={currentImageUrl}
            />
            <div className="mt-12 pt-8 border-t border-gray-200">
                <BranchesSection
                    retailId={parseInt(id)}
                    retails={[enterprise]}
                    financiers={financiers}
                    unitStatuses={unitStatuses}
                />
            </div>
        </div>
    );
};

export default DetailEnterprisePage;