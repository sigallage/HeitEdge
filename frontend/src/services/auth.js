// frontend/src/services/auth.js
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import api from './api';

// Configuration validator (run this during app initialization)
export const validateAuth0Config = () => {
  const requiredEnvVars = [
    'VITE_AUTH0_DOMAIN',
    'VITE_AUTH0_CLIENT_ID',
    'VITE_AUTH0_AUDIENCE'
  ];

  const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);

  if (missingVars.length > 0) {
    console.error('Missing Auth0 configuration:', missingVars);
    return false;
  }

  return true;
};

// Main authentication hook
export const useAuth = () => {
  const {
    loginWithRedirect,
    logout,
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
    getIdTokenClaims
  } = useAuth0();

  const [authToken, setAuthToken] = useState(null);
  const [isTokenLoading, setIsTokenLoading] = useState(false);

  // Get fresh token and cache it
  const getToken = async (options = {}) => {
    setIsTokenLoading(true);
    try {
      const token = await getAccessTokenSilently(options);
      setAuthToken(token);
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      setAuthToken(null);
      return null;
    } finally {
      setIsTokenLoading(false);
    }
  };

  // Get ID token claims
  const getTokenClaims = async () => {
    try {
      return await getIdTokenClaims();
    } catch (error) {
      console.error('Error getting token claims:', error);
      return null;
    }
  };

  // Login handler with redirect preservation
  const login = async (options = {}) => {
    await loginWithRedirect({
      ...options,
      appState: {
        ...options.appState,
        returnTo: window.location.pathname
      },
      authorizationParams: {
        ...options.authorizationParams,
        redirect_uri: window.location.origin
      }
    });
  };

  // Logout handler
  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
    setAuthToken(null);
  };

  // Automatically attach token to API requests
  useEffect(() => {
    const interceptor = api.interceptors.request.use(async config => {
      if (isAuthenticated && !config.headers.Authorization) {
        const token = authToken || await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, [isAuthenticated, authToken]);

  return {
    // Auth state
    user,
    isAuthenticated,
    isLoading: isLoading || isTokenLoading,
    authToken,
    
    // Methods
    login,
    logout: handleLogout,
    getToken,
    getTokenClaims,
    
    // For API calls
    withAuth: async (request) => {
      const token = authToken || await getToken();
      return request(token);
    }
  };
};

// Higher Order Component for protected routes
export const withAuthenticationRequired = (Component, options = {}) => {
  return function ProtectedRoute(props) {
    const { login, isAuthenticated, isLoading } = useAuth();
    const [verified, setVerified] = useState(false);

    useEffect(() => {
      if (isLoading) return;
      
      if (!isAuthenticated) {
        login({
          appState: { 
            returnTo: window.location.pathname + window.location.search 
          },
          ...options
        });
      } else {
        setVerified(true);
      }
    }, [isAuthenticated, isLoading, login]);

    if (isLoading || !verified) {
      return options.loadingComponent || <div>Authenticating...</div>;
    }

    return <Component {...props} />;
  };
};

// Protected route component (alternative to HOC)
export const ProtectedRoute = ({ children, loadingComponent, ...options }) => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated) {
      login({
        appState: { 
          returnTo: window.location.pathname + window.location.search 
        },
        ...options
      });
    } else {
      setVerified(true);
    }
  }, [isAuthenticated, isLoading, login]);

  if (isLoading || !verified) {
    return loadingComponent || <div>Authenticating...</div>;
  }

  return children;
};