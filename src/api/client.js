// Cliente HTTP base reutilizable para AIVA Studio API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * Función wrapper genérica sobre fetch con manejo de JSON y control de excepciones HTTP
 */
export async function apiClient(endpoint, { body, ...customConfig } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  // Inyección de token si existe en localStorage
  const token = localStorage.getItem('aiva_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  } catch (networkError) {
    throw new Error('No se pudo conectar con el servidor de AIVA Studio (Spring Boot).', { cause: networkError });
  }

  // Si la respuesta es 204 No Content, retornamos éxito directo sin parsear JSON
  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || `Error en la petición: HTTP ${response.status}`);
  }

  return data;
}

export default apiClient;