import api from './api';

const logsService = {
  getByExecution: async (executionId: string) => {
    const response = await api.get(`/logs/execution/${executionId}`);
    return response.data;
  },
};

export default logsService;
