import DataTable from '../common/DataTable';
import { FaSpinner } from 'react-icons/fa';

const DevicesTable = ({ devices, loading = false }) => {
    const columns = [
        { field: 'id', headerName: 'IMEI', flex: 0.5, minWidth: 50 },
        { field: 'marca', headerName: 'MARCA', flex: 1, minWidth: 150 },
        { field: 'modelo', headerName: 'MODELO', flex: 2, minWidth: 250 },
        { field: 'status', headerName: 'ESTADO', flex: 1, minWidth: 150 },
    ];

    const rowsWithId = devices.map(device => ({
        ...device,
        id: device.imei,
    }));

    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <FaSpinner className="animate-spin text-emerald-600 text-4xl" />
                </div>
            ) : (
                <DataTable
                    rows={rowsWithId}
                    columns={columns}
                />
            )}
        </>
    );
};

export default DevicesTable;