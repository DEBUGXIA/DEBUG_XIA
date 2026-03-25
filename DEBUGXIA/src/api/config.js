const API_BASE_URL = 'http://localhost:8000/api';

export const api = {
  // User Authentication
  signup: async (fullName, email, password, passwordConfirm) => {
    const response = await fetch(`${API_BASE_URL}/users/signup/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        username: email,
        first_name: fullName,
        password,
        password_confirm: passwordConfirm,
      }),
    });
    return response.json();
  },

  signin: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/users/signin/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    return response.json();
  },

  getCurrentUser: async (token) => {
    const response = await fetch(`${API_BASE_URL}/users/me/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  logout: async (token) => {
    const response = await fetch(`${API_BASE_URL}/users/logout/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },
};
