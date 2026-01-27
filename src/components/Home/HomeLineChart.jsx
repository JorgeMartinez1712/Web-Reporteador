import { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const getThemeColor = (variable, fallback) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return fallback
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable)
  return value?.trim() || fallback
}

const HomeLineChart = ({ data }) => {
  const claro = getThemeColor('--color-claro', '#d946ef')
  const oscuro = getThemeColor('--color-oscuro', '#701a75')
  const hover = getThemeColor('--color-hover', '#4a044e')
  const fondo = getThemeColor('--color-bg', '#fdf4ff')

  const chartData = useMemo(() => ({
    labels: data.dates,
    datasets: [
      {
        label: 'Clientes Registrados',
        data: data.clients,
        borderColor: oscuro,
        backgroundColor: `${claro}33`,
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: hover,
        pointBorderColor: '#fff',
        fill: true,
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
        text: 'Clientes Registrados por Día',
        color: hover,
      },
      tooltip: {
        backgroundColor: hover,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Fechas',
          color: oscuro,
        },
        ticks: {
          color: oscuro,
        },
        grid: {
          color: `${claro}40`,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Cantidad de Clientes',
          color: oscuro,
        },
        ticks: {
          color: oscuro,
        },
        grid: {
          color: `${claro}40`,
        },
      },
    },
  }), [claro, oscuro, hover])

  return (
    <div className="w-full max-w-2xl mx-auto" style={{ backgroundColor: fondo }}>
      <Line data={chartData} options={options} />
    </div>
  )
}

export default HomeLineChart