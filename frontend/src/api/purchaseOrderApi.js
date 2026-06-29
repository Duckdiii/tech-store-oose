import axios from 'axios';

const API_URL = 'http://localhost:8080/api/purchase-orders';

export const purchaseOrderApi = {
  getAll: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },
  create: async (data) => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await axios.patch(`${API_URL}/${id}/status`, null, { params: { status } });
    return response.data;
  }
};
