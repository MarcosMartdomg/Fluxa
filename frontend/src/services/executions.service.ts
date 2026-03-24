import api from './api';

const executionsService = {
  getByWorkflow: async (workflowId: string) => {
    const response = await api.get(`/executions/workflow/${workflowId}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/executions/${id}`);
    return response.data;
  },

  trigger: async (workflowId: string, payload: any) => {
    const response = await api.post(`/executions/workflow/${workflowId}`, payload);
    return response.data;
  },
};

export default executionsService;
