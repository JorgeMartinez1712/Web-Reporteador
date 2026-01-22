import { useState, useEffect } from 'react';
import useLevels from '../../hooks/useLevels';
import { FaSpinner } from 'react-icons/fa';
import LevelsTable from '../../components/levels/LevelsTable';
import ErrorNotification from '../../components/common/ErrorNotification';
import SuccessNotification from '../../components/common/SuccessNotification';

const LevelsPage = () => {
    const { levels, loading, error, fetchLevels, createLevel, updateLevel } = useLevels();
    const [isEditing, setIsEditing] = useState(false);
    const [currentLevel, setCurrentLevel] = useState(null);
    const [nivel, setNivel] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [pointFrom, setPointFrom] = useState('');
    const [pointTo, setPointTo] = useState('');
    const [scoreFrom, setScoreFrom] = useState('');
    const [scoreTo, setScoreTo] = useState('');
    const [creditFrom, setCreditFrom] = useState('');
    const [creditTo, setCreditTo] = useState('');
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const closeNotifications = () => {
        setShowError(false);
        setErrorMessage('');
        setShowSuccess(false);
        setSuccessMessage('');
    };

    useEffect(() => {
        if (currentLevel) {
            setNivel(currentLevel.nivel || '');
            setDescripcion(currentLevel.descripcion || '');
            setPointFrom(currentLevel.point_from != null ? String(currentLevel.point_from) : '');
            setPointTo(currentLevel.point_to != null ? String(currentLevel.point_to) : '');
            setScoreFrom(currentLevel.score_from != null ? String(currentLevel.score_from) : '');
            setScoreTo(currentLevel.score_to != null ? String(currentLevel.score_to) : '');
            setCreditFrom(currentLevel.credit_from != null ? String(currentLevel.credit_from) : '');
            setCreditTo(currentLevel.credit_to != null ? String(currentLevel.credit_to) : '');
        } else {
            setNivel('');
            setDescripcion('');
            setPointFrom('');
            setPointTo('');
            setScoreFrom('');
            setScoreTo('');
            setCreditFrom('');
            setCreditTo('');
        }
        closeNotifications();
    }, [currentLevel]);

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        closeNotifications();

        if (!nivel || pointFrom === '' || pointTo === '' || scoreFrom === '' || scoreTo === '' || creditFrom === '' || creditTo === '') {
            setErrorMessage('Por favor, completa todos los campos obligatorios.');
            setShowError(true);
            return;
        }

        const payload = {
            nivel: nivel,
            descripcion: descripcion,
            point_from: parseInt(pointFrom),
            point_to: parseInt(pointTo),
            score_from: parseInt(scoreFrom),
            score_to: parseInt(scoreTo),
            credit_from: parseFloat(creditFrom),
            credit_to: parseFloat(creditTo),
        };

        try {
            const action = isEditing ? 'actualizar' : 'crear';
            if (isEditing && currentLevel?.id) {
                await updateLevel(currentLevel.id, payload);
            } else {
                await createLevel(payload);
            }

            setSuccessMessage(`Nivel ${payload.nivel} ha sido ${action} correctamente.`);
            setShowSuccess(true);
            handleCancelEdit();
            fetchLevels();

            setTimeout(closeNotifications, 3000);

        } catch (err) {
            setErrorMessage(`Error al guardar nivel: ${err.message || 'Error desconocido'}`);
            setShowError(true);
        }
    };

    const handleEdit = (levelItem) => {
        closeNotifications();
        setIsEditing(true);
        setCurrentLevel(levelItem);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        closeNotifications();
        setIsEditing(false);
        setCurrentLevel(null);
    };

    const sortedLevels = [...levels].sort((a, b) => a.point_from - b.point_from);

    if (loading && levels.length === 0) return (
        <div className="flex justify-center items-center p-8 min-h-screen text-left">
            <FaSpinner className="animate-spin text-oscuro text-4xl" />
        </div>
    );

    if (error && levels.length === 0) return (
        <div className="text-left p-8 bg-red-100 border border-red-400 text-red-700 rounded">
            Error: {error}
        </div>
    );

    return (
        <div className="p-4 md:p-8 text-left">

            <ErrorNotification isOpen={showError} message={errorMessage} onClose={closeNotifications} />
            <SuccessNotification isOpen={showSuccess} message={successMessage} />

            <h1 className="text-xl font-extrabold text-hover tracking-tight text-left mb-5">Gestión de Niveles</h1>

            <form onSubmit={handleCreateOrUpdate} className="mb-8 text-left">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                        <label htmlFor="nivel" className="block text-gray-700 text-sm font-medium mb-1">Nivel: <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="nivel"
                            className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-claro"
                            value={nivel}
                            onChange={(e) => setNivel(e.target.value)}
                            placeholder="Ej: Nivel Bronce"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="pointFrom" className="block text-gray-700 text-sm font-medium mb-1">Puntos Mínimos: <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            id="pointFrom"
                            className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-claro"
                            value={pointFrom}
                            onChange={(e) => setPointFrom(e.target.value)}
                            placeholder="Ej: 500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="pointTo" className="block text-gray-700 text-sm font-medium mb-1">Puntos Máximos: <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            id="pointTo"
                            className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-claro"
                            value={pointTo}
                            onChange={(e) => setPointTo(e.target.value)}
                            placeholder="Ej: 1500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="scoreFrom" className="block text-gray-700 text-sm font-medium mb-1">Score Mínimo: <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            id="scoreFrom"
                            className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-claro"
                            value={scoreFrom}
                            onChange={(e) => setScoreFrom(e.target.value)}
                            placeholder="Ej: 500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="scoreTo" className="block text-gray-700 text-sm font-medium mb-1">Score Máximo: <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            id="scoreTo"
                            className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-claro"
                            value={scoreTo}
                            onChange={(e) => setScoreTo(e.target.value)}
                            placeholder="Ej: 650"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="creditFrom" className="block text-gray-700 text-sm font-medium mb-1">Crédito Mínimo: <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            step="0.01"
                            id="creditFrom"
                            className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-claro"
                            value={creditFrom}
                            onChange={(e) => setCreditFrom(e.target.value)}
                            placeholder="Ej: 1000.00"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="creditTo" className="block text-gray-700 text-sm font-medium mb-1">Crédito Máximo: <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            step="0.01"
                            id="creditTo"
                            className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-claro"
                            value={creditTo}
                            onChange={(e) => setCreditTo(e.target.value)}
                            placeholder="Ej: 5000.00"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="descripcion" className="block text-gray-700 text-sm font-medium mb-1">Descripción:</label>
                        <textarea
                            id="descripcion"
                            className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-claro resize-none h-[42px]"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Una breve descripción del nivel"
                        ></textarea>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    {isEditing && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                        >
                            Cancelar
                        </button>
                    )}
                    <button
                        type="submit"
                        className="bg-oscuro hover:bg-hover text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center"
                        disabled={loading}
                    >
                        {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
                        {isEditing ? 'Guardar' : 'Registrar'}
                    </button>
                </div>
            </form>
            <div className="bg-white text-left">
                <LevelsTable
                    levels={sortedLevels}
                    loading={loading}
                    onEdit={handleEdit}
                />
            </div>
        </div>
    );
};

export default LevelsPage;