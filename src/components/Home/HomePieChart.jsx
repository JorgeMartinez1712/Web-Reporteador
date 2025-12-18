import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const HomePieChart = ({ data }) => {
  const chartData = {
    labels: ['Empresas', 'Sucursales', 'Vendedores'],
    datasets: [
      {
        label: 'Cantidad',
        data: [data.enterprises, data.branches, data.sellers],
        backgroundColor: ['#1B1F3B', '#283655', '#4D648D'],
        borderColor: ['#0F111A', '#1A1F33', '#3A4A6A'], 
        borderWidth: 1,
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
        text: 'Distribución de Empresas, Sucursales y Vendedores',
      },
    },
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default HomePieChart;