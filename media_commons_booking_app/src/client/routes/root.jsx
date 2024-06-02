import '../styles.css';

import CssBaseline from '@mui/material/CssBaseline';
import { DatabaseProvider } from './components/Provider';
import NavBar from './components/navBar';
import { Outlet } from 'react-router-dom';
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';

export default function Root() {
  return (
    <DatabaseProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NavBar />

        {/* This is where child route content renders, i.e. the subpages */}
        <Outlet />
      </ThemeProvider>
    </DatabaseProvider>
  );
}
