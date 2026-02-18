import { useState } from 'react';

const BudgetsUploadPage = () => {
  const glassPanel = 'glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-xl';
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState('Listo para cargar');

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setStatus('Archivo cargado, pendiente de enviar');
    }
  };

  const triggerInput = () => {
    const input = document.getElementById('budget-upload');
    if (input) input.click();
  };

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <header className="flex flex-col gap-6 mb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-semibold text-text-base">Carga y aprobación</h1>
            <p className="text-sm text-text-muted">Descarga la plantilla, sube el archivo y envíalo a aprobación del dueño.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-2xl border border-glass-border px-4 py-2 text-sm font-semibold text-text-base transition hover:border-brand-secondary">
              Descargar plantilla Excel
            </button>
            <button className="rounded-2xl bg-brand-secondary px-4 py-2 text-sm font-semibold text-text-base transition hover:bg-brand-secondary-soft" onClick={() => setStatus('Enviado a aprobación')}>
              Enviar a aprobación
            </button>
          </div>
        </div>
      </header>

      <section className={`${glassPanel} p-6 space-y-4`}>
        <div className="rounded-2xl border-2 border-dashed border-glass-border bg-glass-card-strong p-6 flex flex-col items-center gap-3 text-sm text-text-muted">
          <input id="budget-upload" type="file" className="hidden" onChange={handleFile} />
          <i className="bi bi-cloud-arrow-up text-2xl text-brand-secondary" />
          <p>Arrastra y suelta o</p>
          <button
            type="button"
            onClick={triggerInput}
            className="rounded-2xl border border-glass-border px-4 py-2 text-sm font-semibold text-text-base transition hover:border-brand-secondary"
          >
            Seleccionar archivo
          </button>
          {fileName && <p className="text-xs text-text-base">{fileName}</p>}
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-glass-border bg-glass-card px-4 py-3 text-sm">
          <span className="text-text-muted">Estatus actual</span>
          <span className="font-semibold text-text-base">{status}</span>
        </div>
      </section>
    </div>
  );
};

export default BudgetsUploadPage;
