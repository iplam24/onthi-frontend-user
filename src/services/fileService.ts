import api from './api';

export interface UploadResponse {
  url: string;
  fileName: string;
  originalName: string;
}

export const uploadFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post<{ data: UploadResponse }>('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
