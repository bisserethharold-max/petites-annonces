import { apiFetch } from './api.js';

export async function loginUser(email, password) {
  try {
    const response = await apiFetch('/auth/login', 'POST', { email, password });
    
    if (response.token) {
      localStorage.setItem('jwt_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      window.location.href = '/index.html';
    }
  } catch (error) {
    alert(`Échec de la connexion : ${error.message}`);
  }
}

export function logoutUser() {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('user');
  window.location.href = '/login.html';
}