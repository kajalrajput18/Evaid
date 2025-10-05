import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Signup function
      signup: async (email, password, fullName) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/signup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
              fullName
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Signup failed');
          }

          set({ 
            user: data.user, 
            token: data.token,
            isAuthenticated: true,
            isLoading: false 
          });

          // Store token in localStorage automatically via persist
          return data;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Login function
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Login failed');
          }

          set({ 
            user: data.user, 
            token: data.token,
            isAuthenticated: true,
            isLoading: false 
          });

          return data;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Logout function
      logout: () => {
        set({ 
          user: null, 
          token: null,
          isAuthenticated: false 
        });
      },

      // Check if user is logged in (useful for page refresh)
      checkAuth: async () => {
        const { token } = get();
        if (!token) {
          set({ isAuthenticated: false });
          return false;
        }

        set({ isLoading: true });
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/me`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Not authenticated');
          }

          const data = await response.json();
          set({ 
            user: data.user,
            isAuthenticated: true,
            isLoading: false 
          });
          return true;
        } catch (error) {
          set({ 
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false 
          });
          return false;
        }
      },

      // Update user profile
      updateProfile: async (updates) => {
        const { token } = get();
        set({ isLoading: true });
        
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(updates),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Profile update failed');
          }

          set({ 
            user: data.user,
            isLoading: false 
          });

          return data;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export default useAuthStore;