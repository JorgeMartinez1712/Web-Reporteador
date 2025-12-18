import HomePieChart from '../../components/Home/HomePieChart';
import HomeLineChart from '../../components/Home/HomeLineChart';
import AnimatedCard from '../../components/Home/AnimatedCard';
import useHome from '../../hooks/useHome';
import { FaSpinner } from 'react-icons/fa'; 

const HomePage = () => {
  const { stats, loading, error } = useHome();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-emerald-600 text-4xl" />
      </div>
    );
  }

  if (error) {
    return <div className="min-h-screen p-8 flex justify-center items-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <AnimatedCard title="Empresas" value={stats.enterprises} link="/empresas" />
        <AnimatedCard title="Marcas" value={stats.brands} link="/marcas" />
        <AnimatedCard title="Usuarios" value={stats.users} link="/usuarios" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 shadow rounded">
          <HomePieChart
            data={{
              enterprises: stats.enterprises,
              branches: stats.brands, 
              sellers: stats.users, 
            }}
          />
        </div>
        <div className="p-4 shadow rounded">
          <HomeLineChart
            data={{
              dates: stats.userDates,
              clients: stats.dailyUsers,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;