import apiClient from './api';

export const aiService = {
  sendMessage: async (message: string, sessionId: number | null = null) => {
    const response = await apiClient.post('/ai/chat/send', {
      message,
      sessionId
    });
    return response.data;
  },

  getSessions: async (page: number = 0, size: number = 10) => {
    const response = await apiClient.get('/ai/chat/sessions', {
      params: { page, size }
    });
    return response.data;
  },


  getSessionMessages: async (sessionId: number) => {
    const response = await apiClient.get(`/ai/chat/sessions/${sessionId}/messages`);
    return response.data;
  },


  getChatHistory: async () => {
    const response = await apiClient.get('/ai/chat/history');
    return response.data;
  },
  
  deleteSession: async (sessionId: number) => {
    const response = await apiClient.delete(`/ai/chat/sessions/${sessionId}`);
    return response.data;
  }
};

export const getAiExplanation = async (questionId: number, studentAnswer: string) => {
  const response = await apiClient.get('/ai-tutor/explain', {
    params: { questionId, studentAnswer }
  });
  return response.data;
};

export const getAiLearningPath = async () => {
  const response = await apiClient.get('/ai-recommendation/my-path');
  return response;
};

export default aiService;
