import PropTypes from 'prop-types';
import logo from '/assets/logo.png';

const ReportCard = ({
  title,
  description,
  badge = 'Inteligencia de reportes',
  actions,
  children,
  footer,
  className = '',
  bodyClassName = '',
}) => {
  return (
    <div
      className={`relative self-start glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-2xl p-6 space-y-6 ${className}`.trim()}
    >
      {(title || description || badge || actions) && (
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1 text-left">
            {badge && <p className="text-[11px] uppercase tracking-[0.35em] text-text-muted">{badge}</p>}
            {title && <h3 className="text-xl font-semibold text-text-base">{title}</h3>}
            {description && <p className="text-sm text-text-muted">{description}</p>}
          </div>
          {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
      {footer ? <div className="border-t border-glass-border pt-4 text-sm text-text-muted">{footer}</div> : null}
      <div className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-glass-border/70 bg-glass-card/80 px-3 py-1 text-[11px] font-semibold text-text-muted shadow-sm">
        <img src={logo} alt="Logo Manapro" className="h-4 w-auto" />
        <span className="uppercase tracking-[0.3em]">Manapro</span>
      </div>
    </div>
  );
};

ReportCard.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  badge: PropTypes.string,
  actions: PropTypes.node,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  className: PropTypes.string,
  bodyClassName: PropTypes.string,
};

export default ReportCard;
