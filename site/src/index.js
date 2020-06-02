import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, CSSReset } from '@chakra-ui/core';
import Routes from './routes';
import customTheme from './theme';
import './index.scss'

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={customTheme}>
      <CSSReset />
      <Routes />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)