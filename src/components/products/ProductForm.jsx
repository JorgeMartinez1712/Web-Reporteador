import UploadImage from '../common/UploadImage';

const ProductForm = ({
  formData,
  handleChange,
  handleImageSelect,
  isEditing,
  categories,
  brands,
  productStatuses,
  currentImageUrl,
}) => {
  return (
    <form className="bg-white p-8 rounded-lg max-w-full mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="text-left">
          <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU</label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
            placeholder="Ej: SKU-001"
            maxLength="50"
            required
            disabled={!isEditing}
          />
        </div>

        <div className="text-left">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
            placeholder="Ej: Producto XYZ"
            maxLength="100"
            required
            disabled={!isEditing}
          />
        </div>
        <div className="text-left">
          <label htmlFor="base_price" className="block text-sm font-medium text-gray-700">Precio Base</label>
          <input
            type="number"
            id="base_price"
            name="base_price"
            value={formData.base_price}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
            placeholder="Ej: 100.00"
            step="0.01"
            required
            disabled={!isEditing}
          />
        </div>

        <div className="text-left">
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">Categoría</label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
            disabled={!isEditing}
          >
            <option value="">--Seleccionar--</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-left">
          <label htmlFor="brand_id" className="block text-sm font-medium text-gray-700">Marca</label>
          <select
            id="brand_id"
            name="brand_id"
            value={formData.brand_id}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
            disabled={!isEditing}
          >
            <option value="">--Seleccionar--</option>
            {Array.isArray(brands) && brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>


        <div className="text-left">
          <label htmlFor="model" className="block text-sm font-medium text-gray-700">Modelo</label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
            placeholder="Ej: Galaxy S23"
            maxLength="100"
            disabled={!isEditing}
          />
        </div>

        <div className="text-left">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm h-10 resize-none"
            placeholder="Una pequeña descripción del producto."
            rows="1"
            maxLength="500"
            required
            disabled={!isEditing}
          ></textarea>
        </div>
        <div className="text-left">
          <label htmlFor="total_inventory" className="block text-sm font-medium text-gray-700">Cantidad en inventario</label>
          <input
            type="number"
            id="total_inventory"
            name="total_inventory"
            value={formData.inventario || 0}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 sm:text-sm"
            disabled
          />
        </div>
        <div className="text-left">
          <label htmlFor="status_id" className="block text-sm font-medium text-gray-700">Estatus</label>
          <select
            id="status_id"
            name="status_id"
            value={formData.status_id}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
            disabled={!isEditing}
          >
            <option value="">--Seleccionar--</option>
            {productStatuses?.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-4">
          <div className="text-left">
            <span className="text-sm text-gray-500 text-left">opcionales</span>
          </div>
          <div className="flex items-center text-left">
            <input
              type="checkbox"
              id="requires_device_lock"
              name="requires_device_lock"
              checked={formData.requires_device_lock}
              onChange={handleChange}
              className="h-4 w-4 text-fuchsia-900 focus:ring-fuchsia-500 border-gray-300 rounded"
              disabled={!isEditing}
            />
            <label htmlFor="requires_device_lock" className="ml-2 block text-sm font-medium text-gray-700">Requiere Bloqueo de Dispositivo</label>
          </div>

          <div className="flex items-center text-left">
            <input
              type="checkbox"
              id="is_service"
              name="is_service"
              checked={formData.is_service}
              onChange={handleChange}
              className="h-4 w-4 text-fuchsia-900 focus:ring-fuchsia-500 border-gray-300 rounded"
              disabled={!isEditing}
            />
            <label htmlFor="is_service" className="ml-2 block text-sm font-medium text-gray-700">Es un Servicio</label>
          </div>
        </div>

        <div className="flex flex-col col-span-1 sm:col-span-1 md:col-span-2 text-left">
          <label htmlFor="image_upload" className="text-sm font-medium text-gray-700 mb-2">Imagen del Producto</label>
          <div className="w-1/2">
            <UploadImage
              onImageSelect={handleImageSelect}
              imageUrl={currentImageUrl}
              className="h-48"
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;