import { useState } from 'react';
import CustomModal from '../common/CustomModal';
import { FaDownload } from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const ProductsImportModal = ({
  importProducts,
  onProductsImported,
  loading,
  excelFieldName = 'file',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [importResults, setImportResults] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const toggleModal = () => {
    setIsOpen((prev) => !prev);
    setSelectedFile(null);
    setImportResults(null);
    setIsUploading(false);
  };

  const handleDownloadFormat = async () => {
    const workbook = new ExcelJS.Workbook();
    workbook.views = [
      { x: 0, y: 0, width: 10000, height: 20000, firstSheet: 0, activeTab: 1, visibility: 'visible' }
    ];

    const worksheet = workbook.addWorksheet('Formato Importación');

    worksheet.columns = [
      { header: 'COMERCIO', key: 'COMERCIO', width: 8 },
      { header: 'CATEGORIA', key: 'CATEGORIA', width: 12 },
      { header: 'MARCA', key: 'MARCA', width: 8 },
      { header: 'SKU', key: 'SKU', width: 18, style: { numFmt: '0' } },
      { header: 'NOMBRE', key: 'NOMBRE', width: 25 },
      { header: 'DESCRIPCION', key: 'DESCRIPCION', width: 25 },
      { header: 'MODELO', key: 'MODELO', width: 15 },
      { header: 'PRECIO BASE', key: 'PRECIO BASE', width: 15, style: { numFmt: '0.00' } },
      { header: 'MONEDA', key: 'MONEDA', width: 10 },
      { header: 'SERVICIO', key: 'SERVICIO', width: 10 },
      { header: 'BLOQUEO', key: 'BLOQUEO', width: 10 }
    ];

    const data = [
      {COMERCIO: 'BIT MERCADO MILLENNIUM', CATEGORIA: 'ELECTRÓNICOS', MARCA: 'XIAOMI', SKU: 11112222, NOMBRE: 'XIAOMI REDMI 7A AZUL', DESCRIPCION: 'XIAOMI REDMI 7A REFURBISHED', MODELO: 'AA1', 'PRECIO BASE': 250.00, MONEDA: 'USD', SERVICIO: 'SI', BLOQUEO: 'NO'},
      {COMERCIO: 'BIT MERCADO MILLENNIUM', CATEGORIA: 'ELECTRÓNICOS', MARCA: 'XIAOMI', SKU: 11112223, NOMBRE: 'XIAOMI REDMI 7A NEGRO', DESCRIPCION: 'XIAOMI REDMI 7A NUEVO', MODELO: 'AA2', 'PRECIO BASE': 275.00, MONEDA: 'USD', SERVICIO: 'NO', BLOQUEO: 'NO'},
      {COMERCIO: 'BIT MERCADO MILLENNIUM', CATEGORIA: 'ELECTRÓNICOS', MARCA: 'XIAOMI', SKU: 11112224, NOMBRE: 'XIAOMI REDMI NOTE 8', DESCRIPCION: 'XIAOMI REDMI NOTE 8 REFURBISHED', MODELO: 'BB1', 'PRECIO BASE': 320.00, MONEDA: 'USD', SERVICIO: 'SI', BLOQUEO: 'SI'}
    ];

    worksheet.addRows(data);

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, 'formato_productos_importacion.xlsx');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    await handleImport(file);
  };

  const handleImport = async (file) => {
    setIsUploading(true);
    setImportResults(null);

    const formData = new FormData();
    formData.append(excelFieldName, file);

    try {
      const apiResponse = await importProducts(formData);

      if (apiResponse && apiResponse.success === false) {
        setImportResults({ error: true, message: apiResponse.message || 'Error desconocido al importar.' });
      } else if (apiResponse && apiResponse.success === true) {
        setImportResults(apiResponse.data);
        if (onProductsImported) onProductsImported();
      } else {
        setImportResults({ error: true, message: 'La respuesta de la API no tiene un formato esperado.' });
      }
    } catch (error) {
      setImportResults({ error: true, message: 'Hubo un error al importar. Verifique la conexión o el formato.' });
      console.error('Error durante la importación:', error);
    } finally {
      setSelectedFile(null);
      setIsUploading(false);
      document.getElementById('excel-file-upload').value = null;
    }
  };

  const getRowStatusClass = (item) => {
    const hasErrors = item?.errors && Object.keys(item.errors).length > 0;
    const status = item?.status?.toLowerCase();
    if (hasErrors || status === 'invalid') {
      return 'bg-red-50';
    }
    return 'bg-fuchsia-50';
  };

  const formatStatus = (status) => {
    if (!status) return 'Desconocido';
    if (status.toLowerCase() === 'valid') return 'Válido';
    if (status.toLowerCase() === 'invalid') return 'Inválido';
    return status;
  };

  const renderRowErrors = (errors) => {
    if (!errors || Object.keys(errors).length === 0) {
      return 'Registro exitoso';
    }
    return (
      <div className="space-y-1">
        {Object.entries(errors).map(([field, message]) => (
          <div key={field} className="capitalize">
            <span className="font-semibold uppercase mr-1">{field}:</span>
            <span className="normal-case">{message}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <button
        onClick={toggleModal}
        className="bg-fuchsia-900 text-white py-2 px-4 rounded-lg hover:bg-fuchsia-950 cursor-pointer mr-2"
      >
        Importar
      </button>

      <CustomModal
        isOpen={isOpen}
        onClose={toggleModal}
        title="Importar Productos (Excel)"
      >
        <div className="space-y-4">
          <div className="flex justify-start space-x-4">
            <button
              onClick={handleDownloadFormat}
              className="flex items-center space-x-2 bg-fuchsia-900 text-white py-2 px-4 rounded-lg hover:bg-fuchsia-950"
            >
              <FaDownload />
              <span>Formato</span>
            </button>

            <label className="flex items-center space-x-2 bg-fuchsia-900 text-white py-2 px-4 rounded-lg hover:bg-fuchsia-950 cursor-pointer">
              {isUploading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Subiendo...</span>
                </>
              ) : (
                <span>Seleccionar Archivo</span>
              )}
              <input
                type="file"
                id="excel-file-upload"
                accept=".xlsx"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading || loading}
              />
            </label>
          </div>

          {(isUploading || loading) && !importResults && (
            <div className="flex justify-center items-center p-4 bg-yellow-100 text-yellow-800 rounded-lg">
              <FaSpinner className="animate-spin mr-2 text-xl" />
              <p>Procesando importación, por favor espera...</p>
            </div>
          )}

          {importResults && typeof importResults === 'object' && importResults.error && (
            <div className="p-4 rounded-lg bg-red-100 text-red-700">
              <h3 className="font-bold mb-2">Error de Importación:</h3>
              <p>{importResults.message}</p>
            </div>
          )}

          {importResults && typeof importResults === 'object' && !importResults.error && (
            <div className="p-4 rounded-l text-fuchsia-950">
              <h3 className="font-bold mb-2">Resultado de la Importación:</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-400">
                  <thead>
                    <tr>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fila
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Detalles
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-400">
                    {Object.entries(importResults).map(([key, item]) => (
                      <tr key={key} className={getRowStatusClass(item)}>
                        <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-700">
                          {key}
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-700">
                          {formatStatus(item?.status)}
                        </td>
                        <td className="px-2 py-2 text-sm text-gray-700">
                          {renderRowErrors(item?.errors)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </CustomModal>
    </>
  );
};

export default ProductsImportModal;