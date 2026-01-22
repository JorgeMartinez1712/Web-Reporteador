import { useState, useEffect } from 'react'
import Select from 'react-select'
import { FaSearch, FaRedoAlt } from 'react-icons/fa'
import useReportes from '../../hooks/useReportes'

const FiltroReportes = ({ onFilter, initialFilters = {} }) => {
    const { retails, fetchRetails, retailUnits, fetchRetailUnits } = useReportes()
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [selectedRetail, setSelectedRetail] = useState(null)
    const [selectedUnit, setSelectedUnit] = useState(null)  

    useEffect(() => {
        fetchRetails()
    }, [fetchRetails])

    useEffect(() => {
        if (initialFilters.initialDate) setStartDate(initialFilters.initialDate)
        if (initialFilters.endDate) setEndDate(initialFilters.endDate)
    }, [initialFilters.initialDate, initialFilters.endDate])

    useEffect(() => {
        const companyId = initialFilters.companyId
        if (companyId && Array.isArray(retails) && retails.length > 0 && !selectedRetail) {
            const match = retails.find(r => r.id === Number(companyId) || r.id === companyId)
            if (match) setSelectedRetail({ value: match.id, label: match.comercial_name || match.legal_name })
        }
    }, [retails, selectedRetail, initialFilters.companyId])

    useEffect(() => {
        if (selectedRetail) {
            fetchRetailUnits(selectedRetail.value)
            setSelectedUnit(null)
        } else {
            fetchRetailUnits(null)
            setSelectedUnit(null)
        }
    }, [selectedRetail, fetchRetailUnits])

    useEffect(() => {
        const unitId = initialFilters.unitId
        if (unitId && Array.isArray(retailUnits) && retailUnits.length > 0 && !selectedUnit) {
            const match = retailUnits.find(u => u.id === Number(unitId) || u.id === unitId)
            if (match) setSelectedUnit({ value: match.id, label: match.name })
        }
    }, [retailUnits, selectedUnit, initialFilters.unitId])

    const retailOptions = Array.isArray(retails)
        ? retails.map(retail => ({ value: retail.id, label: retail.comercial_name || retail.legal_name }))
        : []

    const unitOptions = Array.isArray(retailUnits)
        ? retailUnits.map(unit => ({ value: unit.id, label: unit.name }))
        : []

    const handleSubmit = e => {
        e.preventDefault()
        const payload = {}
        if (startDate) payload.initialDate = startDate
        if (endDate) payload.endDate = endDate
        if (selectedUnit) {
            payload.retailId = selectedUnit.value
            payload.retailunitid = selectedUnit.value
        }
        if (selectedRetail) payload.companyId = selectedRetail.value
        onFilter(payload)
    }

    const handleClear = () => {
        setStartDate('')
        setEndDate('')
        setSelectedRetail(null)
        setSelectedUnit(null)
        onFilter({})
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex flex-col text-left w-full md:w-auto">
                <label htmlFor="startDate" className="text-sm font-semibold text-oscuro">
                    Fecha de inicio
                </label>
                <input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="border border-claro rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-claro transition-colors duration-200"
                />
            </div>
            <div className="flex flex-col text-left w-full md:w-auto">
                <label htmlFor="endDate" className="text-sm font-semibold text-oscuro">
                    Fecha de fin
                </label>
                <input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="border border-claro rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-claro transition-colors duration-200"
                />
            </div>
            <div className="flex flex-col text-left w-full md:w-auto md:min-w-[200px]">
                <label htmlFor="retail" className="text-sm font-semibold text-oscuro">
                    Empresa
                </label>
                <Select
                    id="retail"
                    options={retailOptions}
                    value={selectedRetail}
                    onChange={option => setSelectedRetail(option)}
                    placeholder="Seleccione..."
                    isClearable
                />
            </div>
            {selectedRetail && (
                <div className="flex flex-col text-left w-full md:w-auto md:min-w-[200px]">
                    <label htmlFor="retailUnit" className="text-sm font-semibold text-oscuro">
                        Sucursal
                    </label>
                    <Select
                        id="retailUnit"
                        options={unitOptions}
                        value={selectedUnit}
                        onChange={setSelectedUnit}
                        placeholder="Seleccione..."
                        isClearable
                    />
                </div>
            )}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-2 space-y-2 md:space-y-0 w-full md:w-auto">
                <button
                    type="submit"
                    className="w-full md:w-auto bg-oscuro hover:bg-hover text-white p-3 rounded-full shadow-lg transition-transform transform hover:scale-110"
                    aria-label="Buscar"
                >
                    <FaSearch />
                </button>
                <button
                    type="button"
                    onClick={handleClear}
                    className="w-full md:w-auto bg-gray-400 hover:bg-gray-500 text-white p-3 rounded-full shadow-lg transition-transform transform hover:scale-110"
                    aria-label="Limpiar filtro"
                >
                    <FaRedoAlt />
                </button>
            </div>
        </form>
    )
}

export default FiltroReportes
