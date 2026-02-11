import { Link } from 'react-router-dom';

const glassPanel = 'rounded-3xl border border-glass-border bg-glass-card backdrop-blur-2xl shadow-[0_20px_60px_rgba(2,6,23,0.65)]';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-app-bg text-text-base flex items-center justify-center px-6 py-12">
      <div className={`${glassPanel} w-full max-w-2xl text-center px-8 py-12 space-y-6`}>
        <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Error 404</p>
        <h1 className="text-4xl lg:text-5xl font-semibold">No encontramos esta página</h1>
        <p className="text-text-muted max-w-xl mx-auto">
          La ruta que intentas abrir no existe o ha sido movida. Comprueba la URL o vuelve al panel de inicio para seguir gestionando el talento.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-brand-primary text-white font-semibold hover:bg-brand-secondary transition-colors focus-visible:outline  focus-visible:outline-brand-secondary"
        >
          Regresar al panel
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;