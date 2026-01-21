import DataTable from '../common/DataTable';
import { FaSpinner } from 'react-icons/fa';

const formatCurrency = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? '$0.00' : `$${num.toFixed(2)}`;
};

const LevelsTable = ({ levels, loading, onEdit }) => {

    const processedLevels = levels.map((level) => ({
        ...level,
        id: level.id,
        pointsRange: `${level.point_from} - ${level.point_to}`,
        scoreRange: `${level.score_from} - ${level.score_to}`,
        creditRange: `${formatCurrency(level.credit_from)} - ${formatCurrency(level.credit_to)}`,
    }));

    const columns = [
        { field: 'nivel', headerName: 'Nivel', flex: 0.8, minWidth: 100 },
        { field: 'descripcion', headerName: 'Descripción', flex: 1.5, minWidth: 200 },
        {
            field: 'pointsRange',
            headerName: 'Puntos',
            flex: 1,
            minWidth: 120,
            align: 'left',
            headerAlign: 'left',
        },
        {
            field: 'scoreRange',
            headerName: 'Score',
            flex: 1,
            minWidth: 120,
            align: 'left',
            headerAlign: 'left',
        },
        {
            field: 'creditRange',
            headerName: 'Límite Crédito',
            flex: 1,
            minWidth: 160,
            align: 'left',
            headerAlign: 'left',
        },
    ];

    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center p-8">
                    <FaSpinner className="animate-spin text-fuchsia-900 text-4xl" />
                </div>
            ) : (
                <DataTable
                    rows={processedLevels}
                    columns={columns}
                    onEdit={onEdit}
                    onViewDetails={null}
                    onDelete={null}
                    initialState={{
                        sorting: {
                            sortModel: [{ field: 'nivel', sort: 'asc' }],
                        },
                    }}
                />
            )}
        </>
    );
};

export default LevelsTable;