import React, { createContext, useContext, useState, useCallback } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [toastState, setToastState] = useState({
    isOpen: false,
    message: '',
  });

  const showToast = useCallback((message) => {
    setToastState({ isOpen: true, message });
    setTimeout(() => {
      setToastState((prev) => ({ ...prev, isOpen: false }));
    }, 3200);
  }, []);

  return (
    <UIContext.Provider
      value={{
        toastState,
        showToast,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}

