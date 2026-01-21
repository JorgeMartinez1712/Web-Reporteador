import SalesTable from "../../components/sales/SalesTable";
import { Link } from 'react-router-dom';

const SalesPage = () => {
  return (
    <div className="min-h-screen p-8 relative">
      <div className="w-full flex justify-between items-center mb-8">
        <h2 className="text-xl font-extrabold text-fuchsia-950 tracking-tight">
          Gestión de Ventas
        </h2>
        <Link to="/ventas/registrar" className="bg-fuchsia-900 text-white py-2 px-4 rounded-lg hover:bg-fuchsia-950 cursor-pointer">
          Registrar
        </Link>
      </div>
      <SalesTable />
    </div>
  );
};

export default SalesPage;