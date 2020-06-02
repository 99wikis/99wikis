import React from 'react';
import { useToast } from '@chakra-ui/core';
import { subscribe } from './pubSub';
import config from './config';

const ToastContext = React.createContext(() => {});

function ToastProvider({ children }) {
  const toast = useToast();

  subscribe('showToastr', ({ status, title, description } = {}) => {
    toast({
      ...config.baseToastr,
      status,
      title,
      description,
    });
  }, 'toastrSubscribe');

  return (
    <ToastContext.Provider value={toast}>{children}</ToastContext.Provider>
  );
}

export {
  ToastProvider,
  ToastContext,
};
