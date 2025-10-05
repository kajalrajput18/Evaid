import useAuthStore from '../store/authStore';

export const useAuth = () => {
  const {
    user,
    token,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateProfile,
    clearError,
    checkAuth,
    isAuthenticated
  } = useAuthStore();

  return {
    // User data
    user,
    token,
    
    // Loading states
    loading: isLoading,
    isLoading,
    
    // Auth state
    isAuthenticated,
    
    // Error handling
    error,
    clearError,
    
    // Auth actions
    login,
    signup,
    logout,
    signIn: login,           
    signUp: signup,            
    signOut: logout,         
    
    // Profile management
    updateProfile,
    
    // Auth check
    checkAuth,
    
    // Mock Google auth 
    signInWithGoogle: () => {
      console.warn('Google authentication not implemented');
      throw new Error('Please use email/password authentication');
    }
  };
};