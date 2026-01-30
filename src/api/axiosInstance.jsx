import axios from 'axios';

export const IMAGE_BASE_URL = 'https://localhost:8000';

const axiosInstance = axios.create({
  baseURL: 'https://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const getFriendlyErrorMessage = (status, serverMsg) => {
  if (serverMsg) return serverMsg;

  switch (status) {
    case 400:
      return 'Solicitud incorrecta. Verifique los datos enviados.';
    case 401:
      return 'No autorizado. Su sesión ha expirado o no tiene permisos.';
    case 403:
      return 'Acceso denegado. No tiene permiso para acceder a este recurso.';
    case 404:
      return 'El recurso solicitado no fue encontrado.';
    case 408:
      return 'Tiempo de espera de la solicitud agotado.';
    case 429:
      return 'Demasiadas solicitudes. Por favor, intente de nuevo más tarde.';
    case 500:
      return 'Error interno del servidor. Por favor, intente más tarde.';
    case 502:
      return 'Puerta de enlace no válida.';
    case 503:
      return 'Servicio no disponible. El servidor está inactivo o en mantenimiento.';
    case 504:
      return 'Tiempo de espera de la solicitud agotado.';
    default:
      return `Error ${status}: Ha ocurrido un error inesperado.`;
  }
};

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const hasResponse = Boolean(error && error.response);

    if (hasResponse) {
      const { status, data } = error.response;
      const serverMsgRaw = data?.message ?? data ?? null;
      let serverMsg = null;

      if (typeof serverMsgRaw === 'string') {
        serverMsg = serverMsgRaw;
      } else if (serverMsgRaw && typeof serverMsgRaw === 'object') {
        serverMsg = serverMsgRaw.message || serverMsgRaw.error || JSON.stringify(serverMsgRaw);
      }

      const friendlyMessage = getFriendlyErrorMessage(status, serverMsg);

      error.message = friendlyMessage;
      error.friendlyMessage = friendlyMessage;

      if (status === 401 || status === 403) {
        if (!error.config?.url?.endsWith?.('/login')) {
          console.warn('Acceso no autorizado o sesión expirada. Esto puede requerir una redirección.');
        }
      } else if (status >= 500) {
        console.error(`Error ${status} (Error del Servidor):`, error.response);
      } else if (status >= 400) {
        console.warn(`Error ${status} (Error del Cliente):`, error.response);
      }

    } else {
      const friendly = error?.message?.includes('Network Error') ? 'Error de red. Verifique su conexión.' : 'Error de red o servidor no disponible';
      error.message = friendly;
      error.friendlyMessage = friendly;
      console.error('Network or unknown error:', error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;