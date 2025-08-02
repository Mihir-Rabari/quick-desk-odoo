const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(response.status, errorData.message || 'Request failed');
    }

    return response.json();
  }

  // Auth endpoints
  auth = {
    register: (data: { name: string; email: string; password: string }) =>
      this.request<{ token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    login: (data: { email: string; password: string }) =>
      this.request<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    me: () => this.request<{ user: any }>('/auth/me'),

    updateProfile: (data: any) =>
      this.request<{ user: any }>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    requestUpgrade: () =>
      this.request<{ message: string }>('/auth/request-upgrade', {
        method: 'POST',
      }),

    getUpgradeRequests: () =>
      this.request<any[]>('/auth/upgrade-requests'),

    approveUpgrade: (id: string, approved: boolean) =>
      this.request<{ message: string }>(`/auth/approve-upgrade/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ approved }),
      }),
  };

  // Questions endpoints
  questions = {
    create: (data: { title: string; description: string; tags: string[]; category?: string }) =>
      this.request<any>('/questions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    list: (params?: { search?: string; category?: string; tag?: string; page?: number; limit?: number }) => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }
      const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
      return this.request<{ questions: any[]; pagination: any }>(`/questions${query}`);
    },

    getById: (id: string) => this.request<any>(`/questions/${id}`),

    update: (id: string, data: any) =>
      this.request<any>(`/questions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      this.request<{ message: string }>(`/questions/${id}`, {
        method: 'DELETE',
      }),

    vote: (id: string, type: 'up' | 'down') =>
      this.request<any>(`/questions/${id}/vote`, {
        method: 'POST',
        body: JSON.stringify({ type }),
      }),

    addAnswer: (id: string, content: string) =>
      this.request<any>(`/questions/${id}/answer`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      }),
  };

  // Dashboard endpoints
  dashboard = {
    adminOverview: () => this.request<any>('/dashboard/admin/overview'),
    userStats: () => this.request<any>('/dashboard/user/stats'),
    adminStats: () => this.request<any>('/admin/dashboard/stats'),
    databaseStats: () => this.request<any>('/admin/database/stats'),
    systemHealth: () => this.request<any>('/admin/system/health'),
    agentOverview: () => this.request<any>('/dashboard/agent/overview'),
    getTickets: (params?: { page?: number; limit?: number; status?: string; category?: string; search?: string; sortBy?: string }) => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }
      const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
      return this.request<{ tickets: any[]; totalPages: number; currentPage: number; total: number }>(`/dashboard/tickets${query}`);
    },
  };

  // Admin endpoints
  admin = {
    categories: {
      create: (data: { name: string; description?: string; color?: string }) =>
        this.request<any>('/admin/categories', {
          method: 'POST',
          body: JSON.stringify(data),
        }),

      list: () => this.request<any[]>('/admin/categories'),

      update: (id: string, data: any) =>
        this.request<any>(`/admin/categories/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        }),

      delete: (id: string) =>
        this.request<{ message: string }>(`/admin/categories/${id}`, {
          method: 'DELETE',
        }),
    },

    users: {
      list: (params?: { page?: number; limit?: number; search?: string }) => {
        const queryParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
              queryParams.append(key, value.toString());
            }
          });
        }
        const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
        return this.request<{ users: any[]; pagination: any }>(`/admin/users${query}`);
      },

      create: (data: { name: string; email: string; password: string; role?: string; language?: string; categoryInInterest?: string[] }) =>
        this.request<{ user: any }>('/admin/users', {
          method: 'POST',
          body: JSON.stringify(data),
        }),

      update: (id: string, data: { name?: string; email?: string; role?: string; language?: string; categoryInInterest?: string[] }) =>
        this.request<{ user: any }>(`/admin/users/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        }),

      updateRole: (id: string, role: string) =>
        this.request<any>(`/admin/users/${id}/role`, {
          method: 'PUT',
          body: JSON.stringify({ role }),
        }),

      resetPassword: (id: string, newPassword: string) =>
        this.request<{ message: string }>(`/admin/users/${id}/reset-password`, {
          method: 'PUT',
          body: JSON.stringify({ newPassword }),
        }),

      delete: (id: string) =>
        this.request<{ message: string }>(`/admin/users/${id}`, {
          method: 'DELETE',
        }),

      bulkDelete: (userIds: string[]) =>
        this.request<{ message: string }>('/admin/users/bulk', {
          method: 'DELETE',
          body: JSON.stringify({ userIds }),
        }),

      bulkUpdateRoles: (userIds: string[], newRole: string) =>
        this.request<{ message: string }>('/admin/users/bulk/roles', {
          method: 'PUT',
          body: JSON.stringify({ userIds, newRole }),
        }),
    },

    questions: {
      list: (params?: { page?: number; limit?: number; search?: string }) => {
        const queryParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
              queryParams.append(key, value.toString());
            }
          });
        }
        const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
        return this.request<{ questions: any[]; pagination: any }>(`/admin/questions${query}`);
      },

      delete: (id: string) =>
        this.request<{ message: string }>(`/admin/questions/${id}`, {
          method: 'DELETE',
        }),
    },
  };

  // Tickets endpoints
  tickets = {
    getById: (id: string) => this.request<any>(`/tickets/${id}`),

    create: (data: { title: string; description: string; category?: string; priority?: string; tags?: string[] }) =>
      this.request<any>('/tickets', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: { status?: string; assignedTo?: string; title?: string; description?: string; category?: string }) =>
      this.request<any>(`/tickets/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      this.request<{ message: string }>(`/tickets/${id}`, {
        method: 'DELETE',
      }),

    addComment: (id: string, content: string, isInternal?: boolean) =>
      this.request<any>(`/tickets/${id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content, isInternal }),
      }),

    assign: (id: string, agentId?: string) =>
      this.request<any>(`/tickets/${id}/assign`, {
        method: 'PATCH',
        body: JSON.stringify({ agentId }),
      }),

    getAgents: () => this.request<any[]>('/tickets/agents'),
  };
}

export const api = new ApiClient();
export { ApiError };