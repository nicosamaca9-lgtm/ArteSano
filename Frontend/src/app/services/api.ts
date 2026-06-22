const BASE_URL = 'http://localhost:3000/api/v1';

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const defaultOptions: RequestInit = {
    credentials: 'include', // Para enviar/recibir cookies httpOnly
    headers: {
      ...options.headers,
    },
  };

  // Solo añadimos Content-Type application/json si no es un FormData (importante para subir imágenes)
  if (!(options.body instanceof FormData)) {
    defaultOptions.headers = {
      'Content-Type': 'application/json',
      ...defaultOptions.headers,
    };
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, ...defaultOptions });
  
  // En caso de que haya una respuesta vacía (ej. 204 No Content), evitamos que JSON lance error
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.error_message || data.message || 'Error en la petición');
  }

  return data;
};
