const API_BASE_URL = import.meta.env.PROD 
  ? 'https://tuinue-wasichana-api-jauh.onrender.com' 
  : 'http://localhost:5000/api';

export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const endpoint = url.startsWith('/') ? url : `/${url}`;
  
  console.log(`Fetching ${API_BASE_URL}${endpoint} with token: ${token ? 'present' : 'missing'}`);
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    credentials: 'include'
  });

  if (!response.ok) {
    if (response.status === 401) {
      console.warn('Unauthorized request, clearing localStorage and redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
      return;
    }
    try {
      const error = await response.json();
      const errorObj = new Error(error.message || 'Request failed');
      errorObj.status = response.status;
      throw errorObj;
    } catch (e) {
      const errorObj = new Error(`Request failed with status ${response.status}`);
      errorObj.status = response.status;
      throw errorObj;
    }
  }

  return response.json();
};