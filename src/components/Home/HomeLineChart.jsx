import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HomeLineChart = ({ data }) => {
  const chartData = {
    labels: data.dates, 
    datasets: [
      {
        label: 'Clientes Registrados',
        data: data.clients, 
        borderColor: '#1F2937', 
        backgroundColor: 'rgba(31, 41, 55, 0.2)', 
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Clientes Registrados por Día',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Fechas',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Cantidad de Clientes',
        },
      },
    },
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default HomeLineChart;