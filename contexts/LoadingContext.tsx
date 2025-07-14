import React, { createContext, useContext, useState } from 'react';

interface LoadingContextType {
  loading: boolean;
  setLoading: (value: boolean) => void;
  showLoading: () => void;
  hideLoading: () => void;
  loadingMessage?: string;
  setLoadingMessage: (message?: string) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  loading: false,
  setLoading: () => {},
  showLoading: () => {},
  hideLoading: () => {},
  loadingMessage: undefined,
  setLoadingMessage: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>();

  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{ 
      loading, 
      setLoading, 
      showLoading, 
      hideLoading,
      loadingMessage,
      setLoadingMessage
    }}>
      {children}
    </LoadingContext.Provider>
  );
};