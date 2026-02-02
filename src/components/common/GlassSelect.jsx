import { useEffect, useRef, useState } from 'react';

const GlassSelect = ({
  value,
  options = [],
  onChange,
  placeholder = 'Seleccionar',
  icon,
  className = '',
  buttonClassName = '',
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!containerRef.current || containerRef.current.contains(event.target)) return;
      setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (optionValue) => {
    onChange?.(optionValue);
    setOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between gap-3 rounded-2xl border border-glass-border bg-transparent px-4 py-3 text-sm text-text-base transition focus:outline-none focus:ring-2 focus:ring-brand-secondary ${buttonClassName}`}
      >
        <div className="flex items-center gap-2">
          {icon && <i className={`${icon} text-text-muted`} />}
          <span className={selectedOption ? 'text-text-base' : 'text-text-muted'}>
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <i className={`bi ${open ? 'bi-chevron-up' : 'bi-chevron-down'} text-text-muted`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 w-full overflow-hidden rounded-2xl border border-glass-border bg-glass-card backdrop-blur-xl shadow-[0_20px_60px_rgba(2,6,23,0.65)]">
          <ul className="max-h-60 overflow-y-auto py-2">
            {options.map((option) => {
              const isActive = option.value === value;
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    className={`flex w-full items-center justify-between px-4 py-2 text-sm transition hover:bg-glass-card-strong ${isActive ? 'text-brand-secondary' : 'text-text-base'}`}
                    onClick={() => handleSelect(option.value)}
                  >
                    <span>{option.label}</span>
                    {isActive && <i className="bi bi-check-lg text-brand-secondary" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GlassSelect;
