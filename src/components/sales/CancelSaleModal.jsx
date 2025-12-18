import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CustomModal from '../common/CustomModal';

const CancelSaleModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!isOpen) setNotes('');
  }, [isOpen]);

  const handleSubmit = () => {
    onSubmit(notes);
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Cancelar orden">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de cancelación</label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 min-h-[120px]"
            placeholder="Escribe el motivo de la cancelación"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || notes.trim().length === 0}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Cancelando...' : 'Cancelar orden'}
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

CancelSaleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default CancelSaleModal;
