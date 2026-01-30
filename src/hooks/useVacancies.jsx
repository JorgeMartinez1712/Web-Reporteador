import { useMemo, useState } from 'react';

const initialVacancies = [
  {
    id: 'VAC-001',
    title: 'Lead Architect',
    department: 'Innovación Técnica',
    priority: 'Alta Prioridad',
    priorityVariant: 'high',
    openedAt: '2025-12-12',
    applications: 58,
    progress: 64,
    trend: [12, 18, 21, 25, 28, 35, 40],
    recruiters: [
      { name: 'Valeria Ruiz', avatar: 'https://i.pravatar.cc/80?img=47' },
      { name: 'Marcos Pérez', avatar: 'https://i.pravatar.cc/80?img=12' },
      { name: 'Daniela Ricci', avatar: 'https://i.pravatar.cc/80?img=38' },
    ],
    published: true,
  },
  {
    id: 'VAC-002',
    title: 'React Developer',
    department: 'Ingeniería Frontend',
    priority: 'Normal',
    priorityVariant: 'normal',
    openedAt: '2026-01-04',
    applications: 32,
    progress: 48,
    trend: [8, 12, 18, 20, 24, 27, 32],
    recruiters: [
      { name: 'Lucía Ramos', avatar: 'https://i.pravatar.cc/80?img=24' },
      { name: 'Antonio Serrano', avatar: 'https://i.pravatar.cc/80?img=5' },
    ],
    published: true,
  },
  {
    id: 'VAC-003',
    title: 'Product Manager',
    department: 'Estrategia Digital',
    priority: 'Alta Prioridad',
    priorityVariant: 'high',
    openedAt: '2025-11-28',
    applications: 41,
    progress: 72,
    trend: [15, 18, 22, 30, 28, 35, 41],
    recruiters: [
      { name: 'Gabriela Soto', avatar: 'https://i.pravatar.cc/80?img=33' },
      { name: 'Héctor Díaz', avatar: 'https://i.pravatar.cc/80?img=14' },
    ],
    published: true,
  },
  {
    id: 'VAC-004',
    title: 'Data Scientist',
    department: 'Ciencia de Datos',
    priority: 'Normal',
    priorityVariant: 'normal',
    openedAt: '2025-12-20',
    applications: 27,
    progress: 36,
    trend: [5, 9, 13, 17, 22, 25, 27],
    recruiters: [
      { name: 'Mariana Molina', avatar: 'https://i.pravatar.cc/80?img=28' },
      { name: 'Julián Leiva', avatar: 'https://i.pravatar.cc/80?img=7' },
      { name: 'Paola Suárez', avatar: 'https://i.pravatar.cc/80?img=57' },
    ],
    published: true,
  },
  {
    id: 'VAC-005',
    title: 'DevOps Engineer',
    department: 'Plataforma Cloud',
    priority: 'Media',
    priorityVariant: 'medium',
    openedAt: '2025-12-05',
    applications: 36,
    progress: 52,
    trend: [10, 14, 16, 19, 21, 30, 36],
    recruiters: [
      { name: 'Rafael Arboleda', avatar: 'https://i.pravatar.cc/80?img=52' },
      { name: 'Camila León', avatar: 'https://i.pravatar.cc/80?img=18' },
    ],
    published: true,
  },
  {
    id: 'VAC-006',
    title: 'UX Research Lead',
    department: 'Experiencia de Cliente',
    priority: 'Alta Prioridad',
    priorityVariant: 'high',
    openedAt: '2025-12-30',
    applications: 24,
    progress: 43,
    trend: [6, 8, 11, 13, 18, 22, 24],
    recruiters: [
      { name: 'Victoria Palma', avatar: 'https://i.pravatar.cc/80?img=16' },
      { name: 'Luis Corzo', avatar: 'https://i.pravatar.cc/80?img=45' },
    ],
    published: true,
  },
];

const useVacancies = () => {
  const [vacancies, setVacancies] = useState(initialVacancies);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVacancies = useMemo(() => {
    if (!searchTerm.trim()) {
      return vacancies;
    }
    const normalized = searchTerm.trim().toLowerCase();
    return vacancies.filter((vacancy) => {
      return (
        vacancy.title.toLowerCase().includes(normalized) ||
        vacancy.department.toLowerCase().includes(normalized)
      );
    });
  }, [searchTerm, vacancies]);

  const togglePublication = (vacancyId) => {
    setVacancies((prev) =>
      prev.map((vacancy) =>
        vacancy.id === vacancyId ? { ...vacancy, published: !vacancy.published } : vacancy,
      ),
    );
  };

  return {
    vacancies: filteredVacancies,
    searchTerm,
    setSearchTerm,
    togglePublication,
    totalVacancies: vacancies.length,
  };
};

export default useVacancies;
