Purpose
Este archivo ofrece orientación focalizada y accionable para los agentes de codificación IA (Copilot) que trabajan en este repositorio, de modo que puedan ser productivos de inmediato.

Hechos rápidos
- Framework: React 19 + Vite
- Routing: react-router-dom (ver `src/routes/AllRoutes.jsx`)
- Estado y auth: contexto ligero en `src/context/AuthContext.jsx`
- Cliente API: instancia centralizada de Axios en `src/api/axiosInstance.jsx` (baseURL usa VITE_API_URL)
- Hooks: la lógica de negocio vive en `src/hooks/*` (por ejemplo `usePromotions.jsx`, `useProducts.jsx`)

Qué modificar y cómo
- Las páginas de UI están en `src/pages` y se montan desde `AllRoutes.jsx`. Añade nuevas páginas y actualiza las rutas allí.
- Componentes reutilizables están en `src/components`. Sigue los patrones existentes para formularios (los componentes suelen usar estado local + hooks en `src/hooks`).
- Las llamadas a la API deben usar la `axiosInstance` compartida para que la inyección del header de auth y el manejo de errores se mantengan consistentes. Ejemplo: `axiosInstance.post('/promotions/save', data)`.

Checklist rápido al añadir una nueva pantalla/página
- Crea un hook en `src/hooks` para la lógica del dominio (nómbralo `use<Feature>.jsx`) y usa `axiosInstance` para llamadas de red.
- Crea componentes bajo `src/components/<Feature>`: como mínimo un componente de tabla/lista y un componente de formulario/modal (sigue los patrones en `src/components/Promotions`).
- Crea la página en `src/pages/<Feature>Page/<Feature>Page.jsx`. Sigue la estructura y estilo del ejemplo perfecto del sistema (ver más abajo).
  - Estructura esperada: header (izquierda) + botón de acción (derecha), spinner mientras carga, luego el componente principal (tabla/formulario/modal).
- Exporta la página desde `src/pages/index.jsx` (añade la importación y añade en la lista exportada). Olvidar esto suele causar `ReferenceError: <PageName> is not defined` en tiempo de ejecución.
- Añade una ruta en `src/routes/AllRoutes.jsx` envuelta con `PrivateRoute` cuando la página requiera autenticación. Asegúrate de que el nombre de la página esté presente en la desestructuración de imports desde `../pages` en la parte superior de `AllRoutes.jsx`.
- Añade una entrada en la barra lateral en `src/components/layout/SideBar/Sidebar.jsx` (añade item con `to: '/tu-path'` y un icono). El Sidebar determina `isActive` automáticamente usando `location.pathname.startsWith(item.to)`.
- Ejecuta `npm run dev` y abre la página; si ves un ReferenceError, revisa primero `src/pages/index.jsx` y `src/routes/AllRoutes.jsx` por imports/exports incorrectos.

Notas de Auth y routing
- `AuthContext.jsx` persiste token/usuario en localStorage o sessionStorage y expone `login`, `logout`, `updateUser`, `useAuth()`.
- La protección de rutas usa `src/routes/PrivateRoute.jsx`: retorna un spinner mientras `authLoading` es true; si no está autenticado redirige a `/login`.

Convenciones y patrones que debe seguir la IA
- Red (Network): siempre usar `src/api/axiosInstance.jsx`. El proyecto espera que VITE_API_URL esté configurada (env var) y `baseURL` es `${VITE_API_URL}api/admin`.
- Manejo de errores: `axiosInstance` adjunta `friendlyMessage` a errores rechazados — prefiere mostrar `error.friendlyMessage` a los usuarios.
- Hooks: la lógica del dominio debe residir en `src/hooks/*`; añade o actualiza hooks antes que incrustar lógica de API compleja dentro de componentes.
- Formularios: las subidas de archivos usan FormData; revisa ejemplos existentes en `useProducts.jsx`, `useRegisterEnterprise.jsx`.
- Imágenes: usa `IMAGE_BASE_URL` exportado desde `src/api/axiosInstance.jsx` al construir URLs de imágenes en tablas/componentes.
- Notificaciones de UI: para mostrar errores y mensajes de éxito usa los componentes comunes del proyecto (no crear reemplazos sin coordinar):
  - ErrorNotification: C:\Users\pc\Desktop\core_administrativo\src\components\common\ErrorNotification.jsx
  - SuccessNotification: C:\Users\pc\Desktop\core_administrativo\src\components\common\SuccessNotification.jsx
  - Utiliza estos componentes exportados para mostrar mensajes de usuario con el formato y estilos del proyecto.
- Código limpio (regla obligatoria): no pongas comentarios dentro del código. El código debe mantenerse limpio y sin comentarios. Si necesitas explicar decisiones o contextos, agrégalo fuera del código (por ejemplo, en la descripción del PR o en el cuerpo de la issue), no como comentarios en los archivos fuente.

Estilos, tablas y modales (convenciones específicas del proyecto)
- Todas las tablas deben usar el componente común:
  - C:\Users\JorgeDanielMartínezR\Desktop\Core_administrativo\src\components\common\DataTable.jsx
- Un ejemplo de tabla a seguir (estructura y estilos) es:
  - C:\Users\JorgeDanielMartínezR\Desktop\Core_administrativo\src\components\Pagos\PagosTable.jsx
- Todos los estilos visuales principales se definen con Tailwind. Los iconos se utilizan desde Bootstrap (Bootstrap Icons) y se incluyen dentro de la clase Tailwind correspondiente.
- Colores predominantes:
  - Color de detalle: bg-oscuro
  - Fondo/principal: blanco
- Para modales, usar siempre el componente común:
  - C:\Users\JorgeDanielMartínezR\Desktop\Core_administrativo\src\components\common\CustomModal.jsx
  - Puedes revisar:
    - C:\Users\JorgeDanielMartínezR\Desktop\Core_administrativo\src\components\products\ProductsImportModal.jsx
    como ejemplo para ver estilos y uso del modal en contexto.

Archivos que explican el comportamiento central (cítalos primero)
- `src/main.jsx` — entrada de la app, envuelve con `AuthProvider` y `BrowserRouter`.
- `src/App.jsx` — decisiones de layout: rutas públicas vs protegidas, renderizado de sidebar/header.
- `src/api/axiosInstance.jsx` — baseURL, interceptores, mapeo de friendly errors, exporta IMAGE_BASE_URL.
- `src/context/AuthContext.jsx` — almacenamiento del token, flujo login/logout y obtención de usuario.
- `src/routes/AllRoutes.jsx` — tabla de rutas; añade/quita entradas aquí para nuevas páginas.

Ejemplo perfecto de estructura de página en el sistema
- Página de referencia (estructura deseada): 
  - C:\Users\pc\Desktop\core_administrativo\src\pages\PagosPage\PagosPage.jsx
  - Observa que esta página sigue el patrón: header (izquierda) + botón de acción (derecha), luego spinner y el componente principal (tabla/form/modal). Usa este archivo como plantilla mental para nuevas pantallas.

Casos límite y puntos donde hay que tener cuidado
- VITE_API_URL ausente: muchas funciones fallan silenciosamente o apuntan a la URL base incorrecta — configura la env var al probar.
- Manejo de token: el token puede estar en localStorage o sessionStorage. Cuando escribas pruebas o scripts automáticos, considera poblar ambos si es necesario.
- Algunas consultas asumen formas de datos devueltas por el servidor (por ejemplo, estructura de `response.data`). Revisa los hooks existentes en `src/hooks/*` para empatar las formas de datos.

Si necesitas más
- Pide el contrato de la API (endpoints de ejemplo y formas de respuesta) si necesitas implementar formularios complejos o validaciones.
- Solicita ejemplos adicionales de tablas o modales si quieres que adapte un nuevo Feature exactamente al estilo del proyecto.

Notas finales rápidas (resumen de reglas obligatorias)
- Usa siempre `axiosInstance` para llamadas HTTP.
- Usa los hooks en `src/hooks/*` para lógica de dominio.
- Muestra errores y éxitos con los componentes ErrorNotification/SuccessNotification indicados.
- No pongas comentarios dentro del código (código limpio).
- Sigue la estructura de `PagosPage` como ejemplo para nuevas páginas.