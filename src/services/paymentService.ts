import api from './api';

export const getPaymentStatus = async (orderCode: string | number) => {
  return api.get(`/payment/status/${orderCode}`);
};

export const getTransactions = (page = 0, size = 10) => {
  return api.get<{ data: any }>('/payment/transactions', { params: { page, size } });
};

export const createPayment = async (amount: number) => {
  return api.post('/payment/create', { amount });
};
