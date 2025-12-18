import { useState, useMemo } from 'react';
import DataTable from '../common/DataTable';
import CustomModal from '../common/CustomModal';
import DeletePromotion from './DeletePromotion';
import { FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { IMAGE_BASE_URL } from '../../api/axiosInstance';

const PromotionsTable = ({
    promotions = [],
    deletePromotion,
    loading = false,
    onPromotionDeleted,
}) => {
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleViewDetails = (row) => {
        navigate(`/promociones/${row.id}`);
    };

    const handleDelete = (row) => {
        setSelectedPromotion(row);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            if (selectedPromotion) {
                await deletePromotion(selectedPromotion.id);
                setIsDeleteModalOpen(false);
                setSelectedPromotion(null);
                if (onPromotionDeleted) {
                    onPromotionDeleted();
                }
            }
        } catch (error) {
            console.error('Error al eliminar la promoción:', error);
        }
    };

    const processedPromotions = useMemo(() => {
        return (promotions || []).map(promo => {
            const startDate = new Date(promo.start_date);
            const endDate = new Date(promo.end_date);

            const imagePath = promo.image_file || promo.image || null;
            const imageUrl = imagePath
                ? (imagePath.startsWith('http')
                    ? imagePath
                    : `${IMAGE_BASE_URL}${imagePath.startsWith('/') ? imagePath.substring(1) : imagePath}`)
                : '/assets/no-image.svg';

            return {
                ...promo,
                statusName: promo.status ? promo.status.name : (promo.code || 'N/A'),
                startDateFormatted: isNaN(startDate.getTime())
                    ? 'Invalid Date'
                    : startDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }),
                endDateFormatted: isNaN(endDate.getTime())
                    ? 'Invalid Date'
                    : endDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }),
                image: imageUrl,
            };
        });
    }, [promotions]);

    const columns = [
        { field: 'name', headerName: 'Nombre', flex: 1, minWidth: 150 },
        { field: 'description', headerName: 'Descripción', flex: 2, minWidth: 250 },
        { field: 'startDateFormatted', headerName: 'Inicio', flex: 0.8, minWidth: 100 },
        { field: 'endDateFormatted', headerName: 'Fin', flex: 0.8, minWidth: 100 },
        { field: 'code', headerName: 'Estado', flex: 0.8, minWidth: 80 },
        {
            field: 'image',
            headerName: 'Imagen',
            flex: 0.6,
            minWidth: 80,
            headerClassName: 'justify-start',
            renderCell: ({ row }) => {
                const src = row.image || '/assets/no-image.svg';
                return (
                    <div className="flex items-center justify-center w-full h-full">
                        <img
                            src={src}
                            alt="Imagen promoción"
                            className="h-16 w-16 max-h-full max-w-full object-contain"
                            onError={(e) => { e.target.src = '/assets/no-image.svg'; }}
                        />
                    </div>
                );
            },
            sortable: false,
            filterable: false,
        },
        
    ];

    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <FaSpinner className="animate-spin text-emerald-600 text-4xl" />
                </div>
            ) : (
                <DataTable
                    rows={processedPromotions}
                    columns={columns}
                    onViewDetails={handleViewDetails}
                    // onDelete={handleDelete}
                />
            )}

            <CustomModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirmar Eliminación"
            >
                {selectedPromotion && (
                    <DeletePromotion
                        promotion={selectedPromotion}
                        onConfirm={confirmDelete}
                        onCancel={() => setIsDeleteModalOpen(false)}
                    />
                )}
            </CustomModal>
        </>
    );
};

export default PromotionsTable;