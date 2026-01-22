import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-700 mb-4">Error 404</h1>
      <p className="text-gray-500 mb-6">La página que buscas no existe.</p>
      <Link
        to="/"
        className="px-4 py-2 bg-oscuro text-white rounded-md hover:bg-hover"
      >
        Volver al Inicio
      </Link>
    </div>
  );
};

export default NotFoundPage;