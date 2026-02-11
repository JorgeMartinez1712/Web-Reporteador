import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const STATUS_STORAGE_KEY = 'interestedOnboardingStatus';

const requirements = [
  {
    id: 'rif',
    title: 'RIF vigente',
    detail: 'Documento fiscal actualizado en PDF o imagen.',
  },
  {
    id: 'mercantil',
    title: 'Registro mercantil',
    detail: 'Ultima acta o modificacion registrada.',
  },
  {
    id: 'cedula',
    title: 'Cedula del representante',
    detail: 'Ambas caras en alta resolucion.',
  },
  {
    id: 'direccion',
    title: 'Comprobante de direccion fiscal',
    detail: 'Recibo de servicio o estado de cuenta.',
  },
  {
    id: 'autorizacion',
    title: 'Carta de autorizacion',
    detail: 'Documento firmado por el representante legal.',
  },
];

const RequirementsChecklistPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const glassPanel = 'glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-xl';
  const [uploads, setUploads] = useState(() =>
    requirements.reduce((acc, item) => ({ ...acc, [item.id]: null }), {}),
  );
  const [activeRequirementId, setActiveRequirementId] = useState(requirements[0]?.id || '');
  const uploadsRef = useRef(uploads);

  useEffect(() => {
    uploadsRef.current = uploads;
  }, [uploads]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const focusId = params.get('focus');
    if (focusId) {
      setActiveRequirementId(focusId);
    }
  }, [location.search]);

  useEffect(() => () => {
    Object.values(uploadsRef.current).forEach((item) => {
      if (item?.url) {
        URL.revokeObjectURL(item.url);
      }
    });
  }, []);

  const uploadedCount = useMemo(
    () => requirements.filter((item) => Boolean(uploads[item.id])).length,
    [uploads],
  );
  const totalRequired = requirements.length;
  const isComplete = uploadedCount === totalRequired;

  const activeRequirement = useMemo(
    () => requirements.find((item) => item.id === activeRequirementId) || requirements[0],
    [activeRequirementId],
  );
  const activeUpload = activeRequirement?.id ? uploads[activeRequirement.id] : null;

  const updateUpload = (requirementId, file) => {
    if (!requirementId) return;
    setUploads((prev) => {
      const existing = prev[requirementId];
      if (existing?.url) {
        URL.revokeObjectURL(existing.url);
      }
      return {
        ...prev,
        [requirementId]: {
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type,
        },
      };
    });
  };

  const handleFileSelection = (event, requirementId) => {
    const file = event.target.files?.[0];
    if (!file) return;
    updateUpload(requirementId, file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file || !activeRequirement?.id) return;
    updateUpload(activeRequirement.id, file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleSubmitRequirements = () => {
    if (!isComplete) return;
    const nextStatus = {
      status: 'in_review',
      observations: [],
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(nextStatus));
    navigate('/revision');
  };

  return (
    <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">
      <header className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-semibold text-text-base">Carga de requisitos</h1>
            <p className="text-sm text-text-muted">
              Completa el checklist para activar el analisis financiero.
            </p>
          </div>
          <button
            type="button"
            disabled={!isComplete}
            onClick={handleSubmitRequirements}
            className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
              isComplete
                ? 'bg-brand-secondary text-text-base hover:bg-brand-secondary-soft'
                : 'border border-glass-border text-text-muted cursor-not-allowed'
            }`}
          >
            Enviar requisitos
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className={`${glassPanel} lg:col-span-2 p-6 space-y-5`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Checklist dinamico</p>
              <p className="text-lg font-semibold text-text-base">Documentos obligatorios</p>
            </div>
            <span className="text-sm text-text-muted">
              Llevas {uploadedCount} de {totalRequired} documentos cargados
            </span>
          </div>

          <div className="space-y-3">
            {requirements.map((item) => {
              const isUploaded = Boolean(uploads[item.id]);
              const isActive = item.id === activeRequirementId;
              return (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveRequirementId(item.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      setActiveRequirementId(item.id);
                    }
                  }}
                  className={`rounded-2xl border border-glass-border p-4 transition cursor-pointer ${
                    isActive ? 'bg-glass-card-strong' : 'bg-glass-card'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-text-base">{item.title}</p>
                      <p className="text-xs text-text-muted">{item.detail}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-semibold ${
                          isUploaded ? 'text-status-success' : 'text-text-muted'
                        }`}
                      >
                        {isUploaded ? 'Cargado' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`${glassPanel} lg:col-span-3 p-6 space-y-6`}>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Dropzone</p>
            <h2 className="text-lg font-semibold text-text-base">Sube {activeRequirement?.title}</h2>
            <p className="text-sm text-text-muted">Arrastra el archivo o haz click para cargar.</p>
          </div>

          <label
            htmlFor="requirement-file"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-glass-border bg-glass-card-strong px-6 text-center"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-glass-card">
              <i className="bi bi-cloud-arrow-up text-2xl text-brand-secondary" />
            </span>
            <p className="mt-4 text-sm text-text-muted">
              {activeUpload?.name
                ? `Archivo cargado: ${activeUpload.name}`
                : 'Arrastra y suelta aqui tu documento o selecciona un archivo.'}
            </p>
            <span className="mt-3 text-xs uppercase tracking-[0.25em] text-text-muted">
              PDF, JPG o PNG
            </span>
            {activeUpload?.url && activeUpload?.type?.startsWith('image/') && (
              <img
                src={activeUpload.url}
                alt={`Vista previa de ${activeRequirement?.title}`}
                className="mt-5 w-full max-w-md rounded-2xl border border-glass-border object-cover"
              />
            )}
            <input
              id="requirement-file"
              type="file"
              className="hidden"
              onChange={(event) => handleFileSelection(event, activeRequirement?.id)}
            />
          </label>

          <div className="flex flex-wrap gap-3 text-xs text-text-muted">
            <span className="rounded-full border border-glass-border px-3 py-1">
              Progreso {Math.round((uploadedCount / totalRequired) * 100)}%
            </span>
            <span className="rounded-full border border-glass-border px-3 py-1">
              Validacion manual posterior
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RequirementsChecklistPage;
