import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import defaultLogo from '/assets/logo.png';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler);

const CHART_TYPES = ['line', 'bar', 'pie'];
const chartTypeIconMap = {
  line: 'bi-graph-up',
  bar: 'bi-bar-chart',
  pie: 'bi-pie-chart',
};
const chartTypeLabelMap = {
  line: 'Ver como línea',
  bar: 'Ver como barras',
  pie: 'Ver como pie',
};

const getCurrentTheme = () => {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.dataset.theme || 'dark';
};

const getCssVarValue = (variable) => {
  if (typeof window === 'undefined') return '';
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable);
  return value?.trim();
};

const hexToRgba = (hex, alpha = 1) => {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  let normalized = hex.replace('#', '');
  if (normalized.length === 3) {
    normalized = normalized
      .split('')
      .map((char) => `${char}${char}`)
      .join('');
  }
  const r = parseInt(normalized.substring(0, 2), 16);
  const g = parseInt(normalized.substring(2, 4), 16);
  const b = parseInt(normalized.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

const isPlainObject = (value) => value && typeof value === 'object' && !Array.isArray(value);

const deepMerge = (target, source) => {
  if (!source) return target;
  if (!target) return source;
  const output = { ...target };
  Object.keys(source).forEach((key) => {
    if (isPlainObject(source[key]) && isPlainObject(target[key])) {
      output[key] = deepMerge(target[key], source[key]);
    } else {
      output[key] = source[key];
    }
  });
  return output;
};

const ReportCard = ({
  title,
  description,
  badge = 'Inteligencia de reportes',
  actions,
  children,
  footer,
  className = '',
  bodyClassName = '',
  watermarkLogo = defaultLogo,
  watermarkLabel = 'Manapro',
  chartConfig,
  chartInitialType = 'line',
  chartTypeOptions = CHART_TYPES,
  chartHeight = 280,
}) => {
  const resolvedTypes = useMemo(() => {
    const sanitized = chartTypeOptions?.filter((type) => CHART_TYPES.includes(type));
    return sanitized?.length ? sanitized : CHART_TYPES;
  }, [chartTypeOptions]);

  const [chartType, setChartType] = useState(() => (resolvedTypes.includes(chartInitialType) ? chartInitialType : resolvedTypes[0]));
  const [themeMode, setThemeMode] = useState(getCurrentTheme);

  useEffect(() => {
    if (resolvedTypes.includes(chartInitialType)) {
      setChartType(chartInitialType);
    }
  }, [chartInitialType, resolvedTypes]);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setThemeMode(getCurrentTheme());
    });
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });

    const mediaQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;
    const handleMediaChange = (event) => {
      if (!root.dataset.theme) {
        setThemeMode(event.matches ? 'light' : 'dark');
      }
    };
    mediaQuery?.addEventListener('change', handleMediaChange);

    return () => {
      observer.disconnect();
      mediaQuery?.removeEventListener('change', handleMediaChange);
    };
  }, []);

  const chartEnabled = Boolean(chartConfig?.datasets?.length);

  const palette = useMemo(() => {
    const paletteFromConfig = chartConfig?.palette;
    if (paletteFromConfig) {
      if (Array.isArray(paletteFromConfig)) return paletteFromConfig;
      if (paletteFromConfig[themeMode]) return paletteFromConfig[themeMode];
      if (paletteFromConfig.default) return paletteFromConfig.default;
    }

    const baseColors = [
      getCssVarValue('--color-brand-primary') || '#c084fc',
      getCssVarValue('--color-brand-secondary') || '#06b6d4',
      getCssVarValue('--color-brand-accent') || '#facc15',
      getCssVarValue('--color-status-success') || '#4ade80',
      getCssVarValue('--color-status-warning') || '#fb923c',
    ];
    return baseColors;
  }, [chartConfig?.palette, themeMode]);

  const axisColor = useMemo(() => getCssVarValue('--color-text-muted') || 'rgba(148,163,184,0.7)', [themeMode]);
  const gridColor = useMemo(() => {
    const border = getCssVarValue('--color-glass-border') || 'rgba(148,163,184,0.25)';
    if (border.includes('rgb')) return border;
    return hexToRgba(border, 0.35);
  }, [themeMode]);
  const tooltipBg = themeMode === 'light' ? 'rgba(15,23,42,0.95)' : 'rgba(5,1,14,0.92)';
  const tooltipText = themeMode === 'light' ? '#f8fafc' : '#fef7ff';

  const chartData = useMemo(() => {
    if (!chartEnabled) return null;
    const labels = chartConfig.labels || [];
    const datasets = chartConfig.datasets.map((dataset, datasetIndex) => {
      const color = dataset.color || palette[datasetIndex % palette.length] || '#06b6d4';
      if (chartType === 'pie') {
        const background = dataset.backgroundColor || labels.map((_, labelIndex) => palette[labelIndex % palette.length]);
        return {
          borderWidth: 0,
          ...dataset,
          backgroundColor: background,
        };
      }

      const backgroundColor = dataset.backgroundColor || (chartType === 'line' ? hexToRgba(color, 0.25) : color);
      return {
        borderWidth: dataset.borderWidth ?? 2,
        tension: dataset.tension ?? (chartType === 'line' ? 0.35 : 0),
        fill: dataset.fill ?? (chartType === 'line'),
        borderRadius: dataset.borderRadius ?? (chartType === 'bar' ? 18 : 0),
        ...dataset,
        borderColor: dataset.borderColor || color,
        backgroundColor,
      };
    });
    return { labels, datasets };
  }, [chartConfig, chartEnabled, chartType, palette]);

  const baseOptions = useMemo(() => {
    if (!chartEnabled) return {};
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: axisColor,
            usePointStyle: true,
            pointStyle: 'circle',
          },
        },
        tooltip: {
          backgroundColor: tooltipBg,
          titleColor: tooltipText,
          bodyColor: tooltipText,
          padding: 12,
          displayColors: true,
          cornerRadius: 14,
        },
      },
    };

    if (chartType !== 'pie') {
      options.scales = {
        x: {
          grid: { color: gridColor },
          ticks: { color: axisColor },
        },
        y: {
          beginAtZero: chartConfig?.beginAtZero ?? true,
          grid: { color: gridColor },
          ticks: { color: axisColor },
        },
      };
    }

    return options;
  }, [axisColor, chartConfig?.beginAtZero, chartEnabled, chartType, gridColor, tooltipBg, tooltipText]);

  const chartOptions = useMemo(() => deepMerge(baseOptions, chartConfig?.options), [baseOptions, chartConfig?.options]);

  const chartComponents = { line: Line, bar: Bar, pie: Pie };
  const ChartComponent = chartComponents[chartType];
  const chartSection = chartEnabled && ChartComponent ? (
    <div className="w-full" style={{ minHeight: chartHeight }}>
      <ChartComponent key={chartType} data={chartData} options={chartOptions} />
    </div>
  ) : null;

  const chartTypeSelector = chartEnabled && resolvedTypes.length > 1 ? (
    <div className="inline-flex items-center gap-1 rounded-2xl border border-glass-border bg-glass-card px-1 py-1">
      {resolvedTypes.map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => setChartType(type)}
          aria-label={chartTypeLabelMap[type] || `Cambiar a ${type}`}
          className={`flex h-9 w-9 items-center justify-center rounded-xl text-base transition ${
            chartType === type
              ? 'bg-brand-secondary-soft text-brand-secondary border border-brand-secondary shadow-sm'
              : 'text-text-muted hover:text-text-base'
          }`}
        >
          <i className={`bi ${chartTypeIconMap[type]}`} />
        </button>
      ))}
    </div>
  ) : null;

  const actionsBlock = actions || chartTypeSelector ? (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
      {actions}
      {chartTypeSelector}
    </div>
  ) : null;

  return (
    <div
      className={`relative self-start glass-elevation rounded-3xl border border-glass-border bg-glass-card backdrop-blur-2xl p-6 space-y-6 ${className}`.trim()}
    >
      {(title || description || badge || actionsBlock) && (
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1 text-left">
            {badge && <p className="text-[11px] uppercase tracking-[0.35em] text-text-muted">{badge}</p>}
            {title && <h3 className="text-xl font-semibold text-text-base">{title}</h3>}
            {description && <p className="text-sm text-text-muted">{description}</p>}
          </div>
          {actionsBlock}
        </div>
      )}
      <div className={`${chartEnabled ? 'space-y-4' : ''} ${bodyClassName}`.trim()}>
        {chartSection}
        {children}
      </div>
      {footer ? <div className="border-t border-glass-border pt-4 text-sm text-text-muted">{footer}</div> : null}
      <div className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-glass-border/70 bg-glass-card/80 px-3 py-1 text-[11px] font-semibold text-text-muted shadow-sm">
        <img src={watermarkLogo} alt="Logo" className="h-4 w-auto" />
        <span className="uppercase tracking-[0.3em]">{watermarkLabel}</span>
      </div>
    </div>
  );
};

ReportCard.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  badge: PropTypes.string,
  actions: PropTypes.node,
  children: PropTypes.node,
  footer: PropTypes.node,
  className: PropTypes.string,
  bodyClassName: PropTypes.string,
  watermarkLogo: PropTypes.string,
  watermarkLabel: PropTypes.string,
  chartConfig: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    datasets: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      data: PropTypes.arrayOf(PropTypes.number),
      backgroundColor: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
      borderColor: PropTypes.string,
      borderWidth: PropTypes.number,
      tension: PropTypes.number,
      fill: PropTypes.bool,
      borderRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    })),
    options: PropTypes.object,
    palette: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.shape({
        light: PropTypes.arrayOf(PropTypes.string),
        dark: PropTypes.arrayOf(PropTypes.string),
        default: PropTypes.arrayOf(PropTypes.string),
      }),
    ]),
    beginAtZero: PropTypes.bool,
  }),
  chartInitialType: PropTypes.oneOf(CHART_TYPES),
  chartTypeOptions: PropTypes.arrayOf(PropTypes.oneOf(CHART_TYPES)),
  chartHeight: PropTypes.number,
};

export default ReportCard;
