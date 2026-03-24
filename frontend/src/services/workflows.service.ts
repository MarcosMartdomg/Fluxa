import api from './api';

const workflowsService = {
  getAll: async () => {
    const response = await api.get('/workflows');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/workflows/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/workflows', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.patch(`/workflows/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/workflows/${id}`);
    return response.data;
  },

  toggle: async (id: string, isActive: boolean) => {
    const response = await api.patch(`/workflows/${id}/toggle`, { isActive });
    return response.data;
  },
};

export default workflowsService;
