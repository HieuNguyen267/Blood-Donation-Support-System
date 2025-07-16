const API_BASE_URL = 'http://localhost:8080';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const fetchNewsList = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/news`, {
    headers: getHeaders()
  });
  if (!response.ok) throw new Error('Lỗi khi lấy danh sách tin tức');
  return response.json();
};

export const createNews = async (data) => {
  const response = await fetch(`${API_BASE_URL}/admin/news`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Lỗi khi thêm tin tức');
  return response.json();
};

export const updateNews = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/admin/news/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Lỗi khi cập nhật tin tức');
  return response.json();
}; 