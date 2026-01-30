Purpose
Guía operativa para cualquier agente Copilot que toque este repositorio. Resume los archivos clave, patrones aprobados y errores comunes que debemos evitar.

Quick facts
- **Stack**: React 19 + Vite + Tailwind v4 (`@theme` vive en `src/index.css`).
- **Routing**: `react-router-dom`; las rutas se registran en `src/routes/AllRoutes.jsx` y se protegen con `PrivateRoute`.
- **Estado/Auth**: `AuthProvider` (`src/context/AuthContext.jsx`) guarda token/usuario (localStorage o sessionStorage) y expone `useAuth`, `login`, `logout`, `updateUser`.
- **HTTP**: siempre usa `src/api/axiosInstance.jsx` (inyecta encabezados, transforma errores a `friendlyMessage`, exporta `IMAGE_BASE_URL`).
- **Hooks**: la lógica de dominio vive en `src/hooks/*`. Los componentes solo consumen hooks y manejan estado local/UI.

Theme & styling
- Tokens declarados en `@theme` (`src/index.css`). Usa utilidades como `bg-app-bg`, `bg-glass-card`, `text-text-muted`, `border-glass-border`, `from-surface-start`, etc. No uses `bg-[var(--...)]`.
- Layout general: `App.jsx` pinta header, sidebar, footer y children sobre `bg-app-bg`. Mantén la jerarquía.
- Formularios/tarjetas = vidrio (`bg-glass-card`, `border-glass-border`, `backdrop-blur`). Inputs usan `focus:ring-brand-secondary` y `text-text-base`/`text-text-muted`.
- Gradientes y badges usan alias (`from-brand-primary`, `bg-status-success-soft`, ...). Si falta un alias, agrégalo en `@theme`.
- Notificaciones: `components/common/ErrorNotification.jsx` y `SuccessNotification.jsx`. Tablas: `components/common/DataTable.jsx`. Modales: `components/common/CustomModal.jsx`.
- Iconos: Bootstrap Icons mediante clases (`bi bi-eye`).

Arquitectura clave
- `src/main.jsx`: monta `AuthProvider` + `BrowserRouter`.
- `src/App.jsx`: organiza layout e inyecta sidebar/header según ruta.
- `src/routes/AllRoutes.jsx`: importa páginas desde `src/pages/index.jsx` y arma la matriz de rutas.
- `src/routes/PrivateRoute.jsx`: muestra loader hasta conocer el estado auth y redirige a `/login` si no hay sesión.
- `src/api/axiosInstance.jsx`: baseURL (`${VITE_API_URL}api/admin`), interceptores, `IMAGE_BASE_URL`.

Checklist para nuevas pantallas
1. **Hook**: crea `src/hooks/use<Feature>.jsx` y usa `axiosInstance` para toda IO.
2. **Componentes**: arma UI en `src/components/<Feature>/` (listas/tablas, formularios, modales) reutilizando patrones existentes.
3. **Página**: `src/pages/<Feature>Page.jsx` con header (texto izquierda + CTA derecha), spinner y contenido principal.
4. **Export**: agrega la página al barrel `src/pages/index.jsx`.
5. **Ruta**: importa la página en `src/routes/AllRoutes.jsx` y añade tu `<Route>` (envuelto en `PrivateRoute` si aplica).


Patrones obligatorios
- Hooks = única fuente de verdad para lógica de negocio. No hagas `axios` directo desde componentes.
- Errores: muestra `error.friendlyMessage` cuando exista y usa los componentes de notificación comunes.
- Cero comentarios en código fuente; documenta decisiones en la PR/issue.
- Subidas de archivos => `FormData` (revisa `useProducts.jsx`).
- URLs de imagen => `IMAGE_BASE_URL` + path del backend.
- Toda página nueva debe envolverse en un div con este patrón exacto para mantener la consistencia: <div className="min-h-screen bg-app-bg text-text-base p-6 space-y-8">

Auth & edge cases
- El token puede venir de localStorage **o** sessionStorage. Al escribir scripts/tests, limpia ambos.
- Si `VITE_API_URL` no está seteado, las llamadas apuntan a `undefinedapi/admin`. Valida la env antes de depurar.
- Algunos endpoints devuelven `response.data.data`. Examina hooks existentes antes de asumir la forma.

UI references
- Layout general: `src/pages/HomePage/HomePage.jsx`.
- Formularios Auth: `src/components/login/*`, `src/components/register/RegisterForm.jsx`, `src/components/forgotPassword/ForgotPasswordForm.jsx`.
- Sidebar/Header/Footer: `src/components/layout/*`.

Cuando tengas dudas
- Pide el contrato/endpoints del backend si necesitas payloads exactos.
- Solicita ejemplos de tablas/modales existentes antes de inventar nuevos estilos.







