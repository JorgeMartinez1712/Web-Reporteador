import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const useHome = () => {
  const [stats, setStats] = useState({
    enterprises: 0,
    brands: 0,
    users: 0,
    dailyUsers: [],
    userDates: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        enterprisesResponse,
        brandsResponse,
        usersResponse,
      ] = await Promise.allSettled([
        axiosInstance.post('/retails/index'),
        axiosInstance.post('/brands/index'),
        axiosInstance.get('/users'),
      ]);

      const enterprisesData = enterprisesResponse.status === 'fulfilled' && Array.isArray(enterprisesResponse.value.data)
        ? enterprisesResponse.value.data
        : [];
      const brandsData = brandsResponse.status === 'fulfilled' && Array.isArray(brandsResponse.value.data)
        ? brandsResponse.value.data
        : [];

      let usersData = [];
      if (usersResponse.status === 'fulfilled' && usersResponse.value.data && Array.isArray(usersResponse.value.data.data)) {
        usersData = usersResponse.value.data.data;
      } else {
        console.warn('Error al obtener datos de usuarios o formato inesperado. Se establecerá 0 usuarios.');
      }

      const usersByDate = {};
      usersData.forEach(user => {
        if (user.created_at) {
          const date = new Date(user.created_at).toLocaleDateString('es-VE', { year: 'numeric', month: '2-digit', day: '2-digit' });
          usersByDate[date] = (usersByDate[date] || 0) + 1;
        }
      });

      const sortedDates = Object.keys(usersByDate).sort((a, b) => {
        const [dayA, monthA, yearA] = a.split('/').map(Number);
        const [dayB, monthB, yearB] = b.split('/').map(Number);
        return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
      });

      const dailyUsersData = sortedDates.map(date => usersByDate[date]);

      setStats({
        enterprises: enterprisesData.length,
        brands: brandsData.length,
        users: usersData.length,
        dailyUsers: dailyUsersData,
        userDates: sortedDates,
      });
    } catch (err) {
      setError('Error al obtener algunas estadísticas. Revisa la consola para más detalles.');
      console.error('Error al obtener datos de inicio:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    stats,
    loading,
    error,
    fetchData,
  };
};

export default useHome;