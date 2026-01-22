import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { FaTimesCircle, FaSpinner } from 'react-icons/fa';
import useInventory from '../../hooks/useInventory';

const Step3ProductSelection = ({ onNext, onPrev, initialData, retailUnitId, onError, onSetProductSaved }) => {
  const {
    inventories,
    loading: loadingInventory,
    error: inventoryError,
    fetchInventoriesByRetailUnit,
  } = useInventory({ autoFetchInitialData: false });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInventoryUnit, setSelectedInventoryUnit] = useState(null);
  const [isProductSaved, setIsProductSaved] = useState(false);

  const listRef = useRef(null);

  useEffect(() => {
    fetchInventoriesByRetailUnit(retailUnitId);
  }, [retailUnitId, fetchInventoriesByRetailUnit]);

  useEffect(() => {
    if (inventoryError) {
      const errorMessage = inventoryError.response?.data?.message || inventoryError.message || 'Error desconocido al cargar el inventario.';
      onError(errorMessage);
    }
  }, [inventoryError, onError]);

  useEffect(() => {
    if (onSetProductSaved !== undefined) {
      setIsProductSaved(onSetProductSaved);
    }
  }, [onSetProductSaved]);

  const allInventoryUnits = useMemo(() => {
    if (!inventories?.products) {
      return [];
    }
    return inventories.products.map((product) => ({
      id: product.inventory_id,
      product: {
        id: product.product_id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        brand: product.brand.name,
        brand_id: product.brand?.id || null,
        category: product.category.name,
        currency: product.currency,
      },
      retail_unit: {
        id: inventories.retail_unit_id,
        name: inventories.retail_unit_name,
      },
      serial_number: product.serial_number,
      imei: product.imei
    }));
  }, [inventories]);

  useEffect(() => {
    const initialSaleItem = initialData?.saleDetails?.sale_items?.[0];
    const initialProduct = initialData?.product;
    const initialInventoryUnit = initialData?.inventoryUnit;
    const initialRetailUnit = initialData?.retail_unit;

    if (initialSaleItem) {
      const { product, product_inventory } = initialSaleItem;
      const preSelectedUnit = {
        id: product_inventory.id,
        serial_number: product_inventory.serial_number,
        imei: product_inventory.imei,
        product: {
          id: product.id,
          name: product.name,
          sku: product.sku,
          price: initialSaleItem.unit_price,
          brand: product.brand?.name || initialProduct?.brand?.name || null,
          brand_id: product.brand?.id || initialProduct?.brand_id || null,
          category: product.category?.name || initialProduct?.category?.name || null,
          currency: product.currency || initialProduct?.currency || null,
        },
        retail_unit: initialData.saleDetails.retail_unit,
      };
      setSelectedInventoryUnit(preSelectedUnit);
      setSearchQuery(`${product.name || ''} (SKU: ${product.sku || 'N/A'})`);
      setIsProductSaved(true);
    } else if (initialProduct && initialInventoryUnit) {
      const preSelectedUnit = {
        id: initialInventoryUnit.id,
        serial_number: initialInventoryUnit.serial_number,
        imei: initialInventoryUnit.imei,
        product: {
          id: initialProduct.product_id,
          name: initialProduct.name,
          sku: initialProduct.sku,
          price: initialProduct.base_price,
          brand: initialProduct.brand?.name || initialProduct.brand,
          brand_id: initialProduct.brand_id,
          category: initialProduct.category?.name || initialProduct.category,
          currency: initialProduct.currency,
        },
        retail_unit: initialRetailUnit,
      };
      setSelectedInventoryUnit(preSelectedUnit);
      setSearchQuery(`${initialProduct.name || ''} (SKU: ${initialProduct.sku || 'N/A'})`);
      setIsProductSaved(true);
    } else {
      setSelectedInventoryUnit(null);
      setSearchQuery('');
      setIsProductSaved(false);
    }
  }, [initialData]);

  const searchResults = useMemo(() => {
    if (searchQuery.length > 2 && !selectedInventoryUnit) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      return allInventoryUnits.filter((unit) => {
        return (
          unit.product.name.toLowerCase().includes(lowerCaseQuery) ||
          (unit.product.sku && unit.product.sku.toLowerCase().includes(lowerCaseQuery))
        );
      });
    }
    return [];
  }, [searchQuery, selectedInventoryUnit, allInventoryUnits]);

  const handleSelectInventoryUnit = useCallback((unit) => {
    setSelectedInventoryUnit(unit);
    setSearchQuery(`${unit.product.name || ''} (SKU: ${unit.product.sku || 'N/A'})`);
  }, []);

  const handleRemoveSelectedInventoryUnit = useCallback(() => {
    if (!isProductSaved) {
      setSelectedInventoryUnit(null);
      setSearchQuery('');
    }
  }, [isProductSaved]);

  const handleNext = useCallback(() => {
    if (selectedInventoryUnit) {
      const unitPrice = parseFloat(selectedInventoryUnit.product.price);
      const brandId = selectedInventoryUnit.product.brand_id;
      const updatedData = {
        product: {
          product_id: selectedInventoryUnit.product.id,
          base_price: unitPrice,
          name: selectedInventoryUnit.product.name,
          sku: selectedInventoryUnit.product.sku,
          currency: selectedInventoryUnit.product.currency,
          imei: selectedInventoryUnit.imei,
          brand_id: brandId,
          brand: { id: brandId, name: selectedInventoryUnit.product.brand },
          category: { name: selectedInventoryUnit.product.category },
        },
        inventoryUnit: {
          id: selectedInventoryUnit.id,
          serial_number: selectedInventoryUnit.serial_number,
          imei: selectedInventoryUnit.imei,
        },
        totalAmount: unitPrice,
      };
      onNext(updatedData);
    } else {
      onError('Por favor, selecciona una unidad de producto del inventario.');
    }
  }, [selectedInventoryUnit, onNext, onError]);

  return (
    <div className="bg-white p-8 rounded-lg max-w-full space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800 border-b pb-4 mb-4 border-gray-200 text-left">Selección de Producto del Inventario</h3>
      {loadingInventory ? (
        <div className="text-gray-600 mt-2 flex items-center">
          <FaSpinner className="animate-spin inline-block mr-2" />
          Cargando inventario...
        </div>
      ) : (
        <>
          <div>
            <label htmlFor="productSearch" className="block text-sm font-medium text-gray-700 mb-2 text-left">
              Buscar Producto por Nombre, SKU
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                id="productSearch"
                className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-claro focus:border-claro"
                value={searchQuery}
                onChange={(e) => !isProductSaved && setSearchQuery(e.target.value)}
                placeholder="Escribe nombre o SKU"
                disabled={isProductSaved}
              />
            </div>
            {selectedInventoryUnit ? (
              <div className="bg-bg p-4 rounded-lg border border-claro flex flex-col space-y-2 text-left mt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-oscuro text-lg">{selectedInventoryUnit.product.name}</p>
                    <p className="text-hover text-sm">SKU: {selectedInventoryUnit.product.sku || 'N/A'}</p>
                    <p className="text-hover text-sm">Serial: {selectedInventoryUnit.serial_number || 'N/A'}</p>
                    <p className="text-hover text-sm">IMEI: {selectedInventoryUnit.imei || 'N/A'}</p>
                    <p className="text-hover text-sm">Sucursal: {selectedInventoryUnit.retail_unit?.name || 'N/A'}</p>
                    <p className="text-hover text-sm">Marca: {selectedInventoryUnit.product.brand || 'N/A'}</p>
                    <p className="text-hover text-sm">Categoría: {selectedInventoryUnit.product.category || 'N/A'}</p>
                  </div>
                  {!isProductSaved && (
                    <button
                      type="button"
                      onClick={handleRemoveSelectedInventoryUnit}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full transition duration-300"
                      title="Eliminar producto seleccionado"
                    >
                      <FaTimesCircle size={24} />
                    </button>
                  )}
                </div>
                <div className="mt-2 pt-2 border-t border-claro text-right">
                  <p className="text-lg font-bold text-oscuro">Precio Unitario: {selectedInventoryUnit?.product?.currency?.symbol}{parseFloat(selectedInventoryUnit?.product?.price).toFixed(2)}</p>
                </div>
              </div>
            ) : (
              <>
                {searchQuery.length > 2 && searchResults.length > 0 ? (
                  <ul className="mt-2 border border-gray-200 rounded-lg shadow-sm max-h-40 overflow-y-auto">
                    {searchResults.map((unit) => (
                      <li
                        key={unit.id}
                        className="p-3 hover:bg-bg cursor-pointer border-b border-gray-200 last:border-b-0 text-gray-800 text-left"
                        onClick={() => handleSelectInventoryUnit(unit)}
                      >
                        <span className="font-semibold">{unit.product.name}</span>
                        <span className="text-gray-600 text-sm ml-2">(SKU: {unit.product.sku || 'N/A'})</span>
                        <span className="text-gray-600 text-sm ml-2 font-semibold">({unit.product.currency?.symbol}{parseFloat(unit.product.price).toFixed(2)})</span>
                      </li>
                    ))}
                  </ul>
                ) : searchQuery.length > 2 && searchResults.length === 0 ? (
                  <div className="text-gray-600 p-3 bg-gray-50 rounded-lg mt-2 border border-gray-200 text-left">No se encontraron resultados en el inventario.</div>
                ) : (
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-left mt-4">
                    <h4 className="font-semibold text-gray-700 mb-4">Unidades de Inventario Disponibles</h4>
                    <ul ref={listRef} className="space-y-2 max-h-60 overflow-y-auto">
                      {allInventoryUnits.map((unit) => (
                        <li
                          key={unit.id}
                          className="flex justify-between items-center p-3 rounded-md shadow-sm border bg-white border-gray-100 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSelectInventoryUnit(unit)}
                        >
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800">{unit.product.name}</div>
                            <div className="text-sm text-gray-600">SKU: {unit.product.sku || 'N/A'}</div>
                            <div className="text-sm text-gray-600">Marca: {unit.product.brand || 'N/A'}</div>
                            <div className="text-sm text-gray-600">Categoría: {unit.product.category || 'N/A'}</div>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-oscuro">{unit.product.currency?.symbol}{parseFloat(unit.product.price).toFixed(2)}</span>
                            <div className="text-xs text-gray-500">Sucursal: {unit.retail_unit?.name || 'N/A'}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onPrev}
              className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400 transition duration-300 font-medium"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={handleNext}
              className={`bg-oscuro text-white py-2 px-4 rounded-lg shadow transition duration-200 font-medium ${!selectedInventoryUnit ? 'opacity-50 cursor-not-allowed' : 'hover:bg-hover'}`}
              disabled={!selectedInventoryUnit}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Step3ProductSelection;