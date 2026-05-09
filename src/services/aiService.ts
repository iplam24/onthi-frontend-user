import apiClient from './api';

export const aiService = {
  sendMessage: async (message: string, sessionId: number | null = null) => {
    const response = await apiClient.post('/ai/chat/send', {
      message,
      sessionId
    });
    return response.data;
  },

  getSessions: async () => {
    const response = await apiClient.get('/ai/chat/sessions');
    return response.data;
  },


  getSessionMessages: async (sessionId: number) => {
    const response = await apiClient.get(`/ai/chat/sessions/${sessionId}/messages`);
    return response.data;
  },


  getChatHistory: async () => {
    const response = await apiClient.get('/ai/chat/history');
    return response.data;
  }
};

export const getAiExplanation = async (questionId: number, studentAnswer: string) => {
  const response = await apiClient.get('/ai-tutor/explain', { 
    params: { questionId, studentAnswer } 
  });
  return response.data;
};

export default aiService;
