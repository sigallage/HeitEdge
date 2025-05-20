import api from './api';
import { useAuth } from './auth';

export const usePreferences = () => {
  const { user, getToken } = useAuth();

  const getPreferences = async () => {
    try {
      const response = await api.get('/api/user/preferences');
      return response.data;
    } catch (error) {
      console.error('Error fetching preferences:', error);
      return null;
    }
  };

  const updatePreferences = async (updates) => {
    try {
      const response = await api.patch('/api/user/preferences', updates);
      return response.data;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  };

  return { getPreferences, updatePreferences };
};