import api from './api';

export interface CreateContactData {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
}

const contactService = {
  submitContact: async (data: CreateContactData) => {
    const response = await api.post('/contacts', data);
    return response.data;
  },
};

export default contactService;
