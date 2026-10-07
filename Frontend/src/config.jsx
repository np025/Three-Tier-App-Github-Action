// src/config.js
// export const API_URL = import.meta.env.VITE_BACKEND_URL;
export const API_URL = ((window)['env'] && (window)['env']['apiUrl']) ?? 'http://localhost:8080/api';