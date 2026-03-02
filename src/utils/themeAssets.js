import logoDark from '/assets/logo_modo_oscuro.png';
import logoLight from '/assets/logo_modo_claro.png';
import logoInstitutionalDark from '/assets/logo_institucional_oscuro.png';
import logoInstitutionalLight from '/assets/logo_institucional_claro.png';

export const getThemeFromDom = () => {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.dataset.theme || 'dark';
};

export const getLogoByTheme = (theme) => (theme === 'light' ? logoLight : logoDark);

export const getInstitutionalLogoByTheme = (theme) =>
  theme === 'light' ? logoInstitutionalLight : logoInstitutionalDark;

export const subscribeToThemeChanges = (onChange) => {
  if (typeof document === 'undefined' || typeof MutationObserver === 'undefined' || !onChange) return () => {};
  const root = document.documentElement;
  const observer = new MutationObserver(() => {
    onChange(getThemeFromDom());
  });
  observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
};
