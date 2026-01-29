const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-slate-950 shadow-[0_-10px_40px_rgba(2,6,23,0.8)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4 text-xs text-white/70">
        <span className="tracking-[0.4em] uppercase text-white/40">CONTROL DE RECLUTAMIENTO</span>
        <p className="text-sm text-white/70">
          © {new Date().getFullYear()} Reclutamiento. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;