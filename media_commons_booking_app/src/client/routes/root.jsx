import '../styles.css';

import { DatabaseProvider } from './components/Provider';
import { Outlet } from 'react-router-dom';
import React from 'react';

export default function Root() {
  return (
    <DatabaseProvider>
<<<<<<< HEAD
      <NavBar />
=======
      <ThemeProvider theme={theme}>
        <CssBaseline />
>>>>>>> d53fb22 (Apply new ui)

      {/* This is where child route content renders, i.e. the subpages */}
      <Outlet />
    </DatabaseProvider>
  );
}
