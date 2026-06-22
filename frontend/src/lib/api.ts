const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4035/api';

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string | null;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'İstek başarısız' }));
    throw new ApiError(response.status, error.message || 'İstek başarısız');
  }

  return response.json();
}

function listRequest(endpoint: string, token: string, params?: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) query.set(key, String(value));
    });
  }
  const qs = query.toString();
  return request(`${endpoint}${qs ? `?${qs}` : ''}`, { token });
}

export const api = {
  auth: {
    register: (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      facilityName: string;
      phone?: string;
      city?: string;
      district?: string;
    }) => request('/auth/register', { method: 'POST', body: data }),

    login: (data: { email: string; password: string }) =>
      request('/auth/login', { method: 'POST', body: data }),

    me: (token: string) => request('/auth/me', { token }),
  },

  dashboard: {
    stats: (token: string) => request('/dashboard/stats', { token }),
  },

  pets: {
    list: (token: string, params?: { page?: number; species?: string }) =>
      listRequest('/pets', token, params),
    create: (token: string, data: Record<string, unknown>) =>
      request('/pets', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/pets/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/pets/${id}`, { method: 'DELETE', token }),
  },

  rooms: {
    list: (token: string, params?: { status?: string; roomType?: string }) =>
      listRequest('/rooms', token, params),
    create: (token: string, data: Record<string, unknown>) =>
      request('/rooms', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/rooms/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/rooms/${id}`, { method: 'DELETE', token }),
  },

  bookings: {
    list: (token: string, params?: { page?: number; status?: string }) =>
      listRequest('/bookings', token, params),
    create: (token: string, data: Record<string, unknown>) =>
      request('/bookings', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/bookings/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/bookings/${id}`, { method: 'DELETE', token }),
  },

  careLogs: {
    list: (token: string, params?: { page?: number; petId?: string; careType?: string }) =>
      listRequest('/care-logs', token, params),
    create: (token: string, data: Record<string, unknown>) =>
      request('/care-logs', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/care-logs/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/care-logs/${id}`, { method: 'DELETE', token }),
  },

  owners: {
    list: (token: string, params?: { page?: number; search?: string }) =>
      listRequest('/owners', token, params),
    create: (token: string, data: Record<string, unknown>) =>
      request('/owners', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/owners/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/owners/${id}`, { method: 'DELETE', token }),
  },
};

export { ApiError };
