import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const SaleSelection = ({ customer, sales, onSaleSelected, selectedSale, hookError }) => {

  const handleSelectSale = (sale) => {
    const isSelected = selectedSale && selectedSale.id === sale.id;
    onSaleSelected(isSelected ? null : sale);
  };

  if (!sales || sales.length === 0) {
    return (
      <div className="space-y-4 text-left">
        <p className="font-semibold text-gray-700">
          Cliente: <span className="text-fuchsia-900">{customer.full_name}</span> (C.I: {customer.document_number})
        </p>
        <div className="text-red-600 bg-red-50 p-3 rounded-md border border-red-300">
          Este cliente no tiene ventas para registrar pagos.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <h3 className="text-2xl font-semibold text-gray-800 border-b pb-4 mb-4 border-gray-200">
        Cliente: <span className="text-fuchsia-900">{customer.full_name}</span>
      </h3>

      <h3 className="text-xl font-bold text-gray-700">
        Seleccione la Venta para el Pago
      </h3>

      {hookError && (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-300">
          {hookError}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4">
        {sales.map((sale) => {
          const isSelected = selectedSale && selectedSale.id === sale.id;
          return (
            <div
              key={sale.id}
              onClick={() => handleSelectSale(sale)}
              className={`p-4 border-2 rounded-lg shadow-sm hover:shadow-md transition duration-150 flex justify-between items-center cursor-pointer ${isSelected ? 'border-fuchsia-500 bg-fuchsia-50 shadow-lg' : 'border-gray-200 bg-white hover:border-fuchsia-300'}`}
            >
              <div className="flex flex-col">
                <span className="font-bold text-gray-800 flex items-center">
                  Venta N°: {sale.sale_code}
                </span>
                <span className="text-sm text-gray-600">
                  Monto Pendiente: <b className="text-red-600">${parseFloat(sale.outstanding).toFixed(2)}</b>
                </span>
                <span className="text-xs text-gray-500">
                  Fecha: {new Date(sale.created_at).toLocaleDateString()}
                </span>
              </div>
              {isSelected && (
                <FaCheckCircle className="h-6 w-6 text-fuchsia-500" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SaleSelection;