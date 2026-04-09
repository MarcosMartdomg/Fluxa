import api from './api';

const projectsService = {
  getAll: async () => {
    const response = await api.get('/projects');
    return response.data;
  },

  create: async (data: { name: string; description?: string }) => {
    const response = await api.post('/projects', data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  getCanvas: async (id: string) => {
    const response = await api.get(`/projects/${id}/canvas`);
    return response.data;
  },

  updateCanvas: async (id: string, data: { cards: unknown[]; edges: unknown[] }) => {
    const response = await api.put(`/projects/${id}/canvas`, data);
    return response.data;
  },
};

export default projectsService;
