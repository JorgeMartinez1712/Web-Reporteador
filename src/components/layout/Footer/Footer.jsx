const Footer = () => {
  return (
    <footer className="border-t border-glass-border bg-app-bg">
      <div className="flex items-center justify-between px-8 py-4 text-xs text-text-muted">
        <span className="tracking-[0.4em] uppercase text-text-muted">SISTEMA DE REPORTES</span>
        <p className="text-sm text-text-muted">
          © {new Date().getFullYear()} Reporteador. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;