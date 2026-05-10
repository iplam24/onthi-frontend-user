import apiClient from './api';

export const socialService = {
  follow: async (userId: number) => {
    const response = await apiClient.post(`/social/follow/${userId}`);
    return response.data;
  },

  unfollow: async (userId: number) => {
    const response = await apiClient.post(`/social/unfollow/${userId}`);
    return response.data;
  },

  removeFollower: async (userId: number) => {
    const response = await apiClient.post(`/social/remove-follower/${userId}`);
    return response.data;
  },

  removeFriend: async (userId: number) => {
    const response = await apiClient.post(`/social/remove-friend/${userId}`);
    return response.data;
  },

  isFollowing: async (userId: number) => {
    const response = await apiClient.get(`/social/is-following/${userId}`);
    return response.data;
  },

  getFollowers: async (userId: number, page: number = 0, size: number = 10) => {
    const response = await apiClient.get(`/social/followers/${userId}`, {
      params: { page, size }
    });
    return response.data;
  },

  getFollowing: async (userId: number, page: number = 0, size: number = 10) => {
    const response = await apiClient.get(`/social/following/${userId}`, {
      params: { page, size }
    });
    return response.data;
  },

  getFriends: async (userId: number, page: number = 0, size: number = 10) => {
    const response = await apiClient.get(`/social/friends/${userId}`, {
      params: { page, size }
    });
    return response.data;
  },

  getFollowStats: async (userId: number) => {
    const response = await apiClient.get(`/social/follow-stats/${userId}`);
    return response.data;
  },

  getFeed: async (page: number = 0, size: number = 10) => {
    const response = await apiClient.get('/social/feed', {
      params: { page, size }
    });
    return response.data;
  },

  sendGift: async (receiverId: number, amount: number, message: string) => {
    const response = await apiClient.post('/social/gift', {
      receiverId,
      amount,
      message
    });
    return response.data;
  },

  createPost: async (title: string, content: string, images: string[] = []) => {
    const response = await apiClient.post('/social/posts', { title, content, images });
    return response.data;
  },

  getPosts: async (page: number = 0, size: number = 10) => {
    const response = await apiClient.get('/social/posts', {
      params: { page, size }
    });
    return response.data;
  },

  getUserPosts: async (userId: number, page: number = 0, size: number = 10) => {
    const response = await apiClient.get(`/social/posts/user/${userId}`, {
      params: { page, size }
    });
    return response.data;
  },

  deletePost: async (postId: number) => {
    const response = await apiClient.delete(`/social/posts/${postId}`);
    return response.data;
  },

  likePost: async (id: number) => {
    const response = await apiClient.post(`/social/posts/${id}/like`);
    return response.data;
  },

  unlikePost: async (id: number) => {
    const response = await apiClient.post(`/social/posts/${id}/unlike`);
    return response.data;
  },

  getLikeInfo: async (id: number) => {
    const response = await apiClient.get(`/social/posts/${id}/like-info`);
    return response.data;
  },

  addComment: async (postId: number, content: string, parentId?: number) => {
    const response = await apiClient.post('/social/comments', { postId, content, parentId });
    return response.data;
  },

  getComments: async (postId: number) => {
    const response = await apiClient.get(`/social/comments/post/${postId}`);
    return response.data;
  },

  deleteComment: async (commentId: number) => {
    const response = await apiClient.delete(`/social/comments/${commentId}`);
    return response.data;
  },
  
  updateComment: async (commentId: number, content: string) => {
    const response = await apiClient.put(`/social/comments/${commentId}`, { content });
    return response.data;
  }
};

export default socialService;
