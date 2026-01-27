import { useMemo } from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const getThemeColor = (variable, fallback) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return fallback
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable)
  return value?.trim() || fallback
}

const HomePieChart = ({ data }) => {
  const claro = getThemeColor('--color-claro', '#d946ef')
  const oscuro = getThemeColor('--color-oscuro', '#701a75')
  const hover = getThemeColor('--color-hover', '#4a044e')
  const fondo = getThemeColor('--color-bg', '#fdf4ff')

  const chartData = useMemo(() => ({
    labels: ['Empresas', 'Sucursales', 'Vendedores'],
    datasets: [
      {
        label: 'Cantidad',
        data: [data.enterprises, data.branches, data.sellers],
        backgroundColor: [claro, oscuro, hover],
        borderColor: [oscuro, hover, oscuro],
        borderWidth: 1,
      },
    ],
  }), [data, claro, oscuro, hover])

  const options = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: oscuro,
        },
      },
      title: {
        display: true,
        text: 'Distribución de Empresas, Sucursales y Vendedores',
        color: hover,
      },
    },
  }), [oscuro, hover])

  return (
    <div className="w-full max-w-sm mx-auto" style={{ backgroundColor: fondo }}>
      <Pie data={chartData} options={options} />
    </div>
  )
}

export default HomePieChart